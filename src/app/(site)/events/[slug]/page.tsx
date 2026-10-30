import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { eventRepository } from "@/data/repositories/EventRepository";
import { AddToCalendar } from "@/presentation/components/events/AddToCalendar";
import { STATUS_LABEL } from "@/presentation/components/events/EventCard";
import { EventMeta, HostedBy } from "@/presentation/components/events/EventMeta";
import { mdxComponents } from "@/presentation/components/events/mdxComponents";
import { Badge } from "@/presentation/components/ui/Badge";
import { Card } from "@/presentation/components/ui/Card";
import { allowOnly } from "@/lib/mdx";

// Only elements with a component render; raw HTML in an event is dropped.
const mdxOptions = { remarkPlugins: [allowOnly(Object.keys(mdxComponents))] };

// Event status comes from the clock, so rebuild hourly.
export const revalidate = 3600;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await eventRepository.getAll()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/events/[slug]">): Promise<Metadata> {
  const event = await eventRepository.getBySlug((await params).slug);
  return event ? { title: `${event.title} | SCESA`, description: event.excerpt } : {};
}

export default async function EventPage({ params }: PageProps<"/events/[slug]">) {
  const event = await eventRepository.getBySlug((await params).slug);
  if (!event) notFound();
  const showCalendar = event.status !== "completed";

  return (
    <main className="mx-auto w-full max-w-360 px-4 py-8 md:px-8 lg:px-14 lg:py-12">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-12">
        <div className="flex flex-col gap-8">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-border">
            <Image src={event.image} alt={event.imageAlt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            <Badge variant={event.status} className="absolute top-3 left-3">
              {STATUS_LABEL[event.status]}
            </Badge>
          </div>
          <div className="hidden lg:block">
            <HostedBy community={event.community} speaker={event.speaker} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h1 className="font-display text-display-sm font-semibold text-brand-primary lg:text-display-md">{event.title}</h1>
          <EventMeta {...event} />
          {showCalendar && (
            <Card className="hidden p-4 lg:block">
              <AddToCalendar slug={event.slug} title={event.title} virtualUrl={event.virtualUrl} />
            </Card>
          )}
          <div className="lg:hidden">
            <HostedBy community={event.community} speaker={event.speaker} />
          </div>
          <section aria-labelledby="about-event">
            <h2 id="about-event" className="font-display text-display-sm font-semibold text-brand-primary">
              About this event
            </h2>
            <p className="mt-3 text-md text-slate-600 dark:text-slate-300">{event.excerpt}</p>
            <MDXRemote source={event.body} components={mdxComponents} options={{ mdxOptions }} />
          </section>
          {showCalendar && (
            <div className="sticky bottom-0 -mx-4 border-t border-brand-border bg-brand-surface px-4 py-3 md:-mx-8 md:px-8 lg:hidden">
              <AddToCalendar slug={event.slug} title={event.title} virtualUrl={event.virtualUrl} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
