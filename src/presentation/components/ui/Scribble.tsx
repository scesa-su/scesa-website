import { cn } from "@/lib/cn";

export function ScribbleUnderline({ delay = 0, strokeWidth = 2.5, className }: {
  delay?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 8"
      preserveAspectRatio="none"
      className={cn("absolute left-0 w-full overflow-visible motion-safe:animate-wipe", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <path
        d="M2 5 C 22 1.5, 38 7.5, 60 4 S 98 1.5, 118 5"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
