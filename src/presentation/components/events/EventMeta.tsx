import { MapPin, Video } from "lucide-react";
import { useId, type ReactNode } from "react";
import type { Event } from "@/domain/entities/Event";
import { formatDayOfMonth, formatLongDate, formatMonthAbbr, formatTimeRange } from "@/lib/dates";

const tile =
  "flex size-10 shrink-0 flex-col items-center justify-center rounded-lg border border-brand-border bg-navy-25 text-brand-primary";
const secondary = "text-sm text-slate-600 dark:text-slate-300";
const link =
  "rounded-sm font-medium text-brand-primary underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

type MetaProps = Pick<Event, "title" | "date" | "endDate" | "venue" | "virtualUrl">;

/** Date/time and location rows, Luma style. */
export function EventMeta({ title, date, endDate, venue, virtualUrl }: MetaProps) {
  const joinLink = virtualUrl && (
    <a href={virtualUrl} target="_blank" rel="noopener noreferrer" aria-label={`Join ${title} online (opens in a new tab)`} className={link}>
      Join online
    </a>
  );
  return (
    <div className="flex flex-col gap-4">
      <Row
        icon={
          <span className={tile} aria-hidden="true">
            <span className="text-[0.625rem] leading-none font-semibold uppercase">{formatMonthAbbr(date)}</span>
            <span className="text-md leading-none font-semibold">{formatDayOfMonth(date)}</span>
          </span>
        }
      >
        <p className="font-medium text-brand-primary"><span className="sr-only">Date: </span>{formatLongDate(date)}</p>
        <p className={secondary}>{formatTimeRange(date, endDate)}</p>
      </Row>
      <Row
        icon={
          <span className={tile} aria-hidden="true">
            {venue ? <MapPin className="size-5" /> : <Video className="size-5" />}
          </span>
        }
      >
        <p className="font-medium text-brand-primary"><span className="sr-only">Location: </span>{venue ?? "Online event"}</p>
        {joinLink && <p className={secondary}>{joinLink}</p>}
      </Row>
    </div>
  );
}

const AVATAR_TONES = [
  "bg-navy-50 text-brand-primary",
  "bg-orange-100 text-orange-900",
  "bg-brand-secondary text-slate-900",
];

/** "AWS Club" -> "AC", "GDSC" -> "GD". */
export const initials = (name: string) => {
  const words = name.trim().split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
};

/** Overlapping initial circles, Luma style; hover or keyboard focus shows each host's full name. */
function HostStack({ hosts }: { hosts: string[] }) {
  return (
    <ul className="flex items-center py-3 pl-2">
      {hosts.map((name, i) => (
        <li key={name} className="group relative -ml-2">
          <span
            role="img"
            aria-label={name}
            tabIndex={0}
            className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ring-2 ring-brand-surface focus-visible:outline-none focus-visible:ring-brand-accent ${AVATAR_TONES[i % AVATAR_TONES.length]}`}
          >
            <span aria-hidden="true">{initials(name)}</span>
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Host communities and, when there is one, the speaker. */
export function HostedBy({ hosts, speaker }: Pick<Event, "hosts" | "speaker">) {
  // Rendered twice (lg and below-lg copies), so the label id must be unique per instance.
  const labelId = useId();
  return (
    <section aria-labelledby={labelId}>
      <p id={labelId} className="border-b border-brand-border pb-2 text-sm font-semibold text-brand-primary">
        Hosted by
      </p>
      <div className="divide-y divide-brand-border">
        <HostStack hosts={hosts} />
        {speaker && (
          <div className="py-3">
            <p className={secondary}>Speaker</p>
            <p className="font-medium text-brand-primary">{speaker}</p>
          </div>
        )}
      </div>
    </section>
  );
}
