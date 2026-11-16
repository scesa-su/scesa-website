import Image from "next/image";
import type { Partner } from "@/domain/entities/Partner";
import { CONTACT_EMAIL } from "@/lib/constants";
import { mailtoHref } from "@/lib/mailto";
import { Button } from "@/presentation/components/ui/Button";
import { H2, SECTION } from "@/lib/styles";
import { Reveal } from "@/presentation/components/motion/Reveal";
import { SectionLabel } from "@/presentation/components/ui/SectionLabel";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  return (
    <section aria-labelledby="partners" className={SECTION}>
      <SectionLabel index={7} className="justify-center">
        Partners
      </SectionLabel>
      <h2 id="partners" className={`mt-6 ${H2} text-center`}>
        Organisations we&apos;ve worked with
      </h2>
      <Reveal className="mt-12">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-brand-border bg-brand-border md:grid-cols-4">
        {partners.map((p) => (
          <li
            key={p.name}
            className="flex min-h-24 items-center justify-center bg-brand-background p-4 text-center font-display text-md font-semibold text-brand-muted transition-colors duration-300 hover:bg-brand-sunken hover:text-brand-primary md:min-h-28 md:p-6 md:text-lg"
          >
            {p.logo ? <Image src={p.logo} alt={p.name} width={160} height={64} className="h-10 w-auto" /> : p.name}
          </li>
        ))}
      </ul>
      </Reveal>
    </section>
  );
}

const PARTNER_MAILTO = mailtoHref({
  to: CONTACT_EMAIL,
  subject: "Partnership proposal",
  body: ["Organisation:", "Contact person:", "Role:", "", "What you have in mind:", ""].join("\n"),
});

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
            href={PARTNER_MAILTO}
            size="lg"
            className="mt-8"
            aria-label={`Partner with SCESA: email ${CONTACT_EMAIL}`}
          >
            Partner with SCESA
          </Button>
        </div>
        <div className="flex flex-col items-start rounded-3xl bg-brand-sunken p-8 md:p-12">
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
