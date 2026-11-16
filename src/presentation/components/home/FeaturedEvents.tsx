import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, MapPinIcon, VideoIcon } from "lucide-react";
import type { Event } from "@/domain/entities/Event";
import { cn } from "@/lib/cn";
import { SOCIAL_LINKS } from "@/lib/constants";
import { formatDayOfMonth, formatMonthAbbr, formatShortDate } from "@/lib/dates";
import { BODY, FOCUS_RING, H2, SECTION } from "@/lib/styles";
import { STATUS_LABEL } from "@/presentation/components/events/EventCard";
import { Reveal } from "@/presentation/components/motion/Reveal";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";
import { Badge } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { SectionLabel } from "./SectionLabel";

const LUMA_URL = SOCIAL_LINKS.find(({ icon }) => icon === "luma")?.href;
const eventHref = (e: Event) => `/events/${e.slug}`;
const STRETCHED = cn("rounded-sm after:absolute after:inset-0", FOCUS_RING);

export function FeaturedEvents({ events }: { events: Event[] }) {
  const [lead, ...rest] = events;
  return (
    <section aria-labelledby="our-events" className={SECTION}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionLabel index={4}>What&apos;s on</SectionLabel>
          <h2 id="our-events" className={`mt-6 ${H2}`}>
            Our Events
          </h2>
        </div>
        <ArrowLink href="/events">
          See all events
        </ArrowLink>
      </div>

      {lead ? (
        <>
          <Reveal className="mt-12">
            <EventTicket event={lead} />
          </Reveal>
          {rest.length > 0 && (
            <ul className="mt-10 border-b border-brand-border">
              {rest.map((event) => (
                <li key={event.slug} className="border-t border-brand-border">
                  <EventRow event={event} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-border px-4 py-16 text-center">
          <h3 className="font-display text-display-xs font-semibold text-brand-primary">Nothing on the calendar yet</h3>
          <p className="max-w-md text-md text-brand-muted">
            New events land on Luma first. Meanwhile, catch up on what members have been up to.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LUMA_URL && (
              <Button href={LUMA_URL} target="_blank" rel="noopener noreferrer" variant="outline" aria-label="Follow SCESA on Luma (opens in new tab)">
                Follow us on Luma
              </Button>
            )}
            <Button href="/spotlight" variant="soft">
              Read Spotlight
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function EventTicket({ event }: { event: Event }) {
  const Place = event.virtualUrl ? VideoIcon : MapPinIcon;
  return (
    <article className="group relative grid overflow-hidden rounded-3xl border border-brand-border bg-brand-surface md:grid-cols-12">
      <div className="relative aspect-16/10 overflow-hidden md:col-span-7 md:aspect-auto md:min-h-104">
        <Image
          src={event.image}
          alt={event.imageAlt}
          fill
          sizes="(min-width: 768px) 58vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-5 p-6 md:col-span-5 md:border-l md:border-dashed md:border-brand-border md:p-10">
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-baseline gap-3 font-display text-brand-primary">
            <span className="text-display-lg font-semibold tabular-nums">{formatDayOfMonth(event.date)}</span>
            <span className="text-xl font-medium uppercase">{formatMonthAbbr(event.date)}</span>
          </p>
          <Badge variant={event.status}>{STATUS_LABEL[event.status]}</Badge>
        </div>
        <h3 className="font-display text-display-xs font-semibold text-balance text-brand-primary md:text-display-sm">
          <Link href={eventHref(event)} className={STRETCHED}>
            {event.title}
          </Link>
        </h3>
        <p className={BODY}>{event.excerpt}</p>
        {(event.venue || event.virtualUrl) && (
          <p className="flex items-center gap-2 text-sm font-medium text-brand-muted">
            <Place aria-hidden className="size-4 shrink-0" />
            {event.venue ?? "Online"}
          </p>
        )}
        <Button href={eventHref(event)} variant="soft" size="lg" aria-label={`View event: ${event.title}`} className="relative mt-auto self-start">
          View Event
        </Button>
      </div>
    </article>
  );
}

function EventRow({ event }: { event: Event }) {
  return (
    <article className="group relative grid grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-4 py-6 sm:grid-cols-[8rem_minmax(0,1fr)_auto_auto] sm:gap-8">
      <p className="text-sm font-semibold text-brand-muted tabular-nums">{formatShortDate(event.date)}</p>
      <h3 className="font-display text-xl font-semibold text-brand-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
        <Link href={eventHref(event)} className={STRETCHED}>
          {event.title}
        </Link>
      </h3>
      <Badge variant={event.status} className="hidden sm:inline-flex">
        {STATUS_LABEL[event.status]}
      </Badge>
      <ArrowRightIcon
        aria-hidden
        className="size-5 text-brand-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
      />
    </article>
  );
}
