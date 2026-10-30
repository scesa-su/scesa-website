import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { PROJECT_STAGES, type SpotlightKind, type SpotlightPost } from "../../domain/entities/SpotlightPost.ts";
import { readingMinutes } from "../../domain/usecases/spotlightQueries.ts";
import { nairobiDateTime, optional, text } from "./fields.ts";

const link = z.object({ label: text, url: z.url({ protocol: /^https$/ }) });

// The kind is not in the frontmatter: it comes from the folder the file sits in.
export const spotlightFrontmatterSchema = z
  .object({
    title: text,
    date: nairobiDateTime,
    dek: text,
    excerpt: text,
    author: text,
    coverImage: optional(text),
    coverAlt: optional(text),
    eventSlug: optional(text),
    member: optional(
      z
        .object({
          name: text,
          degree: text,
          year: text,
          quote: text,
          photo: optional(text),
          photoAlt: optional(text),
          links: optional(z.array(link)),
        })
        .refine((m) => !m.photo || m.photoAlt, { message: "photoAlt is required when photo is set", path: ["photoAlt"] }),
    ),
    project: optional(
      z.object({ stage: z.enum(PROJECT_STAGES), team: optional(z.array(text)), links: optional(z.array(link)) }),
    ),
    gallery: optional(z.array(z.object({ image: text, alt: text }))),
    draft: z.boolean().default(false),
  })
  .refine((p) => !p.coverImage || p.coverAlt, { message: "coverAlt is required when coverImage is set", path: ["coverAlt"] });

/** Parses one spotlight file (`fileName` may include its folder); throws an error naming the file so `next build` fails loudly. */
export function parseSpotlightFile(kind: SpotlightKind, fileName: string, raw: string): SpotlightPost {
  const { data, content } = matter(raw);
  const result = spotlightFrontmatterSchema
    .refine((p) => kind !== "member" || p.member, { message: "member posts need member details", path: ["member"] })
    .safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid spotlight frontmatter in ${fileName}:\n${z.prettifyError(result.error)}`);
  }
  return {
    slug: path.basename(fileName, ".mdx"),
    kind,
    ...result.data,
    readingMinutes: readingMinutes(content),
    body: content,
  };
}
