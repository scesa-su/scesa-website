import { SheetsUnavailableError } from "../../../../data/datasources/GoogleSheetsDataSource.ts";
import { memberApplicationSchema } from "../../../../data/models/memberSchema.ts";
import { createMemberRepository } from "../../../../data/repositories/MemberRepository.ts";
import { clientIp, createRateLimiter } from "../../../../lib/rateLimit.ts";

// Answers "is this student ID already registered?" before the applicant pays. It reveals membership of an ID,
// so it is rate-limited and returns a single boolean.
const perIp = createRateLimiter(20, 10 * 60 * 1000);
const studentIdSchema = memberApplicationSchema.pick({ studentId: true });

const fail = (status: number, error: string) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const requestId = crypto.randomUUID().slice(0, 8);
  try {
    if (!perIp(clientIp(request.headers))) return fail(429, "Too many attempts. Try again in a few minutes.");

    const parsed = studentIdSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return fail(400, "Your student ID is 6 digits");

    const repository = createMemberRepository();
    if (!repository) return fail(503, "Registration is temporarily closed. Please try again later.");

    return Response.json({ registered: await repository.isStudentRegistered(parsed.data.studentId) });
  } catch (error) {
    const sheetsDown = error instanceof SheetsUnavailableError;
    console.error(`[register/check] ${requestId} ${sheetsDown ? `sheets unavailable: ${error.message}` : "failed"}`);
    return fail(sheetsDown ? 503 : 500, "We couldn't check your student ID right now.");
  }
}
