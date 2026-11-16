import Link from "next/link";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import type { Event } from "@/domain/entities/Event";
import { cn } from "@/lib/cn";
import { formatDayOfMonth, formatMonthAbbr } from "@/lib/dates";
import { CONTAINER, EYEBROW, FOCUS_RING_OFFSET } from "@/lib/styles";
import { Magnetic } from "@/presentation/components/motion/Magnetic";
import { RevealText } from "@/presentation/components/motion/RevealText";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";
import { Button } from "@/presentation/components/ui/Button";
import { ScribbleUnderline } from "@/presentation/components/ui/Scribble";
import { SwipeableDeck } from "./SwipeableDeck";

const LINE_STAGGER = 80;
const AFTER_HEADLINE = 3 * LINE_STAGGER + 500;

export function HeroSection({ nextEvent }: { nextEvent?: Event }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain" />

      <div className={`${CONTAINER} relative flex min-h-[calc(100svh-8rem)] flex-col lg:min-h-[calc(100svh-9rem)]`}>
        <div className="grid flex-1 items-center gap-14 py-10 lg:grid-cols-12 lg:gap-8 lg:py-16">
          <div className="relative z-10 lg:col-span-7">
            <p className={cn(EYEBROW, "motion-safe:animate-fade-up")}>SCESA · Strathmore University · Est. 2014</p>
            <h1 id="hero-title" className="mt-6 font-display text-display-hero font-semibold text-brand-primary">
              <RevealText
                stagger={LINE_STAGGER}
                lines={[
                  "Where Strathmore's",
                  "Tech Pioneers",
                  <span key="future" className="relative inline-block pb-[0.08em]">
                    Build the Future
                    <ScribbleUnderline delay={AFTER_HEADLINE} strokeWidth={5} className="bottom-0 h-[0.14em] text-brand-accent" />
                  </span>,
                ]}
              />
            </h1>
            <p
              className="mt-8 max-w-xl text-lg text-brand-muted motion-safe:animate-fade-up lg:text-xl"
              style={{ animationDelay: `${AFTER_HEADLINE - 200}ms` }}
            >
              Workshops, hackathons and communities for Strathmore&apos;s computing and engineering students.
            </p>
            <div
              className="mt-10 flex flex-col gap-6 motion-safe:animate-fade-up sm:flex-row sm:items-center sm:gap-8"
              style={{ animationDelay: `${AFTER_HEADLINE - 100}ms` }}
            >
              <Magnetic className="w-full sm:w-auto">
                <Button href="/join" size="xl" className="w-full sm:w-auto">
                  Find Your Tribe
                </Button>
              </Magnetic>
              <ArrowLink href="/events" className="self-center text-lg sm:self-auto">
                See what&apos;s on
              </ArrowLink>
            </div>
          </div>

          <div className="relative px-4 sm:px-10 lg:col-span-5 lg:px-0">
            <SwipeableDeck />
          </div>
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-brand-border py-5">
          {nextEvent ? <NextUp event={nextEvent} /> : <span />}
          <p aria-hidden className="hidden items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-muted uppercase sm:flex">
            Scroll
            <ArrowDownIcon className="size-4 motion-safe:animate-bounce" />
          </p>
        </div>
      </div>
    </section>
  );
}

function NextUp({ event }: { event: Event }) {
  const label = event.status === "completed" ? "Latest" : event.status === "live" ? "Happening now" : "Next up";
  return (
    <Link
      href={`/events/${event.slug}`}
      className={cn("group flex min-w-0 items-center gap-4 rounded-lg text-sm sm:gap-6", FOCUS_RING_OFFSET)}
    >
      <span className={cn(EYEBROW, "shrink-0")}>{label}</span>
      <span className="shrink-0 font-semibold text-brand-primary tabular-nums">
        {formatDayOfMonth(event.date)} {formatMonthAbbr(event.date)}
      </span>
      <span className="truncate font-medium text-brand-primary group-hover:underline group-hover:underline-offset-4">
        {event.title}
      </span>
      <ArrowRightIcon
        aria-hidden
        className="size-4 shrink-0 text-brand-primary transition-transform duration-500 ease-out-expo group-hover:translate-x-1"
      />
    </Link>
  );
}
