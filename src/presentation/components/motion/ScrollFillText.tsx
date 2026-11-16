"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";

export type FillSegment = { text: string; className?: string } | { node: ReactNode };

type Piece = { key: string; content: ReactNode; className?: string };

function toPieces(segments: FillSegment[]): Piece[] {
  return segments.flatMap((segment, s) =>
    "node" in segment
      ? [{ key: `n${s}`, content: segment.node }]
      : segment.text
          .split(/\s+/)
          .filter(Boolean)
          .map((word, w) => ({ key: `w${s}-${w}`, content: word, className: segment.className })),
  );
}

function FillWord({ progress, range, children, className }: {
  progress: MotionValue<number>;
  range: [number, number];
  children: ReactNode;
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <motion.span style={{ opacity }} className={className}>
      {children}
    </motion.span>
  );
}

/** Words light up one by one as the block scrolls through the viewport. */
export function ScrollFillText({ segments, className }: { segments: FillSegment[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const pieces = toPieces(segments);

  return (
    <p ref={ref} className={className}>
      {pieces.map((piece, i) => (
        <span key={piece.key}>
          {reduce ? (
            <span className={piece.className}>{piece.content}</span>
          ) : (
            <FillWord progress={scrollYProgress} range={[i / pieces.length, (i + 1) / pieces.length]} className={piece.className}>
              {piece.content}
            </FillWord>
          )}{" "}
        </span>
      ))}
    </p>
  );
}
