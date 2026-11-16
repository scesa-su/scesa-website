"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";

/** Inertial wheel scrolling. Touch scrolling stays native; anything marked data-lenis-prevent scrolls on its own. */
export function SmoothScroll() {
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.1 });

    // A glide still running when the route changes would carry on to its old target on the new page.
    const halt = () => {
      lenis.stop();
      lenis.start();
    };
    const onClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("a[href]")) halt();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", halt);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", halt);
      lenis.destroy();
    };
  }, [reduce]);

  return null;
}
