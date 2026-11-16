import { HOME_STATS } from "@/lib/constants";
import { BODY, H2, SECTION } from "@/lib/styles";
import { CountUp } from "@/presentation/components/motion/CountUp";
import { RuledItem } from "@/presentation/components/motion/RuledItem";
import { SectionLabel } from "@/presentation/components/ui/SectionLabel";

export function StatsSection() {
  return (
    <section aria-labelledby="why-join" className={SECTION}>
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <SectionLabel index={2}>Why join</SectionLabel>
            <h2 id="why-join" className={`mt-6 ${H2}`}>
              Why Join?
            </h2>
            <p className={`mt-4 max-w-sm ${BODY}`}>More than a decade of students building, competing and growing together.</p>
          </div>
        </div>
        <ul className="border-b border-brand-border lg:col-span-8">
          {HOME_STATS.map((stat) => (
            <RuledItem
              key={stat.label}
              className="grid gap-4 py-8 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end sm:gap-8 lg:py-12"
            >
              <CountUp
                value={stat.value}
                className="inline-block min-w-[2.3em] font-display text-display-numeral font-semibold text-brand-primary"
              />
              <div className="sm:pb-3">
                <p className="text-xl font-semibold text-brand-primary">{stat.label}</p>
                <p className="mt-2 text-md text-brand-muted">{stat.detail}</p>
              </div>
            </RuledItem>
          ))}
        </ul>
      </div>
    </section>
  );
}
