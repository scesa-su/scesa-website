import type { ReactNode } from "react";
import { BODY, H2, SECTION } from "./styles";

export function Timeline() {
  return (
    <section aria-labelledby="timeline" className={SECTION}>
      <h2 id="timeline" className={H2}>
        Our story so far
      </h2>
      <ol className="mt-8 max-w-3xl border-l-2 border-brand-border">
        {/* Source: owner (confirmed 2026-10-27). */}
        <Entry year="2014">SCESA is founded at Strathmore University.</Entry>
        {/* Source: https://partners.strathmore.edu/about-us */}
        <Entry year="2020">
          The Faculty of IT merges with the engineering school to form the School of Computing and Engineering Sciences
          (SCES). SCESA now represents students from both.
        </Entry>
        {/* Sources: SCESA LinkedIn; https://spaceinafrica.com (African Women in Space Conference, Nov 2025). */}
        <Entry year="2025/26">
          We run the AI Students Summit, partner with the African Women in Space Conference in November 2025, and hold a
          Women in Engineering Students Summit with ESA University of Nairobi and IEEE Women in Engineering.
        </Entry>
        {/* Source: SCESA LinkedIn (new board, E&M visit, Clubs & Sports Gala awards, Angular Kenya roadshow). */}
        <Entry year="2026">
          A new board takes over in April. On 12 June we spend a day at E&amp;M Technology House for an industry
          immersion. On 19 June we take home four awards at the Clubs &amp; Sports Gala:
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Best Organised Event 2025, for the AI Students Summit</li>
            <li>Most Rewarding Club 2025</li>
            <li>Best Club Per Category 2025 (IT, Innovation and Research Clubs)</li>
            <li>Collaborations and Partnerships 2025</li>
          </ul>
          <span className="mt-2 block">On 11 July we team up with Angular Kenya for its campus roadshow.</span>
        </Entry>
      </ol>
    </section>
  );
}

function Entry({ year, children }: { year: string; children: ReactNode }) {
  return (
    <li className="relative pb-8 pl-6 last:pb-0">
      <span aria-hidden className="absolute top-2 -left-[7px] size-3 rounded-full bg-brand-accent" />
      <p className="font-display text-display-xs font-semibold text-brand-primary">{year}</p>
      <div className={`mt-1 ${BODY}`}>{children}</div>
    </li>
  );
}
