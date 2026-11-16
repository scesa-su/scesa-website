import { MapPin, Video } from "lucide-react";
import type { ReactNode } from "react";
import type { Event } from "@/domain/entities/Event";
import { formatDayOfMonth, formatLongDate, formatMonthAbbr, formatTimeRange } from "@/lib/dates";
import { FOCUS_RING } from "@/lib/styles";

const tile =
  "flex size-10 shrink-0 flex-col items-center justify-center rounded-lg border border-brand-border bg-brand-sunken text-brand-primary";
const secondary = "text-sm text-brand-muted";
const link =
  `rounded-sm font-medium text-brand-primary underline underline-offset-2 hover:text-brand-accent ${FOCUS_RING}`;

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
