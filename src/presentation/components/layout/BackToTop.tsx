"use client";

import { ArrowUpIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "@/lib/styles";

/** Scrolls to the top and moves focus to the main content, so keyboard users land there too. */
export function BackToTop({ className }: { className?: string }) {
  function onClick() {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    document.getElementById("content")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("group inline-flex items-center gap-2 rounded-lg transition-colors duration-200", FOCUS_RING, className)}
    >
      Back to top
      <ArrowUpIcon aria-hidden className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5" />
    </button>
  );
}
