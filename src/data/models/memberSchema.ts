import { z } from "zod";
import type { Member, MemberRecord } from "../../domain/entities/Member.ts";
import { COMMUNITIES } from "../../lib/constants.ts";

/** Members sheet columns, in order. The sheet's header row must match. */
export const MEMBER_COLUMNS = [
  "reference",
  "full_name",
  "student_id",
  "email",
  "phone",
  "course",
  "year",
  "communities",
  "mpesa_code",
  "amount_kes",
  "payment_status",
  "confirmed_by",
  "confirmed_at",
  "added_to_whatsapp",
  "source",
  "created_at",
] as const;
export type MemberColumn = (typeof MEMBER_COLUMNS)[number];

/** Sheet column letter (A, B, …) of a column; there are fewer than 26. */
export const columnLetter = (column: MemberColumn) => String.fromCharCode(65 + MEMBER_COLUMNS.indexOf(column));

const PHONE = /^(?:0|254|\+254)([17]\d{8})$/;

/** 07…, 01…, 2547…, +2547… (spaces allowed) → 2547…; undefined when it is not a Kenyan mobile number. */
export function normalisePhone(raw: string): string | undefined {
  const match = PHONE.exec(raw.replace(/\s+/g, ""));
  return match ? `254${match[1]}` : undefined;
}

export const memberApplicationSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100, "Keep your name under 100 characters"),
  studentId: z.string().trim().regex(/^\d{6}$/, "Your student ID is 6 digits"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[^\s@]+@strathmore\.edu$/, "Use your @strathmore.edu email"),
  phone: z
    .string()
    .refine((v) => normalisePhone(v) !== undefined, "Use a Safaricom or Airtel number like 0712 345 678")
    .transform((v) => normalisePhone(v) ?? v),
  course: z.string().trim().min(2, "Enter your course").max(100, "Keep the course under 100 characters"),
  year: z.coerce.number({ error: "Pick your year of study" }).int().min(1, "Pick your year of study").max(5, "Pick your year of study"),
  communities: z.array(z.enum(COMMUNITIES)).min(1, "Pick at least one community"),
  mpesaCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z0-9]{10}$/, "The M-Pesa code is 10 letters and numbers, like SJK4H7Q2XP"),
  /** Honeypot: hidden from people, so only bots fill it. */
  website: z.literal("").optional(),
});

export type MemberApplicationInput = z.input<typeof memberApplicationSchema>;

// 32 characters, so a random byte % 32 has no bias. 0/O and 1/I are left out to avoid misreading.
const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const REFERENCE_PATTERN = /^SC-[A-HJ-NP-Z2-9]{8}$/;

export function newReference(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `SC-${Array.from(bytes, (b) => REFERENCE_ALPHABET[b % 32]).join("")}`;
}

export const statusLookupSchema = z.object({
  reference: z.string().trim().toUpperCase().regex(REFERENCE_PATTERN, "References look like SC-AB12CD34"),
  studentId: z.string().trim().regex(/^\d{6}$/, "Your student ID is 6 digits"),
});

/** A member as a sheet row. Numbers and booleans stay typed so Sheets stores them as such. */
export function toRow(m: Member): (string | number | boolean)[] {
  const byColumn: Record<MemberColumn, string | number | boolean> = {
    reference: m.reference,
    full_name: m.fullName,
    student_id: m.studentId,
    email: m.email,
    phone: m.phone,
    course: m.course,
    year: m.year,
    communities: m.communities.join("; "),
    mpesa_code: m.mpesaCode,
    amount_kes: m.amountKes,
    payment_status: m.paymentStatus,
    confirmed_by: m.confirmedBy,
    confirmed_at: m.confirmedAt,
    added_to_whatsapp: m.addedToWhatsapp,
    source: m.source,
    created_at: m.createdAt,
  };
  return MEMBER_COLUMNS.map((c) => byColumn[c]);
}

/** Columns zipped into records by row; a column Sheets returned shorter is padded with "". */
export function toRecords(columns: Partial<Record<MemberColumn, string[]>>): MemberRecord[] {
  const length = Math.max(0, ...Object.values(columns).map((c) => c?.length ?? 0));
  return Array.from({ length }, (_, i) => ({
    reference: columns.reference?.[i]?.trim() ?? "",
    studentId: columns.student_id?.[i]?.trim() ?? "",
    mpesaCode: columns.mpesa_code?.[i]?.trim() ?? "",
    paymentStatus: columns.payment_status?.[i]?.trim().toLowerCase() ?? "",
  }));
}
