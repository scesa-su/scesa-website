import { eventRepository } from "@/data/repositories/EventRepository";
import { cn } from "@/lib/cn";
import { formatShortDate } from "@/lib/dates";
import { CONTAINER } from "@/lib/styles";
import { EventCard } from "@/presentation/components/events/EventCard";
import { Button } from "@/presentation/components/ui/Button";

export async function FeaturedEvents() {
  const events = (await eventRepository.getAll()).slice(0, 3);
  return (
    <section aria-labelledby="our-events" className={`${CONTAINER} py-12 lg:pb-20`}>
      <h2 id="our-events" className="text-center font-display text-display-sm font-semibold text-brand-primary">
        Our Events
      </h2>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          // 3 cards in 1 or 3 columns; the third is hidden in the 2-column layout so no row is half empty.
          <li key={event.slug} className={cn(i === 2 && "sm:hidden lg:block")}>
            <EventCard {...event} href={`/events/${event.slug}`} date={formatShortDate(event.date)} />
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <Button href="/events" variant="outline" size="lg" aria-label="See all SCESA events">
          See all events
        </Button>
      </div>
    </section>
  );
}
