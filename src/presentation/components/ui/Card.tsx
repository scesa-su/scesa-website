import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-brand-border bg-brand-surface",
        className,
      )}
      {...props}
    />
  );
}
