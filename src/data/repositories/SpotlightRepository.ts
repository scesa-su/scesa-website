import type { SpotlightKind, SpotlightPost } from "../../domain/entities/SpotlightPost.ts";
import type { ISpotlightRepository } from "../../domain/repositories/ISpotlightRepository.ts";
import { filterByKind, relatedPosts, sortPostsNewestFirst, visiblePosts } from "../../domain/usecases/spotlightQueries.ts";
import { MdxSpotlightDataSource } from "../datasources/MdxSpotlightDataSource.ts";

export class SpotlightRepository implements ISpotlightRepository {
  private readonly source: MdxSpotlightDataSource;
  private readonly includeDrafts: boolean;

  constructor(source: MdxSpotlightDataSource, includeDrafts: boolean) {
    this.source = source;
    this.includeDrafts = includeDrafts;
  }

  async getAll(kind?: SpotlightKind): Promise<SpotlightPost[]> {
    const posts = visiblePosts(await this.source.readAll(), this.includeDrafts);
    return filterByKind(sortPostsNewestFirst(posts), kind);
  }

  async getBySlug(slug: string): Promise<SpotlightPost | undefined> {
    return (await this.getAll()).find((p) => p.slug === slug);
  }

  async getRelated(slug: string, limit = 3): Promise<SpotlightPost[]> {
    const posts = await this.getAll();
    const current = posts.find((p) => p.slug === slug);
    return current ? relatedPosts(posts, current, limit) : [];
  }
}

// Drafts show in `next dev` and are left out of production builds.
export const spotlightRepository = new SpotlightRepository(
  new MdxSpotlightDataSource(),
  process.env.NODE_ENV !== "production",
);
