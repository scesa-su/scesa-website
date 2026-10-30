import Image from "next/image";
import { TrophyIcon } from "lucide-react";
import type { ReactNode } from "react";
import { BODY, H2, SECTION, SMALL } from "./styles";

// Source: SCESA LinkedIn (Clubs & Sports Gala, 19 June 2026).
const AWARDS = [
  "Best Organised Event, for the AI Students Summit",
  "Most Rewarding Club",
  "Best Club Per Category (IT, Innovation and Research Clubs)",
  "Collaborations and Partnerships",
];

export function Timeline() {
  return (
    <section aria-labelledby="timeline" className={SECTION}>
      <h2 id="timeline" className={H2}>
        Our story so far
      </h2>
      <ol className="mt-12 max-w-4xl">
        {/* Source: owner (confirmed 2026-10-28). */}
        <Entry year="2014" title="SUITSA is born">
          SCESA starts life as SUITSA, the Strathmore University IT Students Association.
        </Entry>
        {/* Sources: owner; https://partners.strathmore.edu/about-us */}
        <Entry year="2020" title="SUITSA becomes SCESA">
          The Faculty of IT merges with the engineering school to form the School of Computing and Engineering Sciences.
          SUITSA becomes SCESA so it can represent students from both.
        </Entry>
        {/* Source: owner. */}
        <Entry year="2020–2025" title="Growing the club">
          New communities start under SCESA and our events grow bigger and better every year. More than 250 members
          have joined us along the way.
          <figure className="mt-5 max-w-60 sm:max-w-xs">
            <Image
              src="/images/home/team-building-2025.jpg"
              alt="SCESA members gathered in a circle outdoors under tall trees during team building"
              width={800}
              height={1067}
              sizes="(min-width: 640px) 320px, 240px"
              className="h-auto w-full rounded-2xl"
            />
            <figcaption className="mt-2 font-hand text-lg leading-tight text-slate-600 dark:text-slate-300">
              Team building, June 2025
            </figcaption>
          </figure>
        </Entry>
        {/* Source: SCESA LinkedIn. */}
        <Entry year="2026" title="Four awards for 2025/26">
          At the Strathmore Clubs &amp; Sports Gala we won four awards for the 2025/26 academic year.
          <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_12rem] lg:grid-cols-[1fr_14rem]">
            <ul className="grid content-start gap-3">
              {AWARDS.map((award) => (
                <li
                  key={award}
                  className={`flex items-start gap-3 rounded-2xl border border-brand-border bg-brand-surface p-4 ${SMALL}`}
                >
                  <TrophyIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-accent" />
                  <span className="font-medium text-brand-primary">{award}</span>
                </li>
              ))}
            </ul>
            <figure className="max-w-60 sm:max-w-none">
              <Image
                src="/images/home/clubs-sports-gala-2026.jpg"
                alt="Two SCESA leaders holding the club's four award plaques at the Strathmore Clubs & Sports Gala"
                width={800}
                height={1066}
                sizes="(min-width: 1024px) 224px, (min-width: 640px) 192px, 240px"
                className="h-auto w-full rounded-2xl"
              />
              <figcaption className="mt-2 font-hand text-lg leading-tight text-slate-600 dark:text-slate-300">
                All four plaques, June 2026
              </figcaption>
            </figure>
          </div>
        </Entry>
      </ol>
    </section>
  );
}

function Entry({ year, title, children }: { year: string; title: string; children: ReactNode }) {
  return (
    <li className="relative grid gap-2 border-l-2 border-brand-border pb-12 pl-8 last:border-transparent last:pb-0 md:grid-cols-[11rem_1fr] md:gap-8">
      <span aria-hidden className="absolute top-2 -left-2.25 size-4 rounded-full border-4 border-brand-background bg-brand-accent" />
      <p className="font-display text-display-xs font-semibold text-brand-primary">{year}</p>
      <div>
        <h3 className="font-display text-xl font-semibold text-brand-primary">{title}</h3>
        <div className={`mt-2 ${BODY}`}>{children}</div>
      </div>
    </li>
  );
}
