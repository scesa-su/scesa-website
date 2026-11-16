"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";

type MarqueeProps = {
  children: ReactNode;
  /** Percent of one copy's width per second; negative runs right to left. */
  baseVelocity?: number;
  /** Lean the track with scroll speed. */
  skew?: boolean;
  /** Repeats inside each copy so short content still fills wide screens. */
  repeat?: number;
  className?: string;
};

// Two identical halves; shifting by -50% lands exactly on the start again.
const wrapHalf = (v: number) => -((((-v % 50) + 50) % 50));

/** Endless horizontal strip that speeds up and leans with scroll velocity. Pauses on hover and focus. */
export function Marquee({ children, baseVelocity = -2, skew = false, repeat = 1, className }: MarqueeProps) {
  const reduce = usePrefersReducedMotion();
  const paused = useRef(false);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const smoothVelocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const speedUp = useTransform(smoothVelocity, [-1000, 0, 1000], [4, 0, 4], { clamp: false });
  const skewX = useTransform(smoothVelocity, [-2000, 2000], skew && !reduce ? [6, -6] : [0, 0]);
  const x = useTransform(baseX, (v) => `${wrapHalf(v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return;
    const step = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + step * (1 + speedUp.get()));
  });

  const copy = (duplicate: boolean) =>
    Array.from({ length: repeat }, (_, i) => (
      <div key={`${duplicate}-${i}`} inert={duplicate || i > 0} className="flex shrink-0">
        {children}
      </div>
    ));

  return (
    <div
      className={cn("overflow-hidden", className)}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <motion.div style={{ x, skewX }} className="flex w-max">
        {copy(false)}
        {copy(true)}
      </motion.div>
    </div>
  );
}
