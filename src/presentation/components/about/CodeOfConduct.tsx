import { CheckIcon } from "lucide-react";
import { BODY, H2, SECTION } from "@/lib/styles";
import { Reveal } from "@/presentation/components/motion/Reveal";
import { SectionLabel } from "@/presentation/components/ui/SectionLabel";

// Portfolio p. 5, "Behavior" and "Professionalism".
const CONDUCT = [
  "Treat every member, guest and partner with respect, in person and online.",
  "Act with integrity: be honest about your work and give credit where it is due.",
  "Collaborate openly, share what you know and help newer members find their feet.",
  "Be professional: communicate clearly, keep your commitments and bring a positive attitude.",
  "Remember that how you behave at SCESA events reflects on the whole association.",
];

export function CodeOfConduct() {
  return (
    <section aria-labelledby="conduct" className={SECTION}>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionLabel index={6}>How we work</SectionLabel>
          <h2 id="conduct" className={`mt-6 ${H2}`}>
            Code of conduct
          </h2>
          <p className={`mt-4 ${BODY}`}>What we expect from every member, at events and online.</p>
        </div>
        <ol className="border-b border-brand-border lg:col-span-8">
          {CONDUCT.map((c, i) => (
            <li key={c} className="border-t border-brand-border">
              <Reveal y={16} delay={i * 0.05} className={`flex gap-5 py-5 ${BODY}`}>
                <span aria-hidden className="w-6 shrink-0 pt-0.5 text-sm font-semibold text-brand-muted tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{c}</span>
                <CheckIcon aria-hidden className="mt-1 size-5 shrink-0 text-brand-accent" />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
