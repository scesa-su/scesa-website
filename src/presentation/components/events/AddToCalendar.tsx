import { CalendarPlus, ClipboardPen, Video } from "lucide-react";
import type { Event } from "@/domain/entities/Event";
import { cn } from "@/lib/cn";
import { Button } from "@/presentation/components/ui/Button";

type AddToCalendarProps = Pick<Event, "slug" | "title" | "virtualUrl" | "registrationUrl"> & { className?: string };

const external = { target: "_blank", rel: "noopener noreferrer", className: "min-w-36 flex-1" } as const;

/**
 * Downloads the event's static .ics. Adds a "Register" link when the event has a sign-up form
 * (it then takes the primary style) and a "Join online" link for virtual events.
 */
export function AddToCalendar({ slug, title, virtualUrl, registrationUrl, className }: AddToCalendarProps) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {registrationUrl && (
        <Button href={registrationUrl} aria-label={`Register for ${title} (opens in a new tab)`} {...external}>
          <ClipboardPen aria-hidden="true" className="size-4" />
          Register
        </Button>
      )}
      <Button
        href={`/events/${slug}/calendar.ics`}
        download={`${slug}.ics`}
        prefetch={false}
        variant={registrationUrl ? "outline" : "primary"}
        aria-label={`Add ${title} to your calendar (downloads an .ics file)`}
        className="min-w-36 flex-1"
      >
        <CalendarPlus aria-hidden="true" className="size-4" />
        Add to Calendar
      </Button>
      {virtualUrl && (
        <Button href={virtualUrl} variant="outline" aria-label={`Join ${title} online (opens in a new tab)`} {...external}>
          <Video aria-hidden="true" className="size-4" />
          Join online
        </Button>
      )}
    </div>
  );
}
