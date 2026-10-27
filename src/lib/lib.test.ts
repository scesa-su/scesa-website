import { test } from "node:test";
import assert from "node:assert/strict";
import { cn } from "./cn.ts";
import { isActivePath } from "./constants.ts";
import { wrapIndex } from "./wrap.ts";

test("cn keeps custom text sizes next to text colours", () => {
  assert.equal(cn("text-display-lg", "text-brand-primary"), "text-display-lg text-brand-primary");
  assert.equal(cn("text-md", "text-orange-700"), "text-md text-orange-700");
  assert.equal(cn("text-display-lg", "text-display-sm"), "text-display-sm");
});

test("isActivePath matches / exactly and other links by segment", () => {
  assert.equal(isActivePath("/", "/"), true);
  assert.equal(isActivePath("/events/x", "/"), false);
  assert.equal(isActivePath("/events", "/events"), true);
  assert.equal(isActivePath("/events/x", "/events"), true);
  assert.equal(isActivePath("/eventsfoo", "/events"), false);
});

test("wrapIndex loops past both ends", () => {
  assert.equal(wrapIndex(-1, 5), 4);
  assert.equal(wrapIndex(5, 5), 0);
  assert.equal(wrapIndex(0, 5), 0);
  assert.equal(wrapIndex(11, 5), 1);
});
