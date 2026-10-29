import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { EVENT_CATEGORIES, type Event } from "../../domain/entities/Event.ts";
import { nairobiDateTime, optional, text } from "./fields.ts";

/** An event as stored; its status is derived from the dates when it is read. */
export type StoredEvent = Omit<Event, "status">;

export const eventFrontmatterSchema = z
  .object({
    title: text,
    category: z.enum(EVENT_CATEGORIES),
    date: nairobiDateTime,
    endDate: nairobiDateTime,
    venue: optional(text),
    virtualUrl: optional(z.url({ protocol: /^https?$/ })),
    speaker: text,
    community: text,
    image: text,
    imageAlt: text,
    excerpt: text,
  })
  .refine((e) => e.venue || e.virtualUrl, { message: "venue or virtualUrl is required", path: ["venue"] })
  .refine((e) => Date.parse(e.endDate) > Date.parse(e.date), { message: "endDate must be after date", path: ["endDate"] });

/** Parses one event file (`fileName` may include its folder); throws an error naming the file so `next build` fails loudly. */
export function parseEventFile(fileName: string, raw: string): StoredEvent {
  const { data, content } = matter(raw);
  const result = eventFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid event frontmatter in ${fileName}:\n${z.prettifyError(result.error)}`);
  }
  return { slug: path.basename(fileName, ".mdx"), ...result.data, body: content };
}

