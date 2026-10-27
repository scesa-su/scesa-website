import matter from "gray-matter";
import { z } from "zod";
import { EVENT_CATEGORIES, EVENT_STATUSES, type Event } from "../../domain/entities/Event.ts";

const isoWithOffset = z.iso.datetime({ offset: true });
const text = z.string().trim().min(1);

export const eventFrontmatterSchema = z
  .object({
    title: text,
    status: z.enum(EVENT_STATUSES),
    category: z.enum(EVENT_CATEGORIES),
    date: isoWithOffset,
    endDate: isoWithOffset,
    venue: text.optional(),
    virtualUrl: z.url({ protocol: /^https?$/ }).optional(),
    speaker: text,
    community: text,
    image: text,
    imageAlt: text,
    excerpt: text,
  })
  .refine((e) => e.venue || e.virtualUrl, { message: "venue or virtualUrl is required", path: ["venue"] })
  .refine((e) => Date.parse(e.endDate) > Date.parse(e.date), { message: "endDate must be after date", path: ["endDate"] });

/** Parses one event file; throws an error naming the file so `next build` fails loudly. */
export function parseEventFile(fileName: string, raw: string): Event {
  const { data, content } = matter(raw);
  const result = eventFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid event frontmatter in ${fileName}:\n${z.prettifyError(result.error)}`);
  }
  return { slug: fileName.replace(/\.mdx$/, ""), ...result.data, body: content };
}
