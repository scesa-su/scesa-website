import { eventRepository } from "@/data/repositories/EventRepository";
import { formatShortDate } from "@/lib/dates";
import { EventCard } from "@/presentation/components/events/EventCard";

export async function FeaturedEvents() {
  const events = (await eventRepository.getAll()).slice(0, 3);
  return (
    <section aria-labelledby="our-events" className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-9 lg:pb-20">
      <h2 id="our-events" className="text-center font-display text-display-sm font-semibold text-brand-primary">
        Our Events
      </h2>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <li key={event.slug}>
            <EventCard {...event} href={`/events/${event.slug}`} date={formatShortDate(event.date)} />
          </li>
        ))}
      </ul>
    </section>
  );
}
