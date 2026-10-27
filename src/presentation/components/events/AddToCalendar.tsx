import { CalendarPlus, Video } from "lucide-react";
import type { Event } from "@/domain/entities/Event";
import { cn } from "@/lib/cn";
import { Button } from "@/presentation/components/ui/Button";

type AddToCalendarProps = Pick<Event, "slug" | "title" | "virtualUrl"> & { className?: string };

/** Downloads the event's static .ics; adds a "Join online" link for virtual events. */
export function AddToCalendar({ slug, title, virtualUrl, className }: AddToCalendarProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      <Button
        href={`/events/${slug}/calendar.ics`}
        download={`${slug}.ics`}
        prefetch={false}
        aria-label={`Add ${title} to your calendar (downloads an .ics file)`}
        className="flex-1"
      >
        <CalendarPlus aria-hidden="true" className="size-4" />
        Add to Calendar
      </Button>
      {virtualUrl && (
        <Button
          href={virtualUrl}
          variant="outline"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Join ${title} online (opens in a new tab)`}
          className="flex-1"
        >
          <Video aria-hidden="true" className="size-4" />
          Join online
        </Button>
      )}
    </div>
  );
}
