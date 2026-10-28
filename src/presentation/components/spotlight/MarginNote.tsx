import type { SpotlightPost } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { KIND_LABEL, UNDERLINE, noteFor } from "./kinds";

type MarginNoteProps = {
  post: Pick<SpotlightPost, "kind" | "member">;
  /** Position in the feed, used to stagger the underline drawing in. */
  index?: number;
  className?: string;
};

/** Handwritten note naming a post's kind, with a hand-drawn underline in the kind's colour. */
export function MarginNote({ post, index = 0, className }: MarginNoteProps) {
  return (
    <p className={cn("-rotate-2 font-marker text-lg leading-snug text-slate-700 dark:text-slate-200", className)}>
      <span className="sr-only">{KIND_LABEL[post.kind]}: </span>
      <span className="relative inline-block pb-1.5">
        {noteFor(post)}
        <svg
          aria-hidden="true"
          viewBox="0 0 120 8"
          preserveAspectRatio="none"
          className={cn("absolute -bottom-0.5 left-0 h-2 w-full overflow-visible", UNDERLINE[post.kind])}
        >
          <path
            d="M2 5 C 22 1.5, 38 7.5, 60 4 S 98 1.5, 118 5"
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            className="[stroke-dasharray:1] motion-safe:animate-draw"
            style={{ animationDelay: `${200 + Math.min(index, 6) * 90}ms` }}
          />
        </svg>
      </span>
    </p>
  );
}
