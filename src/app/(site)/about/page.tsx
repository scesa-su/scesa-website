import type { Metadata } from "next";
import Image from "next/image";
import { DownloadIcon } from "lucide-react";
import { aboutRepository } from "@/data/repositories/AboutRepository";
import { CONTAINER } from "@/lib/styles";
import { BoardWall } from "@/presentation/components/about/BoardWall";
import { GrowthPathways, MissionVision, Pillars } from "@/presentation/components/about/ClubStory";
import { CodeOfConduct } from "@/presentation/components/about/CodeOfConduct";
import { ClosingPanels, PartnersSection } from "@/presentation/components/about/PartnersSection";
import { Timeline } from "@/presentation/components/about/Timeline";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Parallax } from "@/presentation/components/motion/Parallax";
import { Button } from "@/presentation/components/ui/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Who runs SCESA, what we stand for and how we help Strathmore computing and engineering students grow.",
};

export default async function AboutPage() {
  const [leaders, partners] = await Promise.all([aboutRepository.getLeaders(), aboutRepository.getPartners()]);

  return (
    <main>
      <PageHeader
        eyebrow="About SCESA"
        title={["The students", "behind SCESA"]}
        underline
        intro="SCESA is the student association of the School of Computing and Engineering Sciences at Strathmore University. Since 2014 we have worked to close the gap between classroom theory and real-world engineering."
        aside={
          <Button
            href="/docs/scesa-portfolio-2026-27.pdf"
            prefetch={false}
            variant="outline"
            size="lg"
            aria-label="Download our 2026/27 corporate portfolio (PDF)"
          >
            <DownloadIcon aria-hidden className="size-5" />
            Download our portfolio (PDF)
          </Button>
        }
      />

      <figure className={CONTAINER}>
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl sm:aspect-video lg:aspect-21/9">
          <Parallax distance={48} className="absolute -inset-y-16 inset-x-0">
            <Image
              src="/images/about/board-group-2026.jpeg"
              alt="SCESA members and guests on the steps outside a Strathmore University building, between a Cybersecurity Club banner and a SCESA banner"
              fill
              priority
              sizes="(min-width: 1440px) 1328px, 100vw"
              className="object-cover object-[50%_40%]"
            />
          </Parallax>
        </div>
        <figcaption className="mt-3 font-marker text-lg text-brand-muted">
          A group photo after the SU Cybersecurity Meetup (2025)
        </figcaption>
      </figure>

      <MissionVision />
      <Pillars />
      <GrowthPathways />
      <Timeline />
      <BoardWall leaders={leaders} />
      <CodeOfConduct />
      <PartnersSection partners={partners} />
      <ClosingPanels />
    </main>
  );
}
