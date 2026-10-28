import matter from "gray-matter";
import { z } from "zod";
import { SPOTLIGHT_KINDS, type SpotlightPost } from "../../domain/entities/SpotlightPost.ts";
import { readingMinutes } from "../../domain/usecases/spotlightQueries.ts";

const text = z.string().trim().min(1);

export const spotlightFrontmatterSchema = z
  .object({
    title: text,
    kind: z.enum(SPOTLIGHT_KINDS),
    date: z.iso.datetime({ offset: true }),
    dek: text,
    excerpt: text,
    author: text,
    coverImage: text.optional(),
    coverAlt: text.optional(),
    eventSlug: text.optional(),
    member: z.object({ name: text, degree: text, year: text, quote: text }).optional(),
    draft: z.boolean().default(false),
  })
  .refine((p) => !p.coverImage === !p.coverAlt, { message: "coverImage and coverAlt go together", path: ["coverAlt"] })
  .refine((p) => p.kind !== "member" || p.member, { message: "member posts need member details", path: ["member"] });

/** Parses one spotlight file; throws an error naming the file so `next build` fails loudly. */
export function parseSpotlightFile(fileName: string, raw: string): SpotlightPost {
  const { data, content } = matter(raw);
  const result = spotlightFrontmatterSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid spotlight frontmatter in ${fileName}:\n${z.prettifyError(result.error)}`);
  }
  return {
    slug: fileName.replace(/\.mdx$/, ""),
    ...result.data,
    readingMinutes: readingMinutes(content),
    body: content,
  };
}
