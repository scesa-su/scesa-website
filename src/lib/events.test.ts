import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import { MdxEventsDataSource } from "../data/datasources/MdxEventsDataSource.ts";
import type { Event } from "../domain/entities/Event.ts";
import { filterEvents, parseFilter, sortNewestFirst } from "../domain/usecases/eventQueries.ts";
import { parseEventFile } from "../data/models/eventSchema.ts";
import { buildIcs, escapeIcsText } from "./ics.ts";
import { formatTimeRange } from "./dates.ts";

const base: Event = {
  slug: "x",
  title: "Angular Workshop",
  status: "scheduled",
  category: "workshop",
  date: "2026-11-14T09:00:00+03:00",
  endDate: "2026-11-14T13:00:00+03:00",
  venue: "Strathmore",
  speaker: "Jane",
  hosts: ["Web Dev"],
  image: "/i.svg",
  imageAlt: "alt",
  excerpt: "e",
  body: "",
};
const events: Event[] = [
  { ...base, slug: "ws" },
  { ...base, slug: "hack", title: "Hack Weekend", category: "hackathon", status: "live", speaker: "Judges", hosts: ["GDSC", "AWS Club"] },
  { ...base, slug: "old", title: "Meetup", category: "meetup", status: "completed", speaker: undefined, hosts: ["Angular Kenya"] },
];
const slugs = (list: Event[]) => list.map((e) => e.slug);

test("parseFilter falls back to all for unknown values", () => {
  assert.equal(parseFilter("upcoming"), "upcoming");
  assert.equal(parseFilter("nope"), "all");
  assert.equal(parseFilter(undefined), "all");
  assert.equal(parseFilter(["upcoming"]), "all");
});

test("filterEvents by filter", () => {
  assert.deepEqual(slugs(filterEvents(events, "all")), ["ws", "hack", "old"]);
  assert.deepEqual(slugs(filterEvents(events, "upcoming")), ["ws", "hack"]);
  assert.deepEqual(slugs(filterEvents(events, "workshops")), ["ws"]);
  assert.deepEqual(slugs(filterEvents(events, "hackathons")), ["hack"]);
  assert.deepEqual(slugs(filterEvents(events, "completed")), ["old"]);
});

test("filterEvents search is case-insensitive over title, speaker and hosts", () => {
  assert.deepEqual(slugs(filterEvents(events, "all", "ANGULAR")), ["ws", "old"]);
  assert.deepEqual(slugs(filterEvents(events, "all", "judges")), ["hack"]);
  assert.deepEqual(slugs(filterEvents(events, "all", "gdsc")), ["hack"]);
  assert.deepEqual(slugs(filterEvents(events, "all", "   ")), ["ws", "hack", "old"]);
  assert.deepEqual(slugs(filterEvents(events, "workshops", "x")), []);
});

test("sortNewestFirst orders by start date descending without mutating", () => {
  const input = [
    { ...base, slug: "a", date: "2026-01-01T10:00:00+03:00" },
    { ...base, slug: "b", date: "2026-03-01T10:00:00+03:00" },
    { ...base, slug: "c", date: "2026-02-01T10:00:00Z" },
  ];
  assert.deepEqual(slugs(sortNewestFirst(input)), ["b", "c", "a"]);
  assert.deepEqual(slugs(input), ["a", "b", "c"]);
});

const file = (frontmatter: string) => `---\n${frontmatter}\n---\n\nBody text`;
const valid = `title: "T"
category: talk
date: "2026-11-14T09:00:00+03:00"
endDate: "2026-11-14T10:00:00+03:00"
location:
  discriminant: in-person
  value:
    venue: "V"
speaker: "S"
hosts:
  - "C"
image: "/i.svg"
imageAlt: "A"
excerpt: "E"`;

test("parseEventFile returns an event with slug and body", () => {
  const event = parseEventFile("my-talk.mdx", file(valid));
  assert.equal(event.slug, "my-talk");
  assert.equal(event.title, "T");
  assert.match(event.body, /Body text/);
});

test("parseEventFile rejects bad frontmatter and names the file", () => {
  const cases = [
    valid.replace('title: "T"\n', ""),
    valid.replace('date: "2026-11-14T09:00:00+03:00"', 'date: "14 Nov"'),
    valid.replace('date: "2026-11-14T09:00:00+03:00"', 'date: "2026-11-14T09:00:00"'),
    valid.replace('endDate: "2026-11-14T10:00:00+03:00"', 'endDate: "2026-11-14T08:00:00+03:00"'),
    valid.replace('    venue: "V"', ""),
    valid.replace('hosts:\n  - "C"', "hosts: []"),
    valid.replace('speaker: "S"\n', 'speaker: "S"\nregistrationUrl: "javascript:alert(1)"\n'),
    valid.replace("category: talk", "category: party"),
  ];
  for (const fm of cases) {
    assert.throws(() => parseEventFile("foo.mdx", file(fm)), /foo\.mdx/);
  }
});

test("escapeIcsText escapes per RFC 5545", () => {
  assert.equal(escapeIcsText("a,b;c\\d\ne"), "a\\,b\\;c\\\\d\\ne");
  assert.equal(escapeIcsText("a\rATTACH:x\r\nb"), "a\\nATTACH:x\\nb");
});

test("buildIcs emits CRLF lines with UTC times and escaped text", () => {
  const ics = buildIcs({ ...base, title: "Hack, Build; Ship" }, "https://scesa.co.ke/events/x");
  assert.ok(ics.endsWith("\r\n"));
  assert.ok(!/[^\r]\n/.test(ics), "every newline is CRLF");
  const lines = ics.split("\r\n");
  assert.ok(lines.includes("DTSTART:20261114T060000Z"));
  assert.ok(lines.includes("DTEND:20261114T100000Z"));
  assert.ok(lines.includes("SUMMARY:Hack\\, Build\\; Ship"));
  assert.ok(lines.includes("LOCATION:Strathmore"));
  assert.ok(lines.every((l) => new TextEncoder().encode(l).length <= 75));
});

test("buildIcs folds long lines", () => {
  const ics = buildIcs({ ...base, excerpt: "x".repeat(200) }, "https://scesa.co.ke/events/x");
  const unfolded = ics.replace(/\r\n /g, "");
  assert.ok(unfolded.includes(`DESCRIPTION:${"x".repeat(200)}\\n\\nhttps://scesa.co.ke/events/x`));
});

test("formatTimeRange uses Nairobi time", () => {
  assert.equal(formatTimeRange("2026-11-14T06:00:00Z", "2026-11-14T10:00:00Z"), "9:00 am – 1:00 pm EAT");
});

test("formatTimeRange prefixes the end date for multi-day events", () => {
  assert.equal(formatTimeRange("2026-11-28T05:00:00Z", "2026-11-29T15:00:00Z"), "8:00 am – 29 Nov 2026, 6:00 pm EAT");
});

test("buildIcs uses the virtual link when there is no venue", () => {
  const virtualUrl = "https://meet.example.com/abc";
  const ics = buildIcs({ ...base, venue: undefined, virtualUrl }, "https://scesa.co.ke/events/x");
  const unfolded = ics.replace(/\r\n /g, "");
  assert.ok(unfolded.split("\r\n").includes(`LOCATION:${virtualUrl}`));
  assert.ok(unfolded.includes(`Join online: ${virtualUrl}`));
});

test("parseEventFile accepts virtualUrl without venue and rejects javascript: URLs", () => {
  const virtualOnly = valid.replace('venue: "V"', 'virtualUrl: "https://meet.example.com/abc"');
  assert.equal(parseEventFile("v.mdx", file(virtualOnly)).virtualUrl, "https://meet.example.com/abc");
  const js = valid.replace('venue: "V"', 'virtualUrl: "javascript:alert(1)"');
  assert.throws(() => parseEventFile("foo.mdx", file(js)), /foo\.mdx/);
});

test("real events parse and their posters exist", async () => {
  // Empty when every event has been deleted in Keystatic, which also removes the folder.
  const real = await new MdxEventsDataSource().readAll();
  for (const e of real) assert.ok(existsSync(path.join("public", e.image)), `${e.slug}: missing public${e.image}`);
});
