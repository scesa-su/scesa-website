import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Leader } from "@/domain/entities/Leader";
import { BODY, CONTAINER, H2 } from "./styles";

// Fixed tilts so the wall looks pinned by hand; motion-safe drops them under prefers-reduced-motion.
const TILTS = ["motion-safe:-rotate-2", "motion-safe:rotate-1", "motion-safe:-rotate-1", "motion-safe:rotate-2"];

export function BoardWall({ leaders }: { leaders: Leader[] }) {
  return (
    <section aria-labelledby="board" className="bg-navy-25 py-16 lg:py-24">
      <div className={CONTAINER}>
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="board" className={H2}>
            Meet the board
          </h2>
          <p className={`mt-4 ${BODY}`}>The seven students running SCESA for 2026/27.</p>
        </div>
        <ul className="mt-14 flex flex-wrap justify-center gap-x-5 gap-y-10 sm:gap-x-10 lg:gap-x-12">
          {leaders.map((leader, i) => (
            <li key={leader.name} className="w-[calc(50%-0.625rem)] max-w-56 sm:w-48 lg:w-56">
              <figure
                className={cn(
                  "relative bg-white p-2 pb-0 shadow-xl ring-1 ring-slate-900/5 sm:p-3 sm:pb-0 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:rotate-0",
                  TILTS[i % TILTS.length],
                )}
              >
                <span aria-hidden className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-brand-accent shadow" />
                <div className="relative aspect-4/5 overflow-hidden bg-slate-100">
                  <Image
                    src={leader.photo}
                    alt={`Portrait of ${leader.name}, ${leader.role}`}
                    fill
                    sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 45vw"
                    className="object-contain object-bottom"
                  />
                </div>
                <figcaption className="px-1 pt-2 pb-3 font-hand leading-tight text-slate-800">
                  <span className="block text-lg font-semibold sm:text-xl">{leader.name}</span>
                  <span className="block text-md text-slate-600 sm:text-lg">{leader.role}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
