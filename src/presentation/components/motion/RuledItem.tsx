"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_IN_OUT_QUART } from "./tokens";

export function RuledItem({ children, className, ruleClassName }: {
  children: ReactNode;
  className?: string;
  ruleClassName?: string;
}) {
  return (
    <motion.li
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      className={cn("relative", className)}
    >
      <motion.span
        aria-hidden
        variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
        transition={{ duration: DURATION.slow * 1.4, ease: EASE_IN_OUT_QUART }}
        className={cn("absolute inset-x-0 top-0 h-px origin-left bg-brand-border", ruleClassName)}
      />
      {children}
    </motion.li>
  );
}
