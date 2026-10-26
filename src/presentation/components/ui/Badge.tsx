import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  live: "bg-success-dark text-white",
  scheduled: "bg-warning-dark text-white",
  completed: "bg-info-dark text-white",
  neutral: "bg-navy-25 text-brand-primary",
} as const;

type BadgeProps = ComponentProps<"span"> & { variant?: keyof typeof variants };

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
