export const SPOTLIGHT_KINDS = ["recap", "in-the-works", "coming-up", "member"] as const;
export type SpotlightKind = (typeof SPOTLIGHT_KINDS)[number];

export const PROJECT_STAGES = ["idea", "building", "testing", "launched"] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export type SpotlightLink = { label: string; url: string };
export type SpotlightImage = { image: string; alt: string };

export type SpotlightMember = {
  name: string;
  degree: string;
  year: string;
  quote: string;
  photo?: string;
  photoAlt?: string;
  links?: SpotlightLink[];
};

/** Status box for in-the-works posts. */
export type SpotlightProject = {
  stage: ProjectStage;
  team?: string[];
  links?: SpotlightLink[];
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
  project?: SpotlightProject;
  /** Extra photos shown as polaroids after the body. */
  gallery?: SpotlightImage[];
  draft: boolean;
  readingMinutes: number;
  /** MDX source of the article */
  body: string;
};
