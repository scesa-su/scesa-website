import { aboutRepository } from "@/data/repositories/AboutRepository";
import { eventRepository } from "@/data/repositories/EventRepository";
import { spotlightRepository } from "@/data/repositories/SpotlightRepository";
import { featuredEvents } from "@/domain/usecases/eventQueries";
import { ClosingCta } from "@/presentation/components/home/ClosingCta";
import { CommunitiesIndex } from "@/presentation/components/home/CommunitiesIndex";
import { FeaturedEvents } from "@/presentation/components/home/FeaturedEvents";
import { HeroSection } from "@/presentation/components/home/HeroSection";
import { MarqueeBand } from "@/presentation/components/home/MarqueeBand";
import { MissionSection } from "@/presentation/components/home/MissionSection";
import { SpotlightTeaser } from "@/presentation/components/home/SpotlightTeaser";
import { StatsSection } from "@/presentation/components/home/StatsSection";

// Event status comes from the clock, so rebuild hourly.
export const revalidate = 3600;

export default async function HomePage() {
  const [events, posts, partners] = await Promise.all([
    eventRepository.getAll(),
    spotlightRepository.getAll(),
    aboutRepository.getPartners(),
  ]);
  const featured = featuredEvents(events);

  return (
    <main>
      <HeroSection nextEvent={featured[0]} />
      <MarqueeBand />
      <MissionSection />
      <StatsSection />
      <CommunitiesIndex />
      <FeaturedEvents events={featured} />
      <SpotlightTeaser posts={posts.slice(0, 2)} partners={partners} />
      <ClosingCta />
    </main>
  );
}
