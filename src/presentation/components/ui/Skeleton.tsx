import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Grey placeholder block; pulses only when motion is allowed. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("rounded-md bg-slate-200 motion-safe:animate-pulse dark:bg-slate-700", className)} />;
}

/** Wraps a loading.tsx page so screen readers hear one "Loading" instead of empty blocks. */
export function LoadingPage({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <main aria-busy="true" className={className}>
      <span role="status" className="sr-only">
        Loading
      </span>
      {children}
    </main>
  );
}
