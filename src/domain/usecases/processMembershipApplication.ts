import type { Member, MemberApplication, MemberRecord, PaymentStatus } from "../entities/Member.ts";
import { PAYMENT_STATUSES } from "../entities/Member.ts";
import type { IMemberRepository, MemberConflict } from "../repositories/IMemberRepository.ts";

/**
 * A student ID is taken by any row that was not rejected, so a rejected applicant can apply again.
 * An M-Pesa code is taken by any row at all: one payment pays for one membership.
 */
export function findConflict(
  records: MemberRecord[],
  application: Pick<MemberApplication, "studentId" | "mpesaCode">,
): MemberConflict | undefined {
  if (records.some((r) => r.mpesaCode.toUpperCase() === application.mpesaCode)) return "mpesa_code";
  if (records.some((r) => r.studentId === application.studentId && r.paymentStatus !== "rejected")) return "student_id";
  return undefined;
}

export function findStatus(records: MemberRecord[], reference: string, studentId: string): PaymentStatus | undefined {
  const row = records.find((r) => r.reference === reference && r.studentId === studentId);
  if (!row) return undefined;
  // A blank or mistyped status means the committee hasn't settled it yet.
  return PAYMENT_STATUSES.find((s) => s === row.paymentStatus.trim().toLowerCase()) ?? "pending";
}

/** Nairobi wall time as ISO 8601 with +03:00 (Kenya has no daylight saving). */
export function nairobiIso(now: Date): string {
  return `${new Date(now.getTime() + 3 * 3600_000).toISOString().slice(0, 19)}+03:00`;
}

type Options = { reference: string; feeKes: number; now: Date };

export type ApplicationResult = { ok: true; reference: string } | { ok: false; conflict: MemberConflict };

/** Rejects duplicates, then stores the application as pending until the committee confirms the payment. */
export async function processMembershipApplication(
  repository: IMemberRepository,
  application: MemberApplication,
  { reference, feeKes, now }: Options,
): Promise<ApplicationResult> {
  const conflict = await repository.findConflict(application);
  if (conflict) return { ok: false, conflict };
  const member: Member = {
    ...application,
    reference,
    amountKes: feeKes,
    paymentStatus: "pending",
    confirmedBy: "",
    confirmedAt: "",
    addedToWhatsapp: false,
    source: "website",
    createdAt: nairobiIso(now),
  };
  await repository.append(member);
  return { ok: true, reference };
}
