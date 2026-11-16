import { COMMUNITIES } from "@/lib/constants";
import { Marquee } from "@/presentation/components/motion/Marquee";

export function MarqueeBand() {
  return (
    <section aria-label="Communities under SCESA" className="relative z-10 overflow-x-clip py-6">
      <div className="-ml-[5%] w-[110%] -rotate-[1.5deg] bg-brand-navy py-5 text-white shadow-xl dark:bg-slate-900 lg:py-7">
        <Marquee skew baseVelocity={-1} repeat={2}>
          <ul className="flex shrink-0 items-center">
            {COMMUNITIES.map((name) => (
              <li
                key={name}
                className="flex items-center gap-8 pr-8 font-display text-display-xs font-semibold whitespace-nowrap lg:gap-12 lg:pr-12 lg:text-display-sm"
              >
                {name}
                <span aria-hidden className="text-brand-accent">
                  ✳
                </span>
              </li>
            ))}
          </ul>
        </Marquee>
      </div>
    </section>
  );
}
