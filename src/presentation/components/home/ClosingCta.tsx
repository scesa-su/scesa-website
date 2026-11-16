"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MEMBERSHIP_FEE_KES } from "@/lib/constants";
import { CONTAINER } from "@/lib/styles";
import { Magnetic } from "@/presentation/components/motion/Magnetic";
import { Button } from "@/presentation/components/ui/Button";
import { useMediaQuery, usePrefersReducedMotion } from "@/presentation/hooks/useMediaQuery";

export function ClosingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const clipPath = useTransform(scrollYProgress, (p) => {
    if (reduce) return "inset(0% 0% 0% 0% round 0px)";
    const left = 1 - p;
    const side = (wide ? 14 : 4) * left;
    return `inset(${6 * left}% ${side}% ${6 * left}% ${side}% round ${48 * left}px)`;
  });
  const imageScale = useTransform(scrollYProgress, (p) => (reduce ? 1 : 1.15 - 0.15 * p));

  return (
    <section ref={ref} aria-labelledby="closing-title">
      <motion.div style={{ clipPath }} className="relative isolate min-h-[34rem] overflow-hidden md:h-[85svh]">
        <motion.div style={{ scale: imageScale }} className="absolute inset-0 -z-10">
          <Image
            src="/images/about/board-group-2026.jpeg"
            alt="SCESA members and guests on the steps outside a Strathmore University building"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-brand-navy via-brand-navy/70 to-brand-navy/10 dark:from-slate-900 dark:via-slate-900/70 dark:to-slate-900/10" />
        <div className={`${CONTAINER} flex h-full min-h-[34rem] flex-col justify-end py-12 md:h-[85svh] lg:py-20`}>
          <h2 id="closing-title" className="font-display text-display-hero font-semibold text-white">
            Find Your Tribe
          </h2>
          <p className="mt-6 max-w-xl text-lg text-slate-200 lg:text-xl">
            Pick the communities you care about, pay the one-time KES {MEMBERSHIP_FEE_KES} fee with M-Pesa and
            you&apos;re in.
          </p>
          <div className="mt-10">
            <Magnetic>
              <Button href="/join" size="xl" className="focus-visible:ring-offset-brand-navy">
                Join SCESA
              </Button>
            </Magnetic>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
