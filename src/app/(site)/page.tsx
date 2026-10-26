import { FeaturedEvents } from "@/presentation/components/home/FeaturedEvents";
import { HeroSection } from "@/presentation/components/home/HeroSection";
import { MissionSection } from "@/presentation/components/home/MissionSection";
import { StatsSection } from "@/presentation/components/home/StatsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <MissionSection />
      <StatsSection />
      <FeaturedEvents />
    </main>
  );
}
