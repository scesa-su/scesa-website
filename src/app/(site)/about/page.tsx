import type { Metadata } from "next";
import Image from "next/image";
import { DownloadIcon } from "lucide-react";
import { aboutRepository } from "@/data/repositories/AboutRepository";
import { BoardWall } from "@/presentation/components/about/BoardWall";
import { GrowthPathways, MissionVision, Pillars } from "@/presentation/components/about/ClubStory";
import { CodeOfConduct } from "@/presentation/components/about/CodeOfConduct";
import { ClosingPanels, PartnersSection } from "@/presentation/components/about/PartnersSection";
import { BODY, CONTAINER } from "@/presentation/components/about/styles";
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
      <section className={`${CONTAINER} grid items-center gap-12 pt-12 pb-16 lg:grid-cols-12 lg:gap-16 lg:pt-20 lg:pb-24`}>
        <div className="lg:col-span-6">
          <h1 className="font-display text-display-md font-semibold text-brand-primary md:text-display-lg xl:text-display-xl">
            The students behind SCESA
          </h1>
          <p className={`mt-6 max-w-xl ${BODY}`}>
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
            <DownloadIcon aria-hidden className="size-5" />
            Download our portfolio (PDF)
          </Button>
        </div>
        <figure className="lg:col-span-6">
          <Image
            src="/images/about/members-auditorium.jpeg"
            alt="Students seated in a Strathmore University auditorium during a SCESA session"
            width={1120}
            height={840}
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/3 h-auto w-full rounded-3xl object-cover"
          />
          <figcaption className="mt-3 font-hand text-xl text-slate-600 dark:text-slate-300">
            A full house at a SCESA session
          </figcaption>
        </figure>
      </section>
      <div className="border-t border-brand-border">
        <MissionVision />
      </div>
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
