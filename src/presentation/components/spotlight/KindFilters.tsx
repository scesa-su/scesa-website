import Link from "next/link";
import { SPOTLIGHT_KINDS, type SpotlightKind } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { FILTER_LABEL } from "./kinds";

const OPTIONS: { kind?: SpotlightKind; label: string }[] = [
  { label: "All" },
  ...SPOTLIGHT_KINDS.map((kind) => ({ kind, label: FILTER_LABEL[kind] })),
];

/** Plain links (?kind=…); the server page does the filtering, so no client JS. */
export function KindFilters({ kind }: { kind?: SpotlightKind }) {
  return (
    <nav aria-label="Filter posts by kind">
      <ul className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => {
          const active = o.kind === kind;
          return (
            <li key={o.label}>
              <Link
                href={o.kind ? `/spotlight?kind=${o.kind}` : "/spotlight"}
                aria-current={active ? "page" : undefined}
                aria-label={o.kind ? `Show ${o.label.toLowerCase()} only` : "Show all posts"}
                scroll={false}
                className={cn(
                  "inline-flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background",
                  active
                    ? "border-brand-primary bg-brand-primary text-brand-background"
                    : "border-brand-border bg-brand-surface text-brand-primary hover:bg-navy-25",
                )}
              >
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
