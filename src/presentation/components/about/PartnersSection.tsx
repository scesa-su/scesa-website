import Image from "next/image";
import type { Partner } from "@/domain/entities/Partner";
import { Button } from "@/presentation/components/ui/Button";
import { BODY, H2, SECTION } from "./styles";

export function PartnersSection({ partners }: { partners: Partner[] }) {
  return (
    <section aria-labelledby="partners" className={SECTION}>
      <h2 id="partners" className={H2}>
        Organisations we&apos;ve worked with
      </h2>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p) => (
          <li
            key={p.name}
            className="flex min-h-24 items-center justify-center rounded-2xl border border-brand-border bg-brand-surface p-6 text-center text-lg font-semibold text-brand-primary"
          >
            {p.logo ? <Image src={p.logo} alt={p.name} width={160} height={64} className="h-12 w-auto" /> : p.name}
          </li>
        ))}
      </ul>
      {/* Portfolio p. 9, "Why Partner with Us?". */}
      <p className={`mt-8 max-w-3xl ${BODY}`}>
        Working with SCESA puts your company in front of motivated students who want to solve real problems. Through
        hackathons, workshops and project sprints, your team gets an early look at future talent while our members
        learn from your experts.
      </p>
      <Button
        href="mailto:scesa@strathmore.edu"
        variant="outline"
        size="lg"
        className="mt-6"
        aria-label="Partner with SCESA: email scesa@strathmore.edu"
      >
        Partner with SCESA
      </Button>
    </section>
  );
}
