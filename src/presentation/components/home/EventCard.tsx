import Image from "next/image";
import { Badge } from "@/presentation/components/ui/Badge";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";

const STATUS_LABEL = { live: "Live", scheduled: "Scheduled", completed: "Completed" } as const;

type EventCardProps = {
  title: string;
  excerpt: string;
  status: keyof typeof STATUS_LABEL;
  image: string;
  imageAlt: string;
};

export function EventCard({ title, excerpt, status, image, imageAlt }: EventCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="relative aspect-16/10">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-brand-primary">{title}</h3>
          <Badge variant={status}>{STATUS_LABEL[status]}</Badge>
        </div>
        <p className="mb-4 text-xs text-slate-600 dark:text-slate-300">{excerpt}</p>
        {/* shortcut: links to /events until event detail pages exist */}
        <Button href="/events" variant="soft" aria-label={`View event: ${title}`} className="mt-auto w-full">
          View Event
        </Button>
      </div>
    </Card>
  );
}
