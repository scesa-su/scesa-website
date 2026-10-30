import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { EVENT_CATEGORIES, type Event } from "../../domain/entities/Event.ts";
import { nairobiDateTime, optional, text } from "./fields.ts";

/** An event as stored; its status is derived from the dates when it is read. */
export type StoredEvent = Omit<Event, "status">;

const webUrl = z.url({ protocol: /^https?$/ });

// Keystatic's conditional field saves { discriminant, value }: an event is either in person or online.
const location = z.discriminatedUnion("discriminant", [
  z.object({ discriminant: z.literal("in-person"), value: z.object({ venue: text, mapPin: optional(text) }) }),
  z.object({ discriminant: z.literal("online"), value: z.object({ link: webUrl }) }),
]);

export const eventFrontmatterSchema = z
  .object({
    title: text,
    category: z.enum(EVENT_CATEGORIES),
    date: nairobiDateTime,
    endDate: nairobiDateTime,
    location,
    registrationUrl: optional(webUrl),
    speaker: optional(text),
    hosts: z.array(text).min(1),
    image: text,
    imageAlt: text,
    excerpt: text,
  })
  .refine((e) => Date.parse(e.endDate) > Date.parse(e.date), { message: "endDate must be after date", path: ["endDate"] });

/** Parses one event file (`fileName` may include its folder); throws an error naming the file so `next build` fails loudly. */
export function parseEventFile(fileName: string, raw: string): StoredEvent {
  const { data, content } = matter(raw);
  const result = eventFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid event frontmatter in ${fileName}:\n${z.prettifyError(result.error)}`);
  }
  const { location: where, ...rest } = result.data;
  const place =
    where.discriminant === "in-person"
      ? { venue: where.value.venue, mapQuery: where.value.mapPin ?? where.value.venue }
      : { virtualUrl: where.value.link };
  return { slug: path.basename(fileName, ".mdx"), ...rest, ...place, body: content };
}
