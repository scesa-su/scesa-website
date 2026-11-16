"use client";

import Image from "next/image";
import { motion, useReducedMotion, useSpring, type PanInfo } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { HERO_PHOTOS } from "@/lib/constants";
import { FOCUS_RING_OFFSET } from "@/lib/styles";
import { wrapIndex } from "@/lib/wrap";
import { PushPin, PushPinDefs, PushPinShadow } from "@/presentation/components/about/PushPin";
import { useFinePointer } from "@/presentation/hooks/useMediaQuery";

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
const SPREAD_START = 0.5;
const SPREAD_STAGGER = 0.09;
const SPREAD_MS = 1500;
const MAX_TILT = 8;
const TILT_SPRING = { stiffness: 150, damping: 20 } as const;
const NAV_BUTTON = `inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-primary transition-colors hover:bg-navy-25 ${FOCUS_RING_OFFSET}`;

export function SwipeableDeck() {
  const [top, setTop] = useState(0);
  // Direction the top photo is being thrown; it moves to the back once the throw ends.
  const [thrown, setThrown] = useState<-1 | 1 | null>(null);
  const [spread, setSpread] = useState(false);
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const tiltRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, TILT_SPRING);
  const rotateY = useSpring(0, TILT_SPRING);
  const n = HERO_PHOTOS.length;

  useEffect(() => {
    const timer = setTimeout(() => setSpread(true), SPREAD_MS);
    return () => clearTimeout(timer);
  }, []);

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

  function tilt(e: PointerEvent) {
    if (!finePointer || reduceMotion || !tiltRef.current) return;
    const box = tiltRef.current.getBoundingClientRect();
    rotateY.set(((e.clientX - box.left) / box.width - 0.5) * 2 * MAX_TILT);
    rotateX.set(-((e.clientY - box.top) / box.height - 0.5) * 2 * MAX_TILT);
  }
  function untilt() {
    rotateX.set(0);
    rotateY.set(0);
  }

  const current = HERO_PHOTOS[top];

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      <PushPinDefs />
      <motion.div
        ref={tiltRef}
        onPointerMove={tilt}
        onPointerLeave={untilt}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="grid w-full max-w-110 place-items-center lg:max-w-130"
      >
        <div
          role="group"
          aria-roledescription="carousel"
          aria-label="SCESA event photos. Use the left and right arrow keys to change photo."
          tabIndex={0}
          onKeyDown={onKeyDown}
          className={`grid w-full place-items-center rounded-sm ${FOCUS_RING_OFFSET}`}
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
                initial={{ x: 0, y: 0, rotate: SCATTER[0].rotate, scale: isTop ? 1.04 : 1 - pos * 0.02 }}
                animate={
                  isThrown
                    ? { x: thrown * THROW_DISTANCE, y: -30, rotate: thrown * 18, scale: 1 }
                    : { ...SCATTER[pos % SCATTER.length], scale: 1 - pos * 0.02 }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : isThrown
                      ? THROW
                      : spread
                        ? SETTLE
                        : { ...SETTLE, delay: SPREAD_START + (n - 1 - pos) * SPREAD_STAGGER }
                }
                onAnimationComplete={isThrown ? settle : undefined}
                // Equal-area sizing: landscape photos get wider frames, portrait ones narrower.
                style={{ zIndex: n - pos, width: `${Math.min(100, 84 * Math.sqrt(photo.width / photo.height))}%` }}
                className={`relative col-start-1 row-start-1 bg-white p-3 pb-0 shadow-xl ring-1 ring-slate-900/5 ${isTop ? "cursor-grab active:cursor-grabbing" : ""}`}
              >
                {isTop && (
                  <>
                    <PushPinShadow className="pointer-events-none absolute -top-4 left-1/2 z-10 size-10 -translate-x-1/2" />
                    <PushPin color="red" className="pointer-events-none absolute -top-4 left-1/2 z-10 size-10 -translate-x-1/2" />
                  </>
                )}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  loading="eager"
                  height={photo.height}
                  priority={i === 0}
                  draggable={false}
                  sizes="(min-width: 1024px) 520px, 90vw"
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
      </motion.div>

      <SwipeNote />

      <p aria-live="polite" className="sr-only">
        Photo {top + 1} of {n}: {current.caption}
        {current.date && `, ${current.date}`}
      </p>
      <div className="flex items-center gap-4">
        <button type="button" onClick={prev} aria-label="Previous photo" className={NAV_BUTTON}>
          <ChevronLeftIcon aria-hidden className="size-5" />
        </button>
        <p className="text-xs text-brand-muted">Swipe top photo left or right</p>
        <button type="button" onClick={() => next()} aria-label="Next photo" className={NAV_BUTTON}>
          <ChevronRightIcon aria-hidden className="size-5" />
        </button>
      </div>
    </div>
  );
}

function SwipeNote() {
  return (
    <div aria-hidden className="pointer-events-none absolute bottom-24 -left-14 hidden -rotate-6 xl:block">
      <p className="font-marker text-xl text-brand-muted">swipe me!</p>
      <svg viewBox="0 0 60 50" fill="none" className="ml-10 h-12 w-14 overflow-visible text-brand-accent">
        {[
          { d: "M4 46 C 14 40, 34 34, 50 8", delay: 1600 },
          { d: "M40 12 L50 8 L52 19", delay: 2000 },
        ].map(({ d, delay }) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="[stroke-dasharray:1] motion-safe:animate-draw"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </svg>
    </div>
  );
}
