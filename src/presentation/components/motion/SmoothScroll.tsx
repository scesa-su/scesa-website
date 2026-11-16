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
    return () => lenis.destroy();
  }, [reduce]);

  return null;
}
