"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";

/** Oversized SCESA that rises out of the footer's bottom edge as the page reaches the end. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, (p) => (reduce ? "0%" : `${(1 - p) * 45}%`));

  return (
    <div ref={ref} aria-hidden className="overflow-hidden">
      <motion.p
        style={{ y }}
        className="-mb-[0.13em] text-center font-display text-[35vw] leading-none font-bold tracking-[-0.06em] text-white/10 select-none"
      >
        SCESA
      </motion.p>
    </div>
  );
}
