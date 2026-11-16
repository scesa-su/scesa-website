"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE_OUT_EXPO } from "./tokens";

type RevealProps = {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  y?: number;
  className?: string;
};

/** Rises and fades in once when scrolled into view. Under reduced motion only the fade remains. */
export function Reveal({ children, delay = 0, y = 32, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DURATION.slow, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </motion.div>
  );
}
