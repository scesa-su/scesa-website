import { SheetsUnavailableError } from "../../../data/datasources/GoogleSheetsDataSource.ts";
import { statusLookupSchema } from "../../../data/models/memberSchema.ts";
import { createMemberRepository } from "../../../data/repositories/MemberRepository.ts";
import { clientIp, createRateLimiter } from "../../../lib/rateLimit.ts";

const perIp = createRateLimiter(10, 10 * 60 * 1000);

const NOT_FOUND = "We couldn't find an application with that reference and student ID.";
const fail = (status: number, error: string) => Response.json({ error }, { status });

/** Returns only { status, inviteUrl? }; the invite only for confirmed members. */
export async function POST(request: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  try {
    if (!perIp(clientIp(request.headers))) return fail(429, "Too many attempts. Try again in a few minutes.");

    // A malformed pair gets the same answer as a wrong one.
    const parsed = statusLookupSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return fail(404, NOT_FOUND);

    const repository = createMemberRepository();
    const inviteUrl = process.env.WHATSAPP_INVITE_URL;
    if (!repository || !inviteUrl) return fail(503, "Status checks are temporarily unavailable. Please try again later.");

    const status = await repository.findStatus(parsed.data.reference, parsed.data.studentId);
    if (!status) return fail(404, NOT_FOUND);

    console.info(`[membership-status] ${parsed.data.reference} ${status}`);
    return Response.json(status === "confirmed" ? { status, inviteUrl } : { status });
  } catch (error) {
    const sheetsDown = error instanceof SheetsUnavailableError;
    console.error(`[membership-status] ${requestId} ${sheetsDown ? `sheets unavailable: ${error.message}` : "failed"}`);
    return sheetsDown
      ? fail(503, "We couldn't check your status right now. Please try again in a few minutes.")
      : fail(500, "Something went wrong on our side. Please try again in a few minutes.");
  }
}
