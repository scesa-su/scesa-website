"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState, type FocusEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DURATION, EASE_OUT_EXPO } from "@/presentation/components/motion/tokens";

const CONDENSE_AT = 24;
const HIDE_AFTER = 160;

/**
 * Fixed header that condenses once the page scrolls, slides away while scrolling down and
 * returns on the way up. It stays put while it holds keyboard focus.
 */
export function NavShell({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [focused, setFocused] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const previous = scrollY.getPrevious() ?? 0;
    setCondensed(y > CONDENSE_AT);
    if (Math.abs(y - previous) > 4) setHidden(y > previous && y > HIDE_AFTER);
  });

  function onBlur(e: FocusEvent<HTMLElement>) {
    if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
  }

  return (
    <>
      <div aria-hidden className="h-20 lg:h-24" />
      <motion.header
        data-condensed={condensed || undefined}
        onFocus={() => setFocused(true)}
        onBlur={onBlur}
        initial={false}
        animate={{ y: hidden && !focused ? "-100%" : "0%" }}
        transition={{ duration: DURATION.base, ease: EASE_OUT_EXPO }}
        className={cn(
          "site-header group/nav fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-500",
          condensed ? "border-brand-border bg-brand-surface/80 backdrop-blur-md" : "border-transparent bg-transparent",
        )}
      >
        {children}
      </motion.header>
    </>
  );
}
