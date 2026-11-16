import { cn } from "@/lib/cn";
import { EYEBROW } from "@/lib/styles";

export function SectionLabel({ index, children, id, className }: {
  index: number;
  children: string;
  id?: string;
  className?: string;
}) {
  return (
    <p id={id} className={cn(EYEBROW, "flex items-center gap-3", className)}>
      <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}
