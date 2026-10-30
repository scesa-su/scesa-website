import { ExternalLink } from "lucide-react";

const link =
  "inline-flex items-center gap-1 rounded-sm text-sm font-medium text-brand-primary underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

/** Google Maps pin for an in-person event. The keyless embed URL needs no API key; CSP must allow frame-src https://www.google.com. */
export function EventMap({ query, venue }: { query: string; venue: string }) {
  const q = encodeURIComponent(query);
  return (
    <section aria-labelledby="event-location" className="flex flex-col gap-3">
      <h2 id="event-location" className="font-display text-display-xs font-semibold text-brand-primary">
        Location
      </h2>
      <p className="text-md text-slate-600 dark:text-slate-300">{venue}</p>
      <iframe
        src={`https://www.google.com/maps?q=${q}&output=embed`}
        title={`Map showing ${venue}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="aspect-[4/3] w-full rounded-2xl border border-brand-border sm:aspect-video"
      />
      <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className={link}>
        Open in Google Maps
        <ExternalLink aria-hidden="true" className="size-3.5" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </section>
  );
}
