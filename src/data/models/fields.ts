import { z } from "zod";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Keystatic's datetime field saves the editor's wall time as an unquoted UTC timestamp
 * (`2026-11-14T09:00:00.000Z`), which YAML reads as a Date. Convention: that value is Nairobi
 * wall time, so it becomes `2026-11-14T09:00:00+03:00`. Only Dates are relabelled: quoted strings
 * (hand-written, with their own offset) pass through unchanged.
 */
function toNairobi(d: unknown): unknown {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return d;
  const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  return `${date}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:00+03:00`;
}

export const nairobiDateTime = z.preprocess(toNairobi, z.iso.datetime({ offset: true }));

export const text = z.string().trim().min(1);

/** Optional field; Keystatic may save an emptied field as "" or null, which counts as missing. */
export const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === "" || v === null ? undefined : v), schema.optional());
