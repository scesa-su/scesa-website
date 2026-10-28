import Image from "next/image";
import type { Partner } from "@/domain/entities/Partner";
import { Button } from "@/presentation/components/ui/Button";
import { H2, SECTION } from "./styles";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  return (
    <section aria-labelledby="partners" className={SECTION}>
      <h2 id="partners" className={`${H2} text-center`}>
        Organisations we&apos;ve worked with
      </h2>
      <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-brand-border bg-brand-border md:grid-cols-4">
        {partners.map((p) => (
          <li
            key={p.name}
            className="flex min-h-24 items-center justify-center bg-brand-background p-4 text-center font-display text-md font-semibold md:min-h-28 md:p-6 md:text-lg text-slate-600 dark:text-slate-300"
          >
            {p.logo ? <Image src={p.logo} alt={p.name} width={160} height={64} className="h-10 w-auto" /> : p.name}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ClosingPanels() {
  return (
    <section aria-label="Work with SCESA" className={`${SECTION} pt-0 lg:pt-0`}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col items-start rounded-3xl bg-brand-primary p-8 md:p-12">
          <h2 className="font-display text-display-xs font-semibold text-brand-background md:text-display-sm">
            Partner with SCESA
          </h2>
          {/* Portfolio p. 9, "Why Partner with Us?". */}
          <p className="mt-4 text-lg text-brand-background">
            Meet motivated students who want to solve real problems. Through hackathons, workshops and project sprints,
            your team gets an early look at future talent while our members learn from your experts.
          </p>
          <Button
            href="mailto:scesa@strathmore.edu"
            size="lg"
            className="mt-8"
            aria-label="Partner with SCESA: email scesa@strathmore.edu"
          >
            Partner with SCESA
          </Button>
        </div>
        <div className="flex flex-col items-start rounded-3xl bg-navy-25 p-8 md:p-12">
          <h2 className="font-display text-display-xs font-semibold text-brand-primary md:text-display-sm">
            Ready to join us?
          </h2>
          <p className="mt-4 text-lg text-brand-primary">
            Pick the communities you care about and meet people building the same things you are.
          </p>
          <Button href="/join" size="lg" className="mt-8" aria-label="Find your tribe: become a SCESA member">
            Find Your Tribe
          </Button>
        </div>
      </div>
    </section>
  );
}
