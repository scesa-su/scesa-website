import { test } from "node:test";
import assert from "node:assert/strict";
import type { Member, MemberRecord } from "../../domain/entities/Member.ts";
import type { IMemberRepository } from "../../domain/repositories/IMemberRepository.ts";
import {
  findConflict,
  findStatus,
  isStudentRegistered,
  nairobiIso,
  processMembershipApplication,
} from "../../domain/usecases/processMembershipApplication.ts";
import {
  MEMBER_COLUMNS,
  REFERENCE_PATTERN,
  columnLetter,
  memberApplicationSchema,
  newReference,
  normalisePhone,
  statusLookupSchema,
  toRecords,
  toRow,
} from "./memberSchema.ts";

// Made-up applicant; no real member data.
const valid = {
  fullName: "  Test Student ",
  studentId: "123456",
  email: "Test.Student@Strathmore.edu",
  phone: "0712 345 678",
  course: "BSc Informatics",
  year: "2",
  communities: ["IET"],
  mpesaCode: " sjk4h7q2xp ",
  website: "",
};

test("schema trims and normalises a valid application", () => {
  const data = memberApplicationSchema.parse(valid);
  assert.equal(data.fullName, "Test Student");
  assert.equal(data.email, "test.student@strathmore.edu");
  assert.equal(data.phone, "254712345678");
  assert.equal(data.year, 2);
  assert.equal(data.mpesaCode, "SJK4H7Q2XP");
});

test("schema rejects the bad-input cases with field errors", () => {
  const bad = { ...valid, studentId: "12345", email: "a@gmail.com", phone: "0812345678", mpesaCode: "SJK4H7Q2X" };
  const result = memberApplicationSchema.safeParse(bad);
  assert.equal(result.success, false);
  const fields = new Set(result.error?.issues.map((i) => i.path[0]));
  for (const f of ["studentId", "email", "phone", "mpesaCode"]) assert.ok(fields.has(f), f);
});

test("schema rejects year 0/6, no communities, unknown community and a filled honeypot", () => {
  for (const patch of [{ year: "0" }, { year: "6" }, { communities: [] }, { communities: ["Chess"] }, { website: "x" }]) {
    assert.equal(memberApplicationSchema.safeParse({ ...valid, ...patch }).success, false, JSON.stringify(patch));
  }
});

test("normalisePhone accepts 07/01, 254 and +254 forms", () => {
  assert.equal(normalisePhone("0712345678"), "254712345678");
  assert.equal(normalisePhone("0112 345 678"), "254112345678");
  assert.equal(normalisePhone("254712345678"), "254712345678");
  assert.equal(normalisePhone("+254 112 345 678"), "254112345678");
  assert.equal(normalisePhone("0812345678"), undefined);
  assert.equal(normalisePhone("071234567"), undefined);
});

test("newReference is SC- plus 8 unambiguous characters", () => {
  for (let i = 0; i < 200; i++) assert.match(newReference(), REFERENCE_PATTERN);
  assert.doesNotMatch("SC-ABCD0EFG", REFERENCE_PATTERN);
  assert.equal(statusLookupSchema.parse({ reference: " sc-abcd2efg ", studentId: "123456" }).reference, "SC-ABCD2EFG");
});

const member: Member = {
  ...memberApplicationSchema.parse(valid),
  reference: "SC-ABCDEFGH",
  amountKes: 500,
  paymentStatus: "pending",
  confirmedBy: "",
  confirmedAt: "",
  addedToWhatsapp: false,
  source: "website",
  createdAt: "2026-10-31T12:00:00+03:00",
};

test("toRow follows the column order", () => {
  const row = toRow(member);
  assert.equal(row.length, MEMBER_COLUMNS.length);
  assert.equal(row[MEMBER_COLUMNS.indexOf("student_id")], "123456");
  assert.equal(row[MEMBER_COLUMNS.indexOf("communities")], "IET");
  assert.equal(row[MEMBER_COLUMNS.indexOf("added_to_whatsapp")], false);
  assert.equal(row.at(-1), "2026-10-31T12:00:00+03:00");
  assert.equal(columnLetter("reference"), "A");
  assert.equal(columnLetter("mpesa_code"), "I");
  assert.equal(columnLetter("payment_status"), "K");
});

test("toRecords pads short columns", () => {
  const records = toRecords({ student_id: ["111111", "222222"], payment_status: ["Confirmed"] });
  assert.deepEqual(records[1], { reference: "", studentId: "222222", mpesaCode: "", paymentStatus: "" });
  assert.equal(records[0].paymentStatus, "confirmed");
});

const rows: MemberRecord[] = [
  { reference: "SC-AAAAAAAA", studentId: "111111", mpesaCode: "CODE000001", paymentStatus: "confirmed" },
  { reference: "SC-BBBBBBBB", studentId: "222222", mpesaCode: "CODE000002", paymentStatus: "rejected" },
];

test("findConflict: taken ID or code; a rejected row frees the ID but not its code", () => {
  assert.equal(findConflict(rows, { studentId: "111111", mpesaCode: "NEWCODE001" }), "student_id");
  assert.equal(findConflict(rows, { studentId: "333333", mpesaCode: "CODE000001" }), "mpesa_code");
  assert.equal(findConflict(rows, { studentId: "222222", mpesaCode: "NEWCODE002" }), undefined);
  assert.equal(findConflict(rows, { studentId: "222222", mpesaCode: "CODE000002" }), "mpesa_code");
});

test("isStudentRegistered ignores rejected rows", () => {
  assert.equal(isStudentRegistered(rows, "111111"), true);
  assert.equal(isStudentRegistered(rows, "222222"), false);
  assert.equal(isStudentRegistered(rows, "333333"), false);
});

test("findStatus needs both reference and student ID to match", () => {
  assert.equal(findStatus(rows, "SC-AAAAAAAA", "111111"), "confirmed");
  assert.equal(findStatus(rows, "SC-AAAAAAAA", "222222"), undefined);
  assert.equal(findStatus(rows, "SC-ZZZZZZZZ", "111111"), undefined);
  // A found row with a blank or mistyped status is still an application, not "not found".
  for (const paymentStatus of ["", "paid"]) {
    assert.equal(findStatus([{ ...rows[0], paymentStatus }], "SC-AAAAAAAA", "111111"), "pending");
  }
});

test("nairobiIso shifts UTC to +03:00", () => {
  assert.equal(nairobiIso(new Date("2026-10-31T22:30:00Z")), "2026-11-01T01:30:00+03:00");
});

test("processMembershipApplication appends a pending row, or nothing on a conflict", async () => {
  const appended: Member[] = [];
  const repo: IMemberRepository = {
    findConflict: async (a) => findConflict(rows, a),
    isStudentRegistered: async () => false,
    append: async (m) => void appended.push(m),
    findStatus: async () => undefined,
  };
  const now = new Date("2026-10-31T09:00:00Z");
  const ok = await processMembershipApplication(repo, member, { reference: "SC-CCCCCCCC", feeKes: 500, now });
  assert.deepEqual(ok, { ok: true, reference: "SC-CCCCCCCC" });
  assert.equal(appended[0].paymentStatus, "pending");
  assert.equal(appended[0].source, "website");
  assert.equal(appended[0].createdAt, "2026-10-31T12:00:00+03:00");

  const dup = await processMembershipApplication(repo, { ...member, studentId: "111111" }, { reference: "SC-DDDDDDDD", feeKes: 500, now });
  assert.deepEqual(dup, { ok: false, conflict: "student_id" });
  assert.equal(appended.length, 1);
});
