"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SPOTLIGHT_KINDS, type SpotlightKind } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { FOCUS_RING_OFFSET } from "@/lib/styles";
import { FILTER_LABEL } from "./kinds";

const OPTIONS: { kind?: SpotlightKind; label: string }[] = [
  { label: "All" },
  ...SPOTLIGHT_KINDS.map((kind) => ({ kind, label: FILTER_LABEL[kind] })),
];

export function KindFilters({ kind }: { kind?: SpotlightKind }) {
  return (
    <nav aria-label="Filter posts by kind">
      <ul className="inline-flex max-w-full overflow-x-auto rounded-full border border-brand-border bg-brand-surface p-1 [scrollbar-width:none]">
        {OPTIONS.map((o) => {
          const active = o.kind === kind;
          return (
            <li key={o.label} className="shrink-0">
              <Link
                href={o.kind ? `/spotlight?kind=${o.kind}` : "/spotlight"}
                aria-current={active ? "page" : undefined}
                aria-label={o.kind ? `Show ${o.label.toLowerCase()} only` : "Show all posts"}
                scroll={false}
                className={cn(
                  "relative isolate inline-flex h-11 items-center rounded-full px-5 text-sm font-medium whitespace-nowrap transition-colors duration-300",
                  FOCUS_RING_OFFSET,
                  active ? "text-brand-background" : "text-brand-primary hover:bg-brand-sunken",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="spotlight-filter-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    className="absolute inset-0 -z-10 rounded-full bg-brand-primary"
                  />
                )}
                {o.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
