export const SPOTLIGHT_KINDS = ["recap", "in-the-works", "coming-up", "member"] as const;
export type SpotlightKind = (typeof SPOTLIGHT_KINDS)[number];

export type SpotlightMember = {
  name: string;
  degree: string;
  year: string;
  quote: string;
};

export type SpotlightPost = {
  slug: string;
  title: string;
  kind: SpotlightKind;
  /** Publication date, ISO 8601 with offset. */
  date: string;
  /** One-sentence standfirst shown under the title. */
  dek: string;
  excerpt: string;
  author: string;
  coverImage?: string;
  coverAlt?: string;
  /** Coming-up posts can point at an event in src/content/events. */
  eventSlug?: string;
  member?: SpotlightMember;
  draft: boolean;
  readingMinutes: number;
  /** MDX source of the article */
  body: string;
};
