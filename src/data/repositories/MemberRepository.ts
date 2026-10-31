import type { Member, MemberApplication, MemberRecord, PaymentStatus } from "../../domain/entities/Member.ts";
import type { IMemberRepository, MemberConflict } from "../../domain/repositories/IMemberRepository.ts";
import { findConflict, findStatus, isStudentRegistered } from "../../domain/usecases/processMembershipApplication.ts";
import { GoogleSheetsDataSource, readSheetsConfig } from "../datasources/GoogleSheetsDataSource.ts";
import { columnLetter, toRecords, toRow, type MemberColumn } from "../models/memberSchema.ts";

const TAB = "Members";

export class MemberRepository implements IMemberRepository {
  private readonly source: GoogleSheetsDataSource;

  constructor(source: GoogleSheetsDataSource) {
    this.source = source;
  }

  /** Reads only the named columns, never names, emails or phones. */
  private async read(columns: MemberColumn[]): Promise<MemberRecord[]> {
    const values = await this.source.readColumns(columns.map((c) => `${TAB}!${columnLetter(c)}2:${columnLetter(c)}`));
    return toRecords(Object.fromEntries(columns.map((c, i) => [c, values[i] ?? []])));
  }

  async findConflict(application: Pick<MemberApplication, "studentId" | "mpesaCode">): Promise<MemberConflict | undefined> {
    return findConflict(await this.read(["student_id", "mpesa_code", "payment_status"]), application);
  }

  async isStudentRegistered(studentId: string): Promise<boolean> {
    return isStudentRegistered(await this.read(["student_id", "payment_status"]), studentId);
  }

  async append(member: Member): Promise<void> {
    await this.source.appendRow(TAB, toRow(member));
  }

  async findStatus(reference: string, studentId: string): Promise<PaymentStatus | undefined> {
    return findStatus(await this.read(["reference", "student_id", "payment_status"]), reference, studentId);
  }
}

// One data source per instance, so its access token is reused across requests.
let cached: { key: string; repository: MemberRepository } | undefined;

/** undefined when the Sheets env vars are missing. */
export function createMemberRepository(): MemberRepository | undefined {
  const config = readSheetsConfig();
  if (!config) return undefined;
  const key = `${config.clientEmail}|${config.sheetId}|${config.privateKey}`;
  if (cached?.key !== key) cached = { key, repository: new MemberRepository(new GoogleSheetsDataSource(config)) };
  return cached.repository;
}
