"use client";

import { motion, useSpring } from "framer-motion";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useFinePointer, usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";
import { SPRING_SOFT } from "./tokens";

/** Pulls its child toward the pointer while hovered. Mouse and trackpad only. */
export function Magnetic({ children, strength = 0.3, className }: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const x = useSpring(0, SPRING_SOFT);
  const y = useSpring(0, SPRING_SOFT);

  function onPointerMove(e: PointerEvent) {
    if (!fine || reduce || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    x.set((e.clientX - (box.left + box.width / 2)) * strength);
    y.set((e.clientY - (box.top + box.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
