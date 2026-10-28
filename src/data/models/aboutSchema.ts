import { z } from "zod";
import type { Leader } from "../../domain/entities/Leader.ts";
import type { Partner } from "../../domain/entities/Partner.ts";

const text = z.string().trim().min(1);
const imagePath = text.regex(/^\/images\//, "must be a path under /images/");

export const leaderSchema = z.object({ name: text, role: text, photo: imagePath });
export const partnerSchema = z.object({ name: text, logo: imagePath.optional() });

function parseList<T>(schema: z.ZodType<T>, label: string, fileName: string, raw: string): T[] {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Invalid JSON in ${fileName}: ${(e as Error).message}`);
  }
  const result = z.array(schema).safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid ${label} in ${fileName}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/** Parses leaders.json; throws an error naming the file so `next build` fails loudly. */
export const parseLeadersFile = (fileName: string, raw: string): Leader[] =>
  parseList(leaderSchema, "leaders", fileName, raw);

/** Parses partners.json; throws an error naming the file so `next build` fails loudly. */
export const parsePartnersFile = (fileName: string, raw: string): Partner[] =>
  parseList(partnerSchema, "partners", fileName, raw);
