import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type { Leader } from "../domain/entities/Leader.ts";
import { sortLeaders } from "../domain/usecases/leaderQueries.ts";
import { parseLeadersFile, parsePartnersFile } from "../data/models/aboutSchema.ts";

const leader = (name: string, role: string): Leader => ({ name, role, photo: "/images/about/x.png" });

test("sortLeaders puts fixed roles in order, unknown roles after alphabetically", () => {
  const input = [
    leader("Zed", "Events Lead"),
    leader("Emma", "Director of Communications"),
    leader("Amy", "Alumni Liaison"),
    leader("Nathan", "President"),
    leader("Daisy", "Secretary"),
    leader("Ravine", "Vice President"),
  ];
  assert.deepEqual(
    sortLeaders(input).map((l) => l.name),
    ["Nathan", "Ravine", "Daisy", "Emma", "Amy", "Zed"],
  );
  assert.equal(input[0].name, "Zed", "does not mutate input");
});

test("parseLeadersFile accepts valid data", () => {
  const raw = JSON.stringify([leader("Nathan", "President")]);
  assert.equal(parseLeadersFile("leaders.json", raw)[0].name, "Nathan");
});

test("parseLeadersFile rejects missing name, empty role, bad photo and bad JSON, naming the file", () => {
  const bad = [
    JSON.stringify([{ role: "President", photo: "/images/a.png" }]),
    JSON.stringify([{ name: "A", role: "  ", photo: "/images/a.png" }]),
    JSON.stringify([{ name: "A", role: "B", photo: "a.png" }]),
    JSON.stringify({ name: "A" }),
    "{ not json",
  ];
  for (const raw of bad) assert.throws(() => parseLeadersFile("leaders.json", raw), /leaders\.json/);
});

test("parsePartnersFile allows no logo but rejects missing name and logo outside /images/", () => {
  assert.equal(parsePartnersFile("partners.json", '[{"name":"Angular Kenya"}]')[0].logo, undefined);
  assert.throws(() => parsePartnersFile("partners.json", '[{"logo":"/images/a.png"}]'), /partners\.json/);
  assert.throws(
    () => parsePartnersFile("partners.json", '[{"name":"A","logo":"https://x.com/a.png"}]'),
    /partners\.json/,
  );
});

test("real leaders.json and partners.json parse and every image exists under public/", () => {
  const read = (f: string) => readFileSync(path.join("src/content/about", f), "utf8");
  const leaders = parseLeadersFile("leaders.json", read("leaders.json"));
  const partners = parsePartnersFile("partners.json", read("partners.json"));
  for (const img of [...leaders.map((l) => l.photo), ...partners.flatMap((p) => (p.logo ? [p.logo] : []))])
    assert.ok(existsSync(path.join("public", img)), `missing public${img}`);
});
