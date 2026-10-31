import { test } from "node:test";
import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { GoogleSheetsDataSource, SheetsUnavailableError, readSheetsConfig } from "./GoogleSheetsDataSource.ts";

// Throwaway key made for the test; not a real credential.
const { privateKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const env = { NODE_ENV: "test" as const, GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.iam.gserviceaccount.com", MEMBERS_SHEET_ID: "sheet" };

test("readSheetsConfig turns Vercel's literal \\n into newlines, and is undefined when a var is missing", () => {
  const config = readSheetsConfig({ ...env, GOOGLE_PRIVATE_KEY: pem.replace(/\n/g, "\\n") });
  assert.equal(config?.privateKey, pem);
  assert.equal(readSheetsConfig({ ...env }), undefined);
});

test("a fetch failure becomes SheetsUnavailableError (routes answer 503)", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("network down");
  });
  const source = new GoogleSheetsDataSource({ clientEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, privateKey: pem, sheetId: "sheet" });
  await assert.rejects(source.readColumns(["Members!A2:A"]), SheetsUnavailableError);
});

test("a 403 from the token endpoint or from Sheets, or an unusable key, becomes SheetsUnavailableError", async (t) => {
  const config = { clientEmail: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, privateKey: pem, sheetId: "sheet" };
  const tokenDenied = t.mock.method(globalThis, "fetch", async () => new Response("{}", { status: 403 }));
  await assert.rejects(new GoogleSheetsDataSource(config).appendRow("Members", ["x"]), /Token endpoint responded 403/);
  tokenDenied.mock.restore();

  t.mock.method(globalThis, "fetch", async (url: string) =>
    url.startsWith("https://oauth2") ? Response.json({ access_token: "t", expires_in: 3600 }) : new Response("{}", { status: 403 }),
  );
  await assert.rejects(new GoogleSheetsDataSource(config).appendRow("Members", ["x"]), /Sheets responded 403/);
  await assert.rejects(new GoogleSheetsDataSource(config).readColumns(["Members!A2:A"]), SheetsUnavailableError);
  await assert.rejects(new GoogleSheetsDataSource({ ...config, privateKey: "not a key" }).readColumns([]), SheetsUnavailableError);
});
