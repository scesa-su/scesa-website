"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";
import { EASE_OUT_EXPO } from "./tokens";

/**
 * Counts up to a value like "250+" when it scrolls into view. The server HTML already holds
 * the final value, and screen readers only ever get that.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = usePrefersReducedMotion();
  const [, digits, suffix = ""] = /^(\d+)(.*)$/.exec(value) ?? [];
  const target = digits ? Number(digits) : null;

  useEffect(() => {
    const node = ref.current;
    if (target === null || !inView || reduce || !node) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => (node.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [target, suffix, inView, reduce]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
