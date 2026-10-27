import type { Metadata } from "next";
import { eventRepository } from "@/data/repositories/EventRepository";
import { filterEvents, parseFilter } from "@/domain/usecases/eventQueries";
import { formatShortDate } from "@/lib/dates";
import { EventCard } from "@/presentation/components/events/EventCard";
import { EventFilters } from "@/presentation/components/events/EventFilters";
import { Button } from "@/presentation/components/ui/Button";

export const metadata: Metadata = {
  title: "Events | SCESA",
  description: "Workshops, hackathons, talks and meetups from SCESA and its communities.",
};

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const q = typeof params.q === "string" ? params.q : "";
  const events = filterEvents(await eventRepository.getAll(), filter, q);

  return (
    <main className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-9 lg:pb-20">
      <h1 className="font-display text-display-sm font-semibold text-brand-primary lg:text-display-md">Events</h1>
      <p className="mt-2 text-md text-slate-600 dark:text-slate-300">
        Workshops, hackathons, talks and meetups from SCESA and its communities.
      </p>
      <div className="mt-8">
        <EventFilters filter={filter} q={q} />
      </div>
      <p aria-live="polite" className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        {events.length === 1 ? "1 event" : `${events.length} events`}
      </p>
      {events.length > 0 ? (
        <ul className="mt-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.slug}>
              <EventCard {...event} href={`/events/${event.slug}`} date={formatShortDate(event.date)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-border px-4 py-16 text-center">
          <h2 className="font-display text-display-xs font-semibold text-brand-primary">No events match</h2>
          <p className="text-md text-slate-600 dark:text-slate-300">Try another filter or a different search term.</p>
          <Button href="/events" variant="outline">
            Clear filters
          </Button>
        </div>
      )}
    </main>
  );
}
