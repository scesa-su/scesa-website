import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING_OFFSET } from "@/lib/styles";

export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg font-semibold text-brand-primary transition-colors duration-200 hover:text-orange-700 dark:hover:text-brand-accent",
        FOCUS_RING_OFFSET,
        className,
      )}
    >
      {children}
      <ArrowRightIcon aria-hidden className="size-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
    </Link>
  );
}
