import { test } from "node:test";
import assert from "node:assert/strict";
import { migrate, parseCsv, parseTimestamp, toCsv } from "../../scripts/migrate-members.mjs";

// Made-up responses from two form versions; no real member data.
const CSV = [
  'Timestamp,Full Name,Email Address,Admission Number,Phone Number,Course,Year of Study,Communities,M-Pesa Code,"Phone (v3)"',
  '1/5/2026 10:00:00,Old Name,OLD@strathmore.edu,111111,0712345678,BBIT,Year 1,"IET, AWS Rebuild",abc1234567,',
  '2/5/2026 09:30:00,New Name,new@strathmore.edu,111111,,BBIT,Second year,IET,ABC7654321,"+254 112 345 678"',
  '3/5/2026 08:00:00,No Id,x@strathmore.edu,12AB,0712345678,BBIT,3,IET,ZZZ1234567,',
  '"3/6/2026 08:00:00","Quote, ""Q"" Person",q@strathmore.edu,222222,0798765432,"CS",4,,QQQ1234567,',
].join("\r\n");

test("parseCsv handles quotes, escaped quotes and commas inside fields", () => {
  const rows = parseCsv(CSV);
  assert.equal(rows.length, 5);
  assert.equal(rows[4][1], 'Quote, "Q" Person');
  assert.deepEqual(parseCsv(toCsv([["a,b", 'c"d']])), [["a,b", 'c"d']]);
});

test("parseTimestamp reads Google Forms M/D/Y as Nairobi time", () => {
  assert.equal(parseTimestamp("2/5/2026 09:30:00"), "2026-02-05T09:30:00+03:00");
  assert.equal(parseTimestamp("garbage"), "");
});

test("migrate keeps the newest row per student ID, normalises fields and marks rows legacy", () => {
  const { rows, counts } = migrate(parseCsv(CSV));
  assert.deepEqual(counts, { read: 4, kept: 2, duplicates: 1, skipped: 1 });
  const [header, first] = rows;
  const get = (field: (typeof header)[number]) => first[header.indexOf(field)];
  assert.equal(get("full_name"), "New Name");
  assert.equal(get("phone"), "254112345678");
  assert.equal(get("year"), 2);
  assert.equal(get("communities"), "IET");
  assert.equal(get("payment_status"), "confirmed");
  assert.equal(get("confirmed_by"), "legacy");
  assert.equal(get("added_to_whatsapp"), "TRUE");
  assert.equal(get("source"), "google-form");
  assert.match(get("reference"), /^SC-/);
});
