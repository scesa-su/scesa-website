import type { Event } from "../entities/Event.ts";

export const EVENT_FILTERS = ["all", "upcoming", "workshops", "hackathons", "completed"] as const;
export type EventFilter = (typeof EVENT_FILTERS)[number];

export function parseFilter(value: string | string[] | undefined): EventFilter {
  return EVENT_FILTERS.find((f) => f === value) ?? "all";
}

export function sortNewestFirst(events: readonly Event[]): Event[] {
  return [...events].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

const matchesFilter: Record<EventFilter, (e: Event) => boolean> = {
  all: () => true,
  upcoming: (e) => e.status === "scheduled" || e.status === "live",
  workshops: (e) => e.category === "workshop",
  hackathons: (e) => e.category === "hackathon",
  completed: (e) => e.status === "completed",
};

export function filterEvents(events: readonly Event[], filter: EventFilter, q = ""): Event[] {
  const needle = q.trim().toLowerCase();
  return events.filter(
    (e) =>
      matchesFilter[filter](e) &&
      (!needle || [e.title, e.speaker, e.community].some((field) => field.toLowerCase().includes(needle))),
  );
}
