"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { EventFilter } from "@/domain/usecases/eventQueries";
import { cn } from "@/lib/cn";
import { FOCUS_RING_OFFSET } from "@/lib/styles";

const FILTER_LABELS: Record<EventFilter, string> = {
  all: "All",
  upcoming: "Upcoming",
  workshops: "Workshops",
  hackathons: "Hackathons",
  completed: "Completed",
};

function eventsHref(filter: EventFilter, q: string) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (q.trim()) params.set("q", q.trim());
  const query = params.toString();
  return query ? `/events?${query}` : "/events";
}

type EventFiltersProps = { filter: EventFilter; q: string };

/** Writes filter and search to the URL; the server page does the filtering. */
export function EventFilters({ filter, q }: EventFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(q);
  // Last q this component pushed; a different incoming q means outside navigation (Clear filters, back button).
  const [pushedQ, setPushedQ] = useState(q);
  const [seenQ, setSeenQ] = useState(q);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  if (q !== seenQ) {
    setSeenQ(q);
    if (q !== pushedQ) {
      setValue(q);
      setPushedQ(q);
    }
  }

  function navigate(nextFilter: EventFilter, nextQ: string) {
    clearTimeout(timer.current);
    setPushedQ(nextQ.trim());
    startTransition(() => router.replace(eventsHref(nextFilter, nextQ), { scroll: false }));
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div
        role="group"
        aria-label="Filter events"
        className="flex overflow-x-auto rounded-full border border-brand-border bg-brand-surface p-1 [scrollbar-width:none]"
      >
        {(Object.keys(FILTER_LABELS) as EventFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={f === filter}
            onClick={() => navigate(f, value)}
            className={cn(
              "relative isolate h-11 shrink-0 rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors duration-300",
              FOCUS_RING_OFFSET,
              f === filter ? "text-brand-background" : "text-brand-primary hover:bg-brand-sunken",
            )}
          >
            {f === filter && (
              <motion.span
                layoutId="event-filter-pill"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
                className="absolute inset-0 -z-10 rounded-full bg-brand-primary"
              />
            )}
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
      <div className="relative md:w-80">
        <label htmlFor="event-search" className="sr-only">
          Search events by title, speaker or host
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        />
        <input
          id="event-search"
          type="search"
          value={value}
          placeholder="Search title, speaker or host"
          onChange={(e) => {
            const next = e.target.value;
            setValue(next);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => navigate(filter, next), 300);
          }}
          className={cn(
            "h-12 w-full rounded-full border border-brand-border bg-brand-surface pr-4 pl-11 text-md text-brand-primary transition-colors placeholder:text-slate-500 hover:border-slate-400 dark:placeholder:text-slate-400",
            FOCUS_RING_OFFSET,
          )}
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {isPending ? "Updating results" : ""}
      </p>
    </div>
  );
}
