import { test } from "node:test";
import assert from "node:assert/strict";
import { accessTokenFrom, canEdit } from "./keystatic.ts";

test("accessTokenFrom reads Keystatic's access token cookie", () => {
  const cookies = [
    "keystatic-gh-access-token=ghu_a%2Bb; Path=/; Max-Age=28800; SameSite=Lax",
    "keystatic-gh-refresh-token=secret; Path=/; HttpOnly",
  ];
  assert.equal(accessTokenFrom(cookies), "ghu_a+b");
  assert.equal(accessTokenFrom(["other=1"]), undefined);
});

test("canEdit is true only when GitHub says the account can push", async () => {
  const reply = (status: number, body: unknown) => (async () => new Response(JSON.stringify(body), { status })) as typeof fetch;
  assert.equal(await canEdit("t", reply(200, { permissions: { push: true } })), true);
  assert.equal(await canEdit("t", reply(200, { permissions: { push: false, pull: true } })), false);
  assert.equal(await canEdit("t", reply(200, {})), false);
  assert.equal(await canEdit("t", reply(401, { message: "Bad credentials" })), false);
  assert.equal(await canEdit("t", (async () => { throw new Error("offline"); }) as typeof fetch), false);
});
