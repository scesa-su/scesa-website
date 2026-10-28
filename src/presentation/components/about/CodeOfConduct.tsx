import { CheckIcon } from "lucide-react";
import { BODY, H2, SECTION } from "./styles";

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
          <h2 id="conduct" className={H2}>
            Code of conduct
          </h2>
          <p className={`mt-4 ${BODY}`}>What we expect from every member, at events and online.</p>
        </div>
        <ul className="space-y-5 lg:col-span-8">
          {CONDUCT.map((c) => (
            <li key={c} className={`flex gap-4 ${BODY}`}>
              <CheckIcon aria-hidden className="mt-1 size-5 shrink-0 text-brand-accent" />
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
