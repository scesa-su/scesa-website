import Image from "next/image";
import Link from "next/link";
import type { EventStatus } from "@/domain/entities/Event";
import { FOCUS_RING } from "@/lib/styles";
import { Badge } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";

export const STATUS_LABEL: Record<EventStatus, string> = { live: "Live", scheduled: "Scheduled", completed: "Completed" };

type EventCardProps = {
  title: string;
  excerpt: string;
  status: EventStatus;
  image: string;
  imageAlt: string;
  href: string;
  /** Already formatted for display, e.g. "14 Nov 2026". */
  date?: string;
};

export function EventCard({ title, excerpt, status, image, imageAlt, href, date }: EventCardProps) {
  return (
    <Card className="group relative flex h-full flex-col transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-16/10 overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-brand-primary">
            <Link
              href={href}
              className={`rounded-sm after:absolute after:inset-0 ${FOCUS_RING}`}
            >
              {title}
            </Link>
          </h3>
          <Badge variant={status}>{STATUS_LABEL[status]}</Badge>
        </div>
        {date && <p className="text-sm font-medium text-brand-muted">{date}</p>}
        <p className="mb-4 text-sm text-brand-muted">{excerpt}</p>
        <Button href={href} variant="soft" aria-label={`View event: ${title}`} className="relative mt-auto w-full">
          View Event
        </Button>
      </div>
    </Card>
  );
}
