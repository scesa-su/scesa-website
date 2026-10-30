import type { MetadataRoute } from "next";
import { eventRepository } from "../data/repositories/EventRepository.ts";
import { spotlightRepository } from "../data/repositories/SpotlightRepository.ts";
import { SITE_URL } from "../lib/constants.ts";

const PAGES = ["/", "/events", "/spotlight", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, posts] = await Promise.all([eventRepository.getAll(), spotlightRepository.getAll()]);
  return [
    ...PAGES.map((p) => ({ url: new URL(p, SITE_URL).toString() })),
    ...events.map((e) => ({ url: `${SITE_URL}/events/${e.slug}` })),
    // The repository already hides drafts in production; filtering again keeps them out of a dev sitemap too.
    ...posts.filter((p) => !p.draft).map((p) => ({ url: `${SITE_URL}/spotlight/${p.slug}`, lastModified: p.date })),
  ];
}
