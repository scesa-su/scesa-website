import { test } from "node:test";
import assert from "node:assert/strict";
import { clientIp, createRateLimiter } from "./rateLimit.ts";

test("rate limiter allows the limit, blocks the next hit, and resets after the window", () => {
  const allow = createRateLimiter(5, 600_000);
  for (let i = 0; i < 5; i++) assert.equal(allow("1.2.3.4", 1000), true);
  assert.equal(allow("1.2.3.4", 2000), false);
  assert.equal(allow("5.6.7.8", 2000), true, "other keys are separate");
  assert.equal(allow("1.2.3.4", 601_000), true, "new window");
});

test("clientIp takes the first forwarded hop", () => {
  assert.equal(clientIp(new Headers({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" })), "9.9.9.9");
  assert.equal(clientIp(new Headers()), "unknown");
});
