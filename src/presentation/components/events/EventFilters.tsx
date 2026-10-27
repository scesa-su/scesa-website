"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { EventFilter } from "@/domain/usecases/eventQueries";
import { cn } from "@/lib/cn";

const FILTER_LABELS: Record<EventFilter, string> = {
  all: "All",
  upcoming: "Upcoming",
  workshops: "Workshops",
  hackathons: "Hackathons",
  completed: "Completed",
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background";

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
      <div role="group" aria-label="Filter events" className="flex flex-wrap gap-2">
        {(Object.keys(FILTER_LABELS) as EventFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={f === filter}
            onClick={() => navigate(f, value)}
            className={cn(
              "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
              focusRing,
              f === filter
                ? "border-brand-primary bg-brand-primary text-brand-background"
                : "border-brand-border bg-brand-surface text-brand-primary hover:bg-navy-25",
            )}
          >
            {FILTER_LABELS[f]}
          </button>
        ))}
      </div>
      <div className="relative md:w-80">
        <label htmlFor="event-search" className="sr-only">
          Search events by title, speaker or community
        </label>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500 dark:text-slate-400"
        />
        <input
          id="event-search"
          type="search"
          value={value}
          placeholder="Search title, speaker or community"
          onChange={(e) => {
            const next = e.target.value;
            setValue(next);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => navigate(filter, next), 300);
          }}
          className={cn(
            "h-10 w-full rounded-lg border border-brand-border bg-brand-surface pr-3 pl-9 text-sm text-brand-primary placeholder:text-slate-500 dark:placeholder:text-slate-400",
            focusRing,
          )}
        />
      </div>
      <p aria-live="polite" className="sr-only">
        {isPending ? "Updating results" : ""}
      </p>
    </div>
  );
}
