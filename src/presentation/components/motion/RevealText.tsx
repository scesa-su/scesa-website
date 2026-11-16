import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type RevealTextProps = {
  lines: ReactNode[];
  /** Milliseconds before the first line starts. */
  delay?: number;
  /** Milliseconds between lines. */
  stagger?: number;
  lineClassName?: string;
};

/**
 * Each line slides up out of its own mask. Pure CSS, so it plays before hydration and
 * never holds back the largest paint. Reduced motion shows the lines in place.
 */
export function RevealText({ lines, delay = 0, stagger = 80, lineClassName }: RevealTextProps) {
  return lines.map((line, i) => (
    <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
      <span
        className={cn("block motion-safe:animate-reveal-up", lineClassName)}
        style={{ animationDelay: `${delay + i * stagger}ms` }}
      >
        {line}
      </span>
    </span>
  ));
}
