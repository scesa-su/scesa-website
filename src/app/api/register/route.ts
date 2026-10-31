import { z } from "zod";
import { SheetsUnavailableError } from "../../../data/datasources/GoogleSheetsDataSource.ts";
import { memberApplicationSchema, newReference } from "../../../data/models/memberSchema.ts";
import { createMemberRepository } from "../../../data/repositories/MemberRepository.ts";
import { processMembershipApplication } from "../../../domain/usecases/processMembershipApplication.ts";
import { CONTACT_EMAIL, MEMBERSHIP_FEE_KES } from "../../../lib/constants.ts";
import { clientIp, createRateLimiter } from "../../../lib/rateLimit.ts";

const TEN_MINUTES = 10 * 60 * 1000;
const perIp = createRateLimiter(5, TEN_MINUTES);
const perPhone = createRateLimiter(3, TEN_MINUTES);

const CONFLICT_MESSAGES = {
  student_id: `This student ID is already registered. Check your status with your reference, or email ${CONTACT_EMAIL} if you joined through the Google Form or lost it.`,
  mpesa_code: "This M-Pesa code has already been used. Check the code on your M-Pesa message.",
} as const;

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  try {
    if (!perIp(clientIp(request.headers))) return fail(429, "Too many attempts. Try again in a few minutes.");

    const body: unknown = await request.json().catch(() => null);
    // Honeypot filled: pretend it worked so the bot moves on, and store nothing.
    if (body && typeof body === "object" && "website" in body && body.website) {
      return Response.json({ reference: newReference() }, { status: 200 });
    }

    const parsed = memberApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: "Some details need fixing.", fieldErrors: z.flattenError(parsed.error).fieldErrors },
        { status: 400 },
      );
    }

    const repository = createMemberRepository();
    if (!repository) return fail(503, "Registration is temporarily closed. Please try again later.");

    if (!perPhone(parsed.data.phone)) return fail(429, "Too many attempts. Try again in a few minutes.");

    const result = await processMembershipApplication(repository, parsed.data, {
      reference: newReference(),
      feeKes: MEMBERSHIP_FEE_KES,
      now: new Date(),
    });
    if (!result.ok) {
      console.info(`[register] ${requestId} conflict:${result.conflict}`);
      return fail(409, CONFLICT_MESSAGES[result.conflict]);
    }

    console.info(`[register] ${result.reference} pending`);
    return Response.json({ reference: result.reference }, { status: 201 });
  } catch (error) {
    if (error instanceof SheetsUnavailableError) {
      // The message carries only the HTTP status or step, never member data.
      console.error(`[register] ${requestId} sheets unavailable: ${error.message}`);
      return fail(503, "We couldn't save your application right now. Please try again in a few minutes.");
    }
    console.error(`[register] ${requestId} failed`);
    return fail(500, "Something went wrong on our side. Please try again in a few minutes.");
  }
}
