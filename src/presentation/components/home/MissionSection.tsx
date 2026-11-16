import Image from "next/image";
import { SECTION } from "@/lib/styles";
import { ScrollFillText } from "@/presentation/components/motion/ScrollFillText";
import { SectionLabel } from "@/presentation/components/ui/SectionLabel";

function InlinePhoto({ src, rotate }: { src: string; rotate: string }) {
  return (
    <span
      className={`relative hidden h-[0.8em] w-[1.6em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline ring-2 ring-brand-background md:inline-block ${rotate}`}
    >
      <Image src={src} alt="" fill sizes="120px" className="object-cover" />
    </span>
  );
}

export function MissionSection() {
  return (
    <section aria-labelledby="mission-label" className={SECTION}>
      <SectionLabel index={1} id="mission-label">
        Who we are
      </SectionLabel>
      <ScrollFillText
        className="mt-10 max-w-6xl font-display text-display-sm font-semibold text-balance text-brand-primary md:text-display-md lg:text-display-lg"
        segments={[
          { text: "The official digital home" },
          { node: <InlinePhoto src="/images/home/team-building-hike-2025.jpg" rotate="-rotate-3" /> },
          { text: "of the" },
          { text: "Strathmore Computing and Engineering", className: "text-brand-accent" },
          { node: <InlinePhoto src="/images/home/arduino-workshop.jpg" rotate="rotate-2" /> },
          { text: "Students Association.", className: "text-brand-accent" },
        ]}
      />
      <p className="mt-10 max-w-2xl text-xl text-brand-muted lg:ml-auto lg:text-display-xs">
        We bridge the gap between classroom theory and real-world engineering.
      </p>
    </section>
  );
}
