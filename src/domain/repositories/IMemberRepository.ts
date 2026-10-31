import type { Member, MemberApplication, PaymentStatus } from "../entities/Member.ts";

export type MemberConflict = "student_id" | "mpesa_code";

export interface IMemberRepository {
  /** Which field of the application is already taken, if any. */
  findConflict(application: Pick<MemberApplication, "studentId" | "mpesaCode">): Promise<MemberConflict | undefined>;
  append(member: Member): Promise<void>;
  /** Status of the row matching both reference and student ID; undefined when the pair does not match. */
  findStatus(reference: string, studentId: string): Promise<PaymentStatus | undefined>;
}
