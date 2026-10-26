import { Button } from "@/presentation/components/ui/Button";
import { SwipeableDeck } from "./SwipeableDeck";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-title" className="overflow-x-clip">
      <div className="mx-auto grid w-full max-w-360 items-center gap-12 px-4 py-12 md:px-8 lg:grid-cols-2 lg:px-14 lg:py-20">
        <div className="flex flex-col items-start gap-6">
          <h1 id="hero-title" className="max-w-md font-display text-display-md font-semibold text-brand-primary">
            Where Strathmore&apos;s Tech Pioneers Build the Future
          </h1>
          <p className="max-w-lg text-lg text-slate-600 dark:text-slate-300">
            Workshops, hackathons and communities for Strathmore&apos;s computing and engineering students.
          </p>
          <Button href="/join" size="md">
            Find Your Tribe
          </Button>
        </div>
        <div className="px-6 sm:px-10">
          <SwipeableDeck />
        </div>
      </div>
    </section>
  );
}
