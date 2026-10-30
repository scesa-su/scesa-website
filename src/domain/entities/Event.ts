export const EVENT_STATUSES = ["live", "scheduled", "completed"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const EVENT_CATEGORIES = [
  "workshop",
  "hackathon",
  "talk",
  "meetup",
  "industry-visit",
  "team-building",
  "game-night",
] as const;
export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type Event = {
  slug: string;
  title: string;
  status: EventStatus;
  category: EventCategory;
  /** ISO 8601 with offset, e.g. 2026-11-14T09:00:00+03:00 */
  date: string;
  endDate: string;
  /** In-person events have a venue (and a map query); online events have a virtualUrl. Never both. */
  venue?: string;
  /** What the map pin searches for: an address, place name or "lat,lng". */
  mapQuery?: string;
  virtualUrl?: string;
  /** External sign-up form (Google Form, Luma, …). */
  registrationUrl?: string;
  speaker?: string;
  /** Host communities or partners, at least one. */
  hosts: string[];
  image: string;
  imageAlt: string;
  excerpt: string;
  /** MDX source of the event description */
  body: string;
};
