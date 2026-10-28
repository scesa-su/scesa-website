import type { SpotlightKind, SpotlightPost } from "../entities/SpotlightPost";

export interface ISpotlightRepository {
  /** Published posts (plus drafts outside production), newest first; all kinds when kind is omitted. */
  getAll(kind?: SpotlightKind): Promise<SpotlightPost[]>;
  getBySlug(slug: string): Promise<SpotlightPost | undefined>;
  /** Up to `limit` other posts: same kind first, then newest. */
  getRelated(slug: string, limit?: number): Promise<SpotlightPost[]>;
}
