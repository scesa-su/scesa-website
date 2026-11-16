import type { Metadata } from "next";
import { ArrowUpRightIcon } from "lucide-react";
import { eventRepository } from "@/data/repositories/EventRepository";
import { filterEvents, parseFilter } from "@/domain/usecases/eventQueries";
import { cn } from "@/lib/cn";
import { SOCIAL_LINKS } from "@/lib/constants";
import { formatShortDate } from "@/lib/dates";
import { CONTAINER, EYEBROW, FOCUS_RING_OFFSET } from "@/lib/styles";
import { EventCard } from "@/presentation/components/events/EventCard";
import { EventFilters } from "@/presentation/components/events/EventFilters";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Reveal } from "@/presentation/components/motion/Reveal";
import { Button } from "@/presentation/components/ui/Button";

export const metadata: Metadata = {
  title: "Events",
  description: "Workshops, hackathons, talks and meetups from SCESA and its communities.",
};

const LUMA_URL = SOCIAL_LINKS.find(({ icon }) => icon === "luma")?.href;

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const params = await searchParams;
  const filter = parseFilter(params.filter);
  const q = typeof params.q === "string" ? params.q : "";
  const all = await eventRepository.getAll();
  const events = filterEvents(all, filter, q);
  const upcoming = all.filter((e) => e.status !== "completed").length;

  return (
    <main>
      <PageHeader
        eyebrow="What's on"
        title={["Events"]}
        underline
        intro="Workshops, hackathons, talks and meetups from SCESA and its communities."
        aside={
          <div className="flex flex-col gap-2 lg:items-end lg:text-right">
            {upcoming > 0 ? (
              <>
                <p className="font-display text-display-xl font-semibold text-brand-primary tabular-nums">{upcoming}</p>
                <p className="text-md text-brand-muted">{upcoming === 1 ? "event coming up" : "events coming up"}</p>
              </>
            ) : (
              <p className="max-w-60 text-md text-brand-muted">Nothing scheduled yet. New events land on Luma first.</p>
            )}
            {LUMA_URL && (
              <a
                href={LUMA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group mt-2 inline-flex items-center gap-1.5 rounded-lg font-semibold text-brand-primary transition-colors duration-200 hover:text-orange-700 dark:hover:text-brand-accent",
                  FOCUS_RING_OFFSET,
                )}
              >
                Get reminders on Luma
                <span className="sr-only"> (opens in new tab)</span>
                <ArrowUpRightIcon
                  aria-hidden
                  className="size-4 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            )}
          </div>
        }
      />

      <div className={`${CONTAINER} pb-16 lg:pb-24`}>
        <div className="border-t border-brand-border pt-8">
          <EventFilters filter={filter} q={q} />
        </div>
        <p aria-live="polite" className={cn(EYEBROW, "mt-8")}>
          {events.length === 1 ? "1 event" : `${events.length} events`}
        </p>
        {events.length > 0 ? (
          <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, i) => (
              <li key={event.slug}>
                <Reveal delay={(i % 3) * 0.08} className="h-full">
                  <EventCard {...event} href={`/events/${event.slug}`} date={formatShortDate(event.date)} />
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-border px-4 py-20 text-center">
            <h2 className="font-display text-display-xs font-semibold text-brand-primary">No events match</h2>
            <p className="text-md text-brand-muted">Try another filter or a different search term.</p>
            <Button href="/events" variant="outline">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
