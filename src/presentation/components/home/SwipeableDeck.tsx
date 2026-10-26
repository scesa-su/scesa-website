"use client";

import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { HERO_PHOTOS } from "@/lib/constants";
import { wrapIndex } from "@/lib/wrap";

const ROTATIONS = [0, -4, 6, -8, 3];
const FLICK_DISTANCE = 100;
const FLICK_VELOCITY = 500;
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background";
const NAV_BUTTON = `inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-primary transition-colors hover:bg-navy-25 ${FOCUS_RING}`;

export function SwipeableDeck() {
  const [top, setTop] = useState(0);
  const reduceMotion = useReducedMotion();
  const n = HERO_PHOTOS.length;
  const next = () => setTop((t) => wrapIndex(t + 1, n));
  const prev = () => setTop((t) => wrapIndex(t - 1, n));

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > FLICK_DISTANCE || Math.abs(info.velocity.x) > FLICK_VELOCITY) next();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else return;
    e.preventDefault();
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="SCESA event photos. Use the left and right arrow keys to change photo."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`relative aspect-3/4 w-full max-w-110 rounded-2xl ${FOCUS_RING}`}
      >
        {HERO_PHOTOS.map((photo, i) => {
          const pos = wrapIndex(i - top, n);
          const isTop = pos === 0;
          return (
            <motion.div
              key={photo.src}
              aria-hidden={!isTop}
              drag={isTop ? "x" : false}
              dragSnapToOrigin
              onDragEnd={isTop ? onDragEnd : undefined}
              animate={{ rotate: ROTATIONS[pos], scale: 1 - pos * 0.02 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 26 }}
              style={{ zIndex: n - pos }}
              className={`absolute inset-0 overflow-hidden rounded-2xl border border-brand-border bg-brand-surface shadow-lg ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                priority={i === 0}
                draggable={false}
                sizes="(min-width: 1024px) 440px, 90vw"
                className="pointer-events-none object-cover select-none"
              />
            </motion.div>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Photo {top + 1} of {n}: {HERO_PHOTOS[top].alt}
      </p>
      <div className="flex items-center gap-4">
        <button type="button" onClick={prev} aria-label="Previous photo" className={NAV_BUTTON}>
          <ChevronLeftIcon aria-hidden className="size-5" />
        </button>
        <p className="text-xs text-slate-600 dark:text-slate-300">Swipe top photo left or right</p>
        <button type="button" onClick={next} aria-label="Next photo" className={NAV_BUTTON}>
          <ChevronRightIcon aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
