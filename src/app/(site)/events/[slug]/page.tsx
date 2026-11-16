import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { eventRepository } from "@/data/repositories/EventRepository";
import { cn } from "@/lib/cn";
import { formatDayOfMonth, formatLongDate, formatMonthAbbr, formatTimeRange } from "@/lib/dates";
import { allowOnly } from "@/lib/mdx";
import { CONTAINER, EYEBROW } from "@/lib/styles";
import { AddToCalendar } from "@/presentation/components/events/AddToCalendar";
import { CATEGORY_LABEL, STATUS_LABEL } from "@/presentation/components/events/EventCard";
import { EventMap } from "@/presentation/components/events/EventMap";
import { mdxComponents } from "@/presentation/components/events/mdxComponents";
import { PosterViewer } from "@/presentation/components/events/PosterViewer";
import { RevealText } from "@/presentation/components/motion/RevealText";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";
import { BackLink } from "@/presentation/components/ui/BackLink";
import { Badge } from "@/presentation/components/ui/Badge";

// GFM: strikethrough and tables as Keystatic saves them. Only elements with a component render; raw HTML is dropped.
const mdxOptions = { remarkPlugins: [remarkGfm, allowOnly(Object.keys(mdxComponents))] };

// Event status comes from the clock, so rebuild hourly.
export const revalidate = 3600;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await eventRepository.getAll()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await eventRepository.getBySlug((await params).slug);
  return event ? { title: event.title, description: event.excerpt } : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const event = await eventRepository.getBySlug((await params).slug);
  if (!event) notFound();
  const ended = event.status === "completed";
  const facts: { label: string; value: string; detail?: string }[] = [
    { label: "When", value: formatLongDate(event.date), detail: formatTimeRange(event.date, event.endDate) },
    { label: "Where", value: event.venue ?? "Online" },
    { label: "Hosted by", value: event.hosts.join(", ") },
    ...(event.speaker ? [{ label: "Speaker", value: event.speaker }] : []),
  ];
  const actions = (
    <AddToCalendar slug={event.slug} title={event.title} virtualUrl={event.virtualUrl} registrationUrl={event.registrationUrl} />
  );

  return (
    <main>
      <header className="relative overflow-x-clip">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div className={`${CONTAINER} relative pt-8 pb-12 lg:pt-12 lg:pb-16`}>
          <BackLink href="/events">All events</BackLink>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-9">
              <p className={cn(EYEBROW, "flex flex-wrap items-center gap-3 motion-safe:animate-fade-up")}>
                {CATEGORY_LABEL[event.category]}
                <Badge variant={event.status}>{STATUS_LABEL[event.status]}</Badge>
              </p>
              <h1 className="mt-6 font-display text-display-md font-semibold text-balance text-brand-primary sm:text-display-lg xl:text-display-xl">
                <RevealText lines={[event.title]} />
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-brand-muted lg:text-xl">{event.excerpt}</p>
            </div>
            <p
              aria-hidden
              className="hidden items-baseline gap-3 font-display text-brand-primary motion-safe:animate-fade-up lg:col-span-3 lg:flex lg:justify-self-end"
              style={{ animationDelay: "400ms" }}
            >
              <span className="text-display-2xl leading-none font-semibold tabular-nums">{formatDayOfMonth(event.date)}</span>
              <span className="text-display-xs font-medium uppercase">{formatMonthAbbr(event.date)}</span>
            </p>
          </div>

          <dl className="mt-12 grid border-t border-brand-border sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {facts.map(({ label, value, detail }) => (
              <div key={label} className="border-b border-brand-border py-5 sm:pr-6 lg:border-b-0 lg:py-6">
                <dt className={EYEBROW}>{label}</dt>
                <dd className="mt-2 font-medium text-brand-primary">{value}</dd>
                {detail && <dd className="mt-0.5 text-sm text-brand-muted">{detail}</dd>}
              </div>
            ))}
          </dl>
        </div>
      </header>

      <div className={`${CONTAINER} grid gap-12 pb-16 lg:grid-cols-12 lg:gap-16 lg:pb-24`}>
        <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl border border-brand-border bg-brand-sunken">
            <Image
              src={event.image}
              alt={event.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <PosterViewer src={event.image} alt={event.imageAlt} title={event.title} />
          </div>
          <div className="hidden rounded-3xl border border-brand-border bg-brand-surface p-6 lg:block">
            {ended ? (
              <EndedNote />
            ) : (
              <>
                <p className={EYEBROW}>Save your spot</p>
                <div className="mt-4">{actions}</div>
              </>
            )}
          </div>
        </aside>

        <article className="lg:col-span-7">
          <h2 className="font-display text-display-xs font-semibold text-brand-primary lg:text-display-sm">About this event</h2>
          <div className="mt-2">
            <MDXRemote source={event.body} components={mdxComponents} options={{ mdxOptions }} />
          </div>
          {event.venue && event.mapQuery && (
            <div className="mt-14">
              <EventMap query={event.mapQuery} venue={event.venue} />
            </div>
          )}
          {ended && (
            <div className="mt-14 border-t border-brand-border pt-10 lg:hidden">
              <EndedNote />
            </div>
          )}
        </article>
      </div>

      {!ended && (
        <div className="sticky bottom-0 z-30 border-t border-brand-border bg-brand-surface/90 py-3 backdrop-blur-md lg:hidden">
          <div className={CONTAINER}>{actions}</div>
        </div>
      )}
    </main>
  );
}

function EndedNote() {
  return (
    <div>
      <p className="font-display text-xl font-semibold text-brand-primary">This event has ended</p>
      <p className="mt-2 text-md text-brand-muted">Catch the recap and photos on Spotlight, or see what&apos;s coming up next.</p>
      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
        <ArrowLink href="/spotlight?kind=recap">Read recaps</ArrowLink>
        <ArrowLink href="/events?filter=upcoming">Upcoming events</ArrowLink>
      </div>
    </div>
  );
}
