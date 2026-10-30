import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import type { SpotlightPost } from "../domain/entities/SpotlightPost.ts";
import {
  filterByKind,
  parseKind,
  readingMinutes,
  relatedPosts,
  sortPostsNewestFirst,
  visiblePosts,
} from "../domain/usecases/spotlightQueries.ts";
import { parseSpotlightFile } from "../data/models/spotlightSchema.ts";
import { MdxSpotlightDataSource } from "../data/datasources/MdxSpotlightDataSource.ts";
import { SpotlightRepository } from "../data/repositories/SpotlightRepository.ts";
import { mailtoHref } from "./mailto.ts";

const base: SpotlightPost = {
  slug: "x",
  title: "T",
  kind: "recap",
  date: "2026-06-01T10:00:00+03:00",
  dek: "D",
  excerpt: "E",
  author: "A",
  draft: false,
  readingMinutes: 1,
  body: "",
};
const posts: SpotlightPost[] = [
  { ...base, slug: "gala", date: "2026-06-20T10:00:00+03:00" },
  { ...base, slug: "visit", date: "2026-06-10T10:00:00+03:00" },
  { ...base, slug: "app", kind: "in-the-works", date: "2026-10-01T10:00:00+03:00" },
  { ...base, slug: "hack", kind: "coming-up", date: "2026-10-20T10:00:00+03:00" },
  { ...base, slug: "draft", kind: "member", date: "2026-10-25T10:00:00+03:00", draft: true },
];
const slugs = (list: SpotlightPost[]) => list.map((p) => p.slug);

const file = (frontmatter: string, body = "Body text") => `---\n${frontmatter}\n---\n\n${body}`;
const valid = `title: "T"
date: "2026-06-20T10:00:00+03:00"
dek: "D"
excerpt: "E"
author: "A"`;
const member = `${valid}
member:
  name: "N"
  degree: "BBIT"
  year: "Year 3"
  quote: "Q"`;

test("parseSpotlightFile returns a post with slug, body, reading time and draft default", () => {
  const post = parseSpotlightFile("recap", "gala-night.mdx", file(valid));
  assert.equal(post.slug, "gala-night");
  assert.equal(post.kind, "recap");
  assert.equal(post.draft, false);
  assert.equal(post.readingMinutes, 1);
  assert.match(post.body, /Body text/);
  assert.equal(parseSpotlightFile("member", "m.mdx", file(member)).member?.quote, "Q");
});

test("parseSpotlightFile rejects bad frontmatter and names the file", () => {
  const cases = [
    valid.replace('title: "T"\n', ""),
    valid.replace('date: "2026-06-20T10:00:00+03:00"', 'date: "20 Jun"'),
    valid.replace('date: "2026-06-20T10:00:00+03:00"', 'date: "2026-06-20T10:00:00"'),
    `${valid}\ncoverImage: "/images/x.jpg"`,
    `${valid}\ndraft: "yes"`,
  ];
  for (const fm of cases) {
    assert.throws(() => parseSpotlightFile("recap", "recap/bad-post.mdx", file(fm)), /recap\/bad-post\.mdx/);
  }
  // Member posts, found by their folder, need member details.
  for (const fm of [valid, member.replace('  quote: "Q"', "")]) {
    assert.throws(() => parseSpotlightFile("member", "member/bad-post.mdx", file(fm)), /member\/bad-post\.mdx/);
  }
});

test("sortPostsNewestFirst orders by date descending without mutating", () => {
  assert.deepEqual(slugs(sortPostsNewestFirst(posts)), ["draft", "hack", "app", "gala", "visit"]);
  assert.deepEqual(slugs(posts), ["gala", "visit", "app", "hack", "draft"]);
});

test("filterByKind returns only that kind; an unknown kind falls back to all", () => {
  assert.deepEqual(slugs(filterByKind(posts, "recap")), ["gala", "visit"]);
  assert.deepEqual(slugs(filterByKind(posts, parseKind("coming-up"))), ["hack"]);
  assert.equal(parseKind("nope"), undefined);
  assert.equal(parseKind(["recap"]), undefined);
  assert.deepEqual(slugs(filterByKind(posts, parseKind("nope"))), slugs(posts));
});

test("drafts are excluded in production mode and kept in dev", () => {
  assert.deepEqual(slugs(visiblePosts(posts, false)), ["gala", "visit", "app", "hack"]);
  assert.equal(visiblePosts(posts, true).length, posts.length);
  // A kind whose only post is a draft is empty in production, which the feed shows as its empty state.
  assert.deepEqual(filterByKind(visiblePosts(posts, false), "member"), []);
});

test("readingMinutes is computed from the body at 200 words a minute", () => {
  assert.equal(readingMinutes(""), 1);
  assert.equal(readingMinutes("word ".repeat(200)), 1);
  assert.equal(readingMinutes("word ".repeat(201)), 2);
  assert.equal(parseSpotlightFile("recap", "long.mdx", file(valid, "word ".repeat(450))).readingMinutes, 3);
});

test("relatedPosts excludes the current post and puts the same kind first", () => {
  const sorted = sortPostsNewestFirst(posts);
  const gala = sorted.find((p) => p.slug === "gala")!;
  assert.deepEqual(slugs(relatedPosts(sorted, gala)), ["visit", "draft", "hack"]);
  assert.deepEqual(slugs(relatedPosts(sorted, gala, 2)), ["visit", "draft"]);
  assert.ok(!slugs(relatedPosts(sorted, gala, 10)).includes("gala"));
});

test("mailtoHref encodes spaces, line breaks, & and ?", () => {
  const href = mailtoHref({
    to: "scesa@strathmore.edu",
    subject: "Spotlight story: [your name]",
    body: "Name: Q&A?\nLinks: a b",
  });
  assert.equal(
    href,
    "mailto:scesa@strathmore.edu?subject=Spotlight%20story%3A%20%5Byour%20name%5D&body=Name%3A%20Q%26A%3F%0D%0ALinks%3A%20a%20b",
  );
  assert.equal(mailtoHref({ to: "a@b.c" }), "mailto:a@b.c");
  assert.equal(mailtoHref({ to: "a@b.c", body: "x\r\ny" }), "mailto:a@b.c?body=x%0D%0Ay");
});

test("SpotlightRepository hides drafts in production from the feed, article lookup and related posts", async () => {
  const source = { readAll: async () => posts } as MdxSpotlightDataSource;
  const prod = new SpotlightRepository(source, false);
  assert.deepEqual(slugs(await prod.getAll()), ["hack", "app", "gala", "visit"]);
  assert.deepEqual(slugs(await prod.getAll("recap")), ["gala", "visit"]);
  assert.equal(await prod.getBySlug("draft"), undefined);
  assert.ok(!slugs(await prod.getRelated("gala", 10)).includes("draft"));
  assert.deepEqual(await prod.getRelated("nope"), []);
  assert.equal((await new SpotlightRepository(source, true).getBySlug("draft"))?.slug, "draft");
});

test("real spotlight posts parse, use slug file names, and their images and events exist", async () => {
  const real = await new MdxSpotlightDataSource().readAll();
  assert.ok(real.length > 0);
  for (const p of real) {
    assert.match(p.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, `bad file name ${p.slug}`);
    for (const img of [p.coverImage, p.member?.photo, ...(p.gallery ?? []).map((g) => g.image)])
      if (img) assert.ok(existsSync(path.join("public", img)), `${p.slug}: missing public${img}`);
    if (p.eventSlug)
      assert.ok(existsSync(path.join("src/content/events", `${p.eventSlug}.mdx`)), `${p.slug}: no event ${p.eventSlug}`);
  }
});

test("parseSpotlightFile reads gallery, project and member photo, and rejects bad values naming the file", () => {
  const project = `${valid}
project:
  stage: building
  team: ["A", "B"]
  links:
    - { label: "Repo", url: "https://github.com/x/y" }
gallery:
  - { image: "/images/a.jpg", alt: "A" }`;
  const post = parseSpotlightFile("in-the-works", "p.mdx", file(project));
  assert.equal(post.project?.stage, "building");
  assert.deepEqual(post.project?.team, ["A", "B"]);
  assert.equal(post.gallery?.[0].alt, "A");
  const photo = `${member}\n  photo: "/images/m.jpg"\n  photoAlt: "M"`;
  assert.equal(parseSpotlightFile("member", "m.mdx", file(photo)).member?.photoAlt, "M");
  for (const fm of [
    project.replace("stage: building", "stage: done"),
    project.replace("https://github.com", "http://github.com"),
    `${member}\n  photo: "/images/m.jpg"`,
    `${member}\n  links:\n    - { label: "Site", url: "http://x.com" }`,
    `${valid}\ngallery:\n  - { image: "/images/a.jpg" }`,
  ]) {
    assert.throws(() => parseSpotlightFile("member", "bad-post.mdx", file(fm)), /bad-post\.mdx/);
  }
});
