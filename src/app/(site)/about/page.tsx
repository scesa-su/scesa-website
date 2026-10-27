import type { Metadata } from "next";
import { aboutRepository } from "@/data/repositories/AboutRepository";
import { BoardWall } from "@/presentation/components/about/BoardWall";
import { GrowthPathways, MissionVision, Pillars } from "@/presentation/components/about/ClubStory";
import { ConductSection } from "@/presentation/components/about/ConductSection";
import { PartnersSection } from "@/presentation/components/about/PartnersSection";
import { BODY, H2, SECTION } from "@/presentation/components/about/styles";
import { Timeline } from "@/presentation/components/about/Timeline";
import { Button } from "@/presentation/components/ui/Button";

export const metadata: Metadata = {
  title: "About | SCESA",
  description:
    "Who runs SCESA, what we stand for and how we help Strathmore computing and engineering students grow.",
};

export default async function AboutPage() {
  const [leaders, partners] = await Promise.all([aboutRepository.getLeaders(), aboutRepository.getPartners()]);

  return (
    <main>
      <section className={`${SECTION} lg:pt-20`}>
        <h1 className="max-w-4xl font-display text-display-md font-semibold text-brand-primary lg:text-display-lg">
          The students behind SCESA
        </h1>
        <p className={`mt-4 max-w-3xl ${BODY}`}>
          SCESA is the student association of the School of Computing and Engineering Sciences at Strathmore
          University&apos;s Madaraka campus. Since 2014 we have worked to close the gap between classroom theory and
          real-world engineering.
        </p>
        <Button
          href="/docs/scesa-portfolio-2026-27.pdf"
          prefetch={false}
          variant="outline"
          size="lg"
          className="mt-8"
          aria-label="Download our 2026/27 corporate portfolio (PDF)"
        >
          Download our portfolio (PDF)
        </Button>
      </section>
      <MissionVision />
      <Pillars />
      <GrowthPathways />
      <Timeline />
      <BoardWall leaders={leaders} />
      <ConductSection />
      <PartnersSection partners={partners} />
      <section aria-labelledby="join" className={`${SECTION} pb-20 text-center`}>
        <h2 id="join" className={H2}>
          Ready to join us?
        </h2>
        <p className={`mx-auto mt-3 max-w-2xl ${BODY}`}>
          Pick the communities you care about and meet people building the same things you are.
        </p>
        <Button href="/join" size="lg" className="mt-6" aria-label="Find your tribe: become a SCESA member">
          Find Your Tribe
        </Button>
      </section>
    </main>
  );
}
