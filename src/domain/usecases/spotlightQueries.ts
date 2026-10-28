import { SPOTLIGHT_KINDS, type SpotlightKind, type SpotlightPost } from "../entities/SpotlightPost.ts";

const WORDS_PER_MINUTE = 200;

/** A valid kind from a search param, or undefined (meaning all kinds). */
export function parseKind(value: string | string[] | undefined): SpotlightKind | undefined {
  return SPOTLIGHT_KINDS.find((k) => k === value);
}

export function readingMinutes(body: string) {
  const words = body.match(/[\p{L}\p{N}'’-]+/gu)?.length ?? 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function sortPostsNewestFirst(posts: readonly SpotlightPost[]): SpotlightPost[] {
  return [...posts].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function filterByKind(posts: readonly SpotlightPost[], kind?: SpotlightKind): SpotlightPost[] {
  return kind ? posts.filter((p) => p.kind === kind) : [...posts];
}

export function visiblePosts(posts: readonly SpotlightPost[], includeDrafts: boolean): SpotlightPost[] {
  return includeDrafts ? [...posts] : posts.filter((p) => !p.draft);
}

/** Other posts, same kind first, each group newest first. Expects `posts` already sorted newest first. */
export function relatedPosts(posts: readonly SpotlightPost[], current: SpotlightPost, limit = 3): SpotlightPost[] {
  const others = posts.filter((p) => p.slug !== current.slug);
  const sameKind = others.filter((p) => p.kind === current.kind);
  return [...sameKind, ...others.filter((p) => p.kind !== current.kind)].slice(0, limit);
}
