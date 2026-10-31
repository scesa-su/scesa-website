import { beforeEach, test, type TestContext } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { POST as register } from "./route.ts";
import { POST as status } from "../membership-status/route.ts";
import { POST as check } from "./check/route.ts";

// Throwaway key and made-up rows; no real credentials or member data.
const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const ENV = {
  GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.iam.gserviceaccount.com",
  GOOGLE_PRIVATE_KEY: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
  MEMBERS_SHEET_ID: "sheet",
  WHATSAPP_INVITE_URL: "https://chat.whatsapp.com/example",
};
// Members columns the routes read: A reference, C student_id, I mpesa_code, K payment_status.
const SHEET: Record<string, string[]> = {
  A: ["SC-AAAAAAAA", "SC-BBBBBBBB"],
  C: ["111111", "222222"],
  I: ["CODE000001", "CODE000002"],
  K: ["confirmed", "pending"],
};

let appended: unknown[][];
let ip = 0;

beforeEach(() => {
  Object.assign(process.env, ENV);
  appended = [];
});

/** Fake Google: token endpoint, batchGet by column letter, append. `down` makes every call throw. */
function mockGoogle(t: TestContext, down = false) {
  t.mock.method(globalThis, "fetch", async (input: string, init?: RequestInit) => {
    if (down) throw new TypeError("network down");
    const url = new URL(input);
    if (url.hostname === "oauth2.googleapis.com") return Response.json({ access_token: "t", expires_in: 3600 });
    if (url.pathname.endsWith(":append")) {
      appended.push(...(JSON.parse(String(init?.body)) as { values: unknown[][] }).values);
      return Response.json({});
    }
    const valueRanges = url.searchParams.getAll("ranges").map((r) => ({ values: SHEET[r.split("!")[1][0]].map((v) => [v]) }));
    return Response.json({ valueRanges });
  });
}

const post = (handler: (r: Request) => Promise<Response>, body: unknown, from = `10.0.0.${++ip}`) =>
  handler(
    new Request("http://localhost/api", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": from },
      body: JSON.stringify(body),
    }),
  );

const application = (patch: object = {}) => ({
  fullName: "Test Student",
  studentId: "333333",
  email: "test@strathmore.edu",
  phone: `07${String(++ip).padStart(8, "0")}`,
  course: "BSc Computer Science",
  year: "2",
  communities: ["IET"],
  mpesaCode: "NEWCODE001",
  website: "",
  ...patch,
});

test("happy path: appends one pending row with the server fee and returns 201 with a reference", async (t) => {
  mockGoogle(t);
  const res = await post(register, { ...application(), amountKes: 1 });
  assert.equal(res.status, 201);
  const { reference } = (await res.json()) as { reference: string };
  assert.match(reference, /^SC-/);
  assert.equal(appended.length, 1);
  assert.deepEqual(appended[0].slice(8, 11), ["NEWCODE001", 500, "pending"]);
});

test("duplicate student ID or M-Pesa code: 409 and nothing appended", async (t) => {
  mockGoogle(t);
  assert.equal((await post(register, application({ studentId: "111111" }))).status, 409);
  assert.equal((await post(register, application({ mpesaCode: "CODE000002" }))).status, 409);
  assert.equal(appended.length, 0);
});

test("bad input: 400 with field errors", async (t) => {
  mockGoogle(t);
  const res = await post(register, application({ studentId: "12345", email: "a@gmail.com", phone: "0812345678", mpesaCode: "ABC123456" }));
  assert.equal(res.status, 400);
  const { fieldErrors } = (await res.json()) as { fieldErrors: Record<string, string[]> };
  assert.deepEqual(Object.keys(fieldErrors).sort(), ["email", "mpesaCode", "phone", "studentId"]);
});

test("honeypot filled: 200 with a fake reference and nothing stored", async (t) => {
  mockGoogle(t);
  const res = await post(register, application({ website: "https://spam.example" }));
  assert.equal(res.status, 200);
  assert.match(((await res.json()) as { reference: string }).reference, /^SC-/);
  assert.equal(appended.length, 0);
});

test("flood: the 6th submission from one IP within 10 minutes gets 429", async (t) => {
  mockGoogle(t);
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await post(register, application({ studentId: "12345" }), "10.9.9.9")).status);
  assert.deepEqual(codes, [400, 400, 400, 400, 400, 429]);
});

test("per phone: the 4th valid submission from one number, even from new IPs, gets 429 and is not stored", async (t) => {
  mockGoogle(t);
  const phone = "0799999999";
  const codes = [];
  for (let i = 1; i <= 4; i++) {
    codes.push((await post(register, application({ phone, studentId: `40000${i}`, mpesaCode: `PHONE0000${i}` }))).status);
  }
  assert.deepEqual(codes, [201, 201, 201, 429]);
  assert.equal(appended.length, 3);
});

test("status: Sheets down or invite URL missing gives 503", async (t) => {
  mockGoogle(t, true);
  const down = await post(status, { reference: "SC-AAAAAAAA", studentId: "111111" });
  assert.equal(down.status, 503);
  assert.match(((await down.json()) as { error: string }).error, /couldn't check your status/);
  delete process.env.WHATSAPP_INVITE_URL;
  assert.equal((await post(status, { reference: "SC-AAAAAAAA", studentId: "111111" })).status, 503);
});

test("Sheets down: 503; env vars missing: 503 'temporarily closed'", async (t) => {
  mockGoogle(t, true);
  assert.equal((await post(register, application())).status, 503);
  delete process.env.MEMBERS_SHEET_ID;
  const res = await post(register, application());
  assert.equal(res.status, 503);
  assert.match(((await res.json()) as { error: string }).error, /temporarily closed/);
});

test("status: confirmed pair gets the invite, pending gets none, a wrong pair gets the generic 404", async (t) => {
  mockGoogle(t);
  const confirmed = await post(status, { reference: "sc-aaaaaaaa", studentId: "111111" });
  assert.deepEqual(await confirmed.json(), { status: "confirmed", inviteUrl: ENV.WHATSAPP_INVITE_URL });
  const pending = await post(status, { reference: "SC-BBBBBBBB", studentId: "222222" });
  assert.deepEqual(await pending.json(), { status: "pending" });
  const wrong = await post(status, { reference: "SC-AAAAAAAA", studentId: "222222" });
  const malformed = await post(status, { reference: "nope", studentId: "1" });
  assert.equal(wrong.status, 404);
  assert.deepEqual(await wrong.json(), await malformed.json());
});

test("check: a registered ID says so before payment, a new or rejected-only ID does not", async (t) => {
  mockGoogle(t);
  const registered = async (studentId: string) => ((await (await post(check, { studentId })).json()) as { registered: boolean }).registered;
  assert.equal(await registered("111111"), true);
  assert.equal(await registered("333333"), false);
  assert.equal((await post(check, { studentId: "12" })).status, 400);
  mockGoogle(t, true);
  assert.equal((await post(check, { studentId: "111111" })).status, 503);
});
