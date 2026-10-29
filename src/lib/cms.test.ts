import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseEventFile } from "../data/models/eventSchema.ts";
import { parseSpotlightFile } from "../data/models/spotlightSchema.ts";
import { MdxEventsDataSource } from "../data/datasources/MdxEventsDataSource.ts";
import { MdxSpotlightDataSource } from "../data/datasources/MdxSpotlightDataSource.ts";
import { eventStatus } from "../domain/usecases/eventQueries.ts";
import robots from "../app/robots.ts";
import sitemap from "../app/sitemap.ts";

// Literal files as Keystatic writes them: unquoted UTC wall-time dates, empty optionals left out.
const keystaticPost = `---
title: Gala night
date: 2026-11-14T09:00:00.000Z
dek: One sentence.
excerpt: Two lines.
author: Jane
draft: false
---
<PullQuote quote="We won four" attribution="The president" />
`;
const keystaticEvent = `---
title: Angular workshop
category: workshop
date: 2026-11-14T09:00:00.000Z
endDate: 2026-11-14T13:00:00.000Z
venue: Strathmore University
speaker: Jane
community: Web Dev
image: /images/events/angular-workshop/image.jpg
imageAlt: Poster
excerpt: Build components.
---
Bring a laptop.
`;

test("schema parity: Keystatic-format files parse and dates become Nairobi time", () => {
  const post = parseSpotlightFile("recap", "recap/gala.mdx", keystaticPost);
  assert.equal(post.date, "2026-11-14T09:00:00+03:00");
  assert.equal(post.coverImage, undefined);
  const event = parseEventFile("src/content/events/angular-workshop.mdx", keystaticEvent);
  assert.equal(event.slug, "angular-workshop");
  assert.equal(event.date, "2026-11-14T09:00:00+03:00");
  assert.equal(event.endDate, "2026-11-14T13:00:00+03:00");
  assert.equal(event.virtualUrl, undefined);
  // Quoted strings with an offset, as hand-written before, still work.
  const quoted = keystaticEvent.replace("date: 2026-11-14T09:00:00.000Z", 'date: "2026-11-14T09:00:00+03:00"');
  assert.equal(parseEventFile("x.mdx", quoted).date, "2026-11-14T09:00:00+03:00");
  // A quoted "…Z" string is a real UTC time: it is not relabelled as Nairobi wall time.
  const utc = keystaticEvent.replace("date: 2026-11-14T09:00:00.000Z", 'date: "2026-11-14T06:00:00Z"');
  const utcDate = parseEventFile("x.mdx", utc).date;
  assert.equal(utcDate, "2026-11-14T06:00:00Z");
  assert.equal(Date.parse(utcDate), Date.parse("2026-11-14T09:00:00+03:00"));
});

test("empty optionals saved as blank or null count as missing", () => {
  const blanks = keystaticEvent.replace("venue: Strathmore University", "venue: Strathmore University\nvirtualUrl: ''");
  assert.equal(parseEventFile("x.mdx", blanks).virtualUrl, undefined);
  const nulls = keystaticPost.replace("draft: false", "draft: false\neventSlug: null\ncoverImage: ''");
  assert.equal(parseSpotlightFile("coming-up", "x.mdx", nulls).eventSlug, undefined);
});

test("a bad file fails with its path in the error", () => {
  assert.throws(
    () => parseEventFile("src/content/events/bad.mdx", keystaticEvent.replace("category: workshop", "category: party")),
    /src\/content\/events\/bad\.mdx/,
  );
  assert.throws(
    () => parseSpotlightFile("recap", "src/content/spotlight/recap/bad.mdx", keystaticPost.replace("author: Jane\n", "")),
    /src\/content\/spotlight\/recap\/bad\.mdx/,
  );
});

test("the same slug in two kind folders throws naming both files", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "spotlight-"));
  try {
    for (const kind of ["recap", "in-the-works"]) {
      mkdirSync(path.join(dir, kind));
      writeFileSync(path.join(dir, kind, "x.mdx"), keystaticPost);
    }
    await assert.rejects(new MdxSpotlightDataSource(dir).readAll(), (e: Error) => {
      assert.match(e.message, /recap[\\/]x\.mdx/);
      assert.match(e.message, /in-the-works[\\/]x\.mdx/);
      return true;
    });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("an .mdx at the spotlight root, outside a kind folder, throws naming it", async () => {
  const dir = mkdtempSync(path.join(tmpdir(), "spotlight-"));
  try {
    writeFileSync(path.join(dir, "README.md"), "# ok");
    mkdirSync(path.join(dir, "recap"));
    writeFileSync(path.join(dir, "recap", "fine.mdx"), keystaticPost);
    assert.equal((await new MdxSpotlightDataSource(dir).readAll()).length, 1);
    writeFileSync(path.join(dir, "stray.mdx"), keystaticPost);
    await assert.rejects(new MdxSpotlightDataSource(dir).readAll(), /stray\.mdx/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the six migrated posts keep their slugs and kinds", async () => {
  const real = (await new MdxSpotlightDataSource().readAll()).map((p) => `${p.kind}/${p.slug}`).sort();
  assert.deepEqual(real, [
    "coming-up/build-weekend-hackathon-announcement",
    "in-the-works/members-project-in-progress",
    "member/alumni-story-draft",
    "member/member-spotlight-placeholder",
    "recap/clubs-sports-gala-recap",
    "recap/em-technology-house-visit",
  ]);
});

test("eventStatus is live between date and endDate, completed after, scheduled before", () => {
  const [start, end] = ["2026-11-14T09:00:00+03:00", "2026-11-14T13:00:00+03:00"];
  assert.equal(eventStatus(start, end, new Date("2026-11-14T08:59:00+03:00")), "scheduled");
  assert.equal(eventStatus(start, end, new Date(start)), "live");
  assert.equal(eventStatus(start, end, new Date("2026-11-14T12:00:00+03:00")), "live");
  assert.equal(eventStatus(start, end, new Date(end)), "completed");
  assert.equal(eventStatus(start, end, new Date("2026-12-01T00:00:00+03:00")), "completed");
});

test("sitemap lists pages, every event and published posts, but no drafts", async () => {
  const urls = (await sitemap()).map((e) => e.url);
  assert.ok(urls.includes("https://scesa.com/"));
  for (const e of await new MdxEventsDataSource().readAll()) assert.ok(urls.includes(`https://scesa.com/events/${e.slug}`), e.slug);
  for (const p of await new MdxSpotlightDataSource().readAll()) {
    assert.equal(urls.includes(`https://scesa.com/spotlight/${p.slug}`), !p.draft, p.slug);
  }
  assert.ok(!urls.some((u) => u.endsWith("/spotlight/alumni-story-draft")));
});

test("robots disallows the editor and the API", () => {
  const { rules } = robots();
  const disallow = [rules].flat().flatMap((r) => [r.disallow ?? []].flat());
  assert.ok(disallow.includes("/keystatic"));
  assert.ok(disallow.includes("/api"));
});
