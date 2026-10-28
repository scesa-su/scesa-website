"use client";



import Image from "next/image";

import {

  animate,

  motion,

  useAnimate,

  useDragControls,

  useMotionValue,

  useReducedMotion,

  useSpring,

  useTransform,

  useVelocity,

} from "framer-motion";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";

import type { Leader } from "@/domain/entities/Leader";

import { Button } from "@/presentation/components/ui/Button";

import { PIN_COLOR_CYCLE, PushPin, PushPinDefs, PushPinShadow, type PinColor } from "./PushPin";



// Fixed tilts (within ±2°) so the wall looks pinned by hand; dropped under prefers-reduced-motion.

const TILTS = [-2, 1.5, -1, 2, -1.5, 0.5, 1.25];

const LIFT = { type: "spring", stiffness: 300, damping: 24 } as const;

const NUDGE = 24;

const SETTLE = { type: "spring", stiffness: 260, damping: 26 } as const;

const SWAY = { stiffness: 300, damping: 30 };

// Drag speed (px/s) mapped to how far the photo leans back in 3D, like a card lifted by its pin.

const LEAN_SPEED = [-1500, 1500];

const LEAN_DEG = [-20, 20];

// The pin pops out when a photo is picked up and drops back in when it is let go.

const PIN = {

  pinned: { y: 0, scale: 1, opacity: 1, rotate: 0 },

  lifted: { y: -28, scale: 1.3, opacity: 0, rotate: -20 },

};

const PIN_SHADOW = {

  pinned: { x: 0, y: 0, scale: 1, opacity: 1 },

  lifted: { x: 8, y: 10, scale: 1.6, opacity: 0 },

};

const PULL = { duration: 0.18, ease: "easeOut" } as const;

const DROP = { type: "spring", stiffness: 650, damping: 17, opacity: { duration: 0.08 } } as const;

// Roughly when the dropping pin first reaches the photo.

const IMPACT = 0.1;

const KEY_SETTLE_MS = 450;

const ARROWS: Record<string, [number, number]> = {

  ArrowLeft: [-1, 0],

  ArrowRight: [1, 0],

  ArrowUp: [0, -1],

  ArrowDown: [0, 1],

};



export function PolaroidBoard({ leaders }: { leaders: Leader[] }) {

  const boardRef = useRef<HTMLUListElement>(null);

  const topZ = useRef(1);

  const [moved, setMoved] = useState(false);

  const [resets, setResets] = useState(0);



  function lift() {

    setMoved(true);

    return ++topZ.current;

  }



  return (

    <>

      <PushPinDefs />

      <p id="board-hint" className="mt-3 text-center text-sm text-slate-600 dark:text-slate-300">

        Drag the photos to rearrange the board. On a touchscreen, drag by the pin. With a keyboard, use the arrow keys

        on a pin.

      </p>

      <ul

        ref={boardRef}

        className="mt-14 flex flex-wrap justify-center gap-x-5 gap-y-10 sm:gap-x-10 lg:gap-x-12"

      >

        {leaders.map((leader, i) => (

          <Polaroid

            key={leader.name}

            leader={leader}

            tilt={TILTS[i % TILTS.length]}

            pinColor={PIN_COLOR_CYCLE[i % PIN_COLOR_CYCLE.length]}

            boardRef={boardRef}

            onLift={lift}

            resets={resets}

          />

        ))}

      </ul>

      <div className="mt-10 flex justify-center">

        {moved && (

          <Button

            variant="outline"

            onClick={() => {

              setResets((r) => r + 1);

              setMoved(false);

            }}

            aria-label="Put the board photos back in their places"

          >

            Put the photos back

          </Button>

        )}

      </div>

    </>

  );

}



function Polaroid({

  leader,

  tilt,

  pinColor,

  boardRef,

  onLift,

  resets,

}: {

  leader: Leader;

  tilt: number;

  pinColor: PinColor;

  boardRef: RefObject<HTMLUListElement | null>;

  onLift: () => number;

  resets: number;

}) {

  const ref = useRef<HTMLLIElement>(null);

  const x = useMotionValue(0);

  const y = useMotionValue(0);

  const controls = useDragControls();

  const reduceMotion = useReducedMotion();

  const [z, setZ] = useState(0);

  const [lifted, setLifted] = useState(false);

  const [drops, setDrops] = useState(0);

  const [figure, animateFigure] = useAnimate<HTMLElement>();

  const keyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const rotateY = useSpring(useTransform(useVelocity(x), LEAN_SPEED, LEAN_DEG), SWAY);

  const rotateX = useSpring(useTransform(useVelocity(y), LEAN_SPEED, [20, -20]), SWAY);



  useEffect(() => {

    if (resets === 0) return;

    const t = reduceMotion ? { duration: 0 } : SETTLE;

    animate(x, 0, t);

    animate(y, 0, t);

  }, [resets, reduceMotion, x, y]);



  useEffect(() => () => clearTimeout(keyTimer.current), []);



  function pickUp() {

    setZ(onLift());

    setLifted(true);

  }



  function pinDown() {

    setLifted(false);

    if (reduceMotion) return;

    setDrops((d) => d + 1);

    animateFigure(figure.current, { scale: [1, 0.97, 1] }, { delay: IMPACT, duration: 0.3, ease: "easeOut" });

  }



  // Mouse and pen drag the whole photo; touch only drags from the pin so the page still scrolls.

  function startDrag(e: PointerEvent, fromPin: boolean) {

    if ((e.pointerType === "touch") === fromPin) controls.start(e);

  }



  function nudge(e: KeyboardEvent) {

    const dir = ARROWS[e.key];

    const card = ref.current?.getBoundingClientRect();

    const board = boardRef.current?.getBoundingClientRect();

    if (!dir || !card || !board) return;

    e.preventDefault();

    pickUp();

    clearTimeout(keyTimer.current);

    keyTimer.current = setTimeout(pinDown, KEY_SETTLE_MS);

    const dx = Math.max(board.left - card.left, Math.min(board.right - card.right, dir[0] * NUDGE));

    const dy = Math.max(board.top - card.top, Math.min(board.bottom - card.bottom, dir[1] * NUDGE));

    x.set(x.get() + dx);

    y.set(y.get() + dy);

  }



  return (

    <motion.li

      ref={ref}

      drag

      dragControls={controls}

      dragListener={false}

      dragConstraints={boardRef}

      dragElastic={0.1}

      dragMomentum={false}

      onPointerDown={(e) => startDrag(e, false)}

      onDragStart={pickUp}

      onDragEnd={pinDown}

      whileHover={{ scale: 1.03, rotate: 0, filter: "drop-shadow(0 16px 18px rgb(15 23 42 / 0.18))" }}

      whileDrag={{ scale: 1.06, rotate: 0, filter: "drop-shadow(0 28px 24px rgb(15 23 42 / 0.3))" }}

      transition={LIFT}

      style={{

        x,

        y,

        zIndex: z,

        rotate: reduceMotion ? 0 : tilt,

        rotateX: reduceMotion ? 0 : rotateX,

        rotateY: reduceMotion ? 0 : rotateY,

        transformPerspective: 800,

        touchAction: "pan-y",

      }}

      className="relative w-[calc(50%-0.625rem)] max-w-56 cursor-grab select-none active:cursor-grabbing sm:w-48 lg:w-56"

    >

      <figure ref={figure} className="relative bg-white p-2 pt-5 pb-0 shadow-xl ring-1 ring-slate-900/5 sm:p-3 sm:pt-6 sm:pb-0">

        <button

          type="button"

          aria-label={`Move ${leader.name}'s photo`}

          aria-describedby="board-hint"

          onPointerDown={(e) => startDrag(e, true)}

          onKeyDown={nudge}

          className="absolute -top-3 left-1/2 z-10 grid size-11 -translate-x-1/2 touch-none place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"

        >

          <motion.span

            aria-hidden

            initial={false}

            animate={lifted ? "lifted" : "pinned"}

            variants={PIN_SHADOW}

            transition={reduceMotion ? { duration: 0 } : lifted ? PULL : DROP}

            className="absolute inset-0 grid place-items-center"

          >

            <PushPinShadow className="size-9 translate-x-0.5 translate-y-1" />

          </motion.span>

          {drops > 0 && (

            <motion.span

              key={drops}

              aria-hidden

              initial={{ scale: 0.3, opacity: 0 }}

              animate={{ scale: [0.3, 1.6], opacity: [0, 0.5, 0] }}

              transition={{ delay: IMPACT, duration: 0.45, ease: "easeOut" }}

              className="absolute inset-0 m-auto size-8 translate-y-1.5 rounded-full border-2 border-slate-400"

            />

          )}

          <motion.span

            aria-hidden

            initial={false}

            animate={lifted ? "lifted" : "pinned"}

            variants={PIN}

            transition={reduceMotion ? { duration: 0 } : lifted ? PULL : DROP}

            className="relative grid place-items-center"

          >

            <PushPin color={pinColor} className="size-9 translate-x-0.5 translate-y-1" />

          </motion.span>

        </button>

        <div className="relative aspect-4/5 overflow-hidden bg-slate-100">

          <Image

            src={leader.photo}

            alt={`Portrait of ${leader.name}, ${leader.role}`}

            fill

            loading="eager"

            draggable={false}

            sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 45vw"

            className="pointer-events-none object-contain object-bottom"

          />

        </div>

        <figcaption className="-rotate-1 px-1 pt-2 pb-3 font-marker leading-tight text-slate-800">

          <span className="block text-md font-bold sm:text-lg">{leader.name}</span>

          <span className="block text-sm text-slate-600 sm:text-md">{leader.role}</span>

        </figcaption>

      </figure>

    </motion.li>

  );

}

