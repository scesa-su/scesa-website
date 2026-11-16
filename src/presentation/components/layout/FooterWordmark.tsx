"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";

export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, (p) => (reduce ? "0%" : `${(1 - p) * 45}%`));

  return (
    <div ref={ref} aria-hidden className="overflow-hidden px-2">
      <motion.svg style={{ y }} viewBox="0 0 1000 232" className="block w-full font-display select-none">
        <text
          x="0"
          y="226"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fontSize="320"
          fontWeight="700"
          className="fill-white/10"
        >
          SCESA
        </text>
      </motion.svg>
    </div>
  );
}
