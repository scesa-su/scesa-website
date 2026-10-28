"use client";

import Image from "next/image";
import { motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { HERO_PHOTOS } from "@/lib/constants";
import { wrapIndex } from "@/lib/wrap";

// Loose pile offsets by stack position, so the photos look hand-held rather than aligned.
const SCATTER = [
  { x: 0, y: 0, rotate: -2 },
  { x: 18, y: -10, rotate: 6 },
  { x: -20, y: 8, rotate: -8 },
  { x: 12, y: 14, rotate: 10 },
  { x: -10, y: -14, rotate: -5 },
];
const FLICK_DISTANCE = 100;
const FLICK_VELOCITY = 500;
const THROW_DISTANCE = 520;
const THROW = { duration: 0.28, ease: "easeIn" } as const;
const SETTLE = { type: "spring", stiffness: 260, damping: 26 } as const;
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-background";
const NAV_BUTTON = `inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-primary transition-colors hover:bg-navy-25 ${FOCUS_RING}`;

export function SwipeableDeck() {
  const [top, setTop] = useState(0);
  // Direction the top photo is being thrown; it moves to the back once the throw ends.
  const [thrown, setThrown] = useState<-1 | 1 | null>(null);
  const reduceMotion = useReducedMotion();
  const n = HERO_PHOTOS.length;

  function next(dir: -1 | 1 = 1) {
    if (thrown) return;
    if (reduceMotion) setTop((t) => wrapIndex(t + 1, n));
    else setThrown(dir);
  }
  function prev() {
    if (!thrown) setTop((t) => wrapIndex(t - 1, n));
  }
  function settle() {
    setTop((t) => wrapIndex(t + 1, n));
    setThrown(null);
  }

  function onDragEnd(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > FLICK_DISTANCE || Math.abs(info.velocity.x) > FLICK_VELOCITY) {
      next(info.offset.x < 0 ? -1 : 1);
    }
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
    else return;
    e.preventDefault();
  }

  const current = HERO_PHOTOS[top];

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="SCESA event photos. Use the left and right arrow keys to change photo."
        tabIndex={0}
        onKeyDown={onKeyDown}
        className={`grid w-full max-w-110 place-items-center rounded-sm ${FOCUS_RING}`}
      >
        {HERO_PHOTOS.map((photo, i) => {
          const pos = wrapIndex(i - top, n);
          const isTop = pos === 0;
          const isThrown = isTop && thrown !== null;
          return (
            <motion.figure
              key={photo.src}
              aria-hidden={!isTop}
              drag={isTop && !thrown ? "x" : false}
              dragSnapToOrigin={!thrown}
              onDragEnd={isTop ? onDragEnd : undefined}
              animate={
                isThrown
                  ? { x: thrown * THROW_DISTANCE, y: -30, rotate: thrown * 18, scale: 1 }
                  : { ...SCATTER[pos % SCATTER.length], scale: 1 - pos * 0.02 }
              }
              transition={reduceMotion ? { duration: 0 } : isThrown ? THROW : SETTLE}
              onAnimationComplete={isThrown ? settle : undefined}
              // Equal-area sizing: landscape photos get wider frames, portrait ones narrower.
              style={{ zIndex: n - pos, width: `${Math.min(100, 84 * Math.sqrt(photo.width / photo.height))}%` }}
              className={`col-start-1 row-start-1 bg-white p-3 pb-0 shadow-xl ring-1 ring-slate-900/5 ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                loading="eager"
                height={photo.height}
                priority={i === 0}
                draggable={false}
                sizes="(min-width: 1024px) 440px, 90vw"
                className="pointer-events-none h-auto w-full select-none"
              />
              <figcaption className="flex -rotate-1 items-baseline justify-between gap-3 px-1 pt-2 pb-4 font-marker leading-tight text-slate-800">
                <span className="text-md font-bold sm:text-lg">{photo.caption}</span>
                {photo.date && <span className="shrink-0 text-sm text-slate-600 sm:text-md">{photo.date}</span>}
              </figcaption>
            </motion.figure>
          );
        })}
      </div>
      <p aria-live="polite" className="sr-only">
        Photo {top + 1} of {n}: {current.caption}
        {current.date && `, ${current.date}`}
      </p>
      <div className="flex items-center gap-4">
        <button type="button" onClick={prev} aria-label="Previous photo" className={NAV_BUTTON}>
          <ChevronLeftIcon aria-hidden className="size-5" />
        </button>
        <p className="text-xs text-slate-600 dark:text-slate-300">Swipe top photo left or right</p>
        <button type="button" onClick={() => next()} aria-label="Next photo" className={NAV_BUTTON}>
          <ChevronRightIcon aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}
