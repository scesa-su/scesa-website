import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { CONTAINER, EYEBROW } from "@/lib/styles";
import { RevealText } from "@/presentation/components/motion/RevealText";
import { ScribbleUnderline } from "@/presentation/components/ui/Scribble";

const LINE_STAGGER = 80;

type PageHeaderProps = {
  eyebrow: string;
  title: string[];
  underline?: boolean;
  intro?: ReactNode;
  aside?: ReactNode;
  className?: string;
};

export function PageHeader({ eyebrow, title, underline = false, intro, aside, className }: PageHeaderProps) {
  const settled = title.length * LINE_STAGGER + 500;
  const lines = title.map((line, i) =>
    underline && i === title.length - 1 ? (
      <span key={line} className="relative inline-block pb-[0.08em]">
        {line}
        <ScribbleUnderline delay={settled} strokeWidth={5} className="bottom-0 h-[0.14em] text-brand-accent" />
      </span>
    ) : (
      line
    ),
  );

  return (
    <header className={cn("relative overflow-x-clip", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint" />
      <div className={`${CONTAINER} relative grid gap-10 pt-10 pb-12 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pt-16 lg:pb-20`}>
        <div className="lg:col-span-8">
          <p className={cn(EYEBROW, "motion-safe:animate-fade-up")}>{eyebrow}</p>
          <h1 className="mt-6 font-display text-display-page font-semibold text-balance text-brand-primary">
            <RevealText lines={lines} stagger={LINE_STAGGER} />
          </h1>
          {intro && <div className="mt-6 max-w-2xl text-lg text-brand-muted lg:text-xl">{intro}</div>}
        </div>
        {aside && (
          <div
            className="motion-safe:animate-fade-up lg:col-span-4 lg:justify-self-end"
            style={{ animationDelay: `${settled - 200}ms` }}
          >
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}
