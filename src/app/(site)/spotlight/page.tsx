import type { Metadata } from "next";
import { spotlightRepository } from "@/data/repositories/SpotlightRepository";
import { parseKind } from "@/domain/usecases/spotlightQueries";
import { CONTAINER } from "@/lib/styles";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Reveal } from "@/presentation/components/motion/Reveal";
import { LeadStory, PostRow } from "@/presentation/components/spotlight/FeedEntry";
import { KindFilters } from "@/presentation/components/spotlight/KindFilters";
import { FILTER_LABEL } from "@/presentation/components/spotlight/kinds";
import { STORY_MAILTO, StoryBand } from "@/presentation/components/spotlight/StoryBand";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";
import { Button } from "@/presentation/components/ui/Button";

export const metadata: Metadata = {
  title: "Spotlight",
  description: "Recaps, projects in progress, plans and the members behind them.",
};

export default async function SpotlightPage({ searchParams }: PageProps<"/spotlight">) {
  const kind = parseKind((await searchParams).kind);
  const [lead, ...rest] = await spotlightRepository.getAll(kind);

  return (
    <main>
      <PageHeader
        eyebrow="Spotlight"
        title={["What's new", "in SCESA"]}
        underline
        intro="Recaps, things members are building, what's coming up, and the people behind it all."
        aside={
          <ArrowLink href={STORY_MAILTO}>Email us your story</ArrowLink>
        }
      />

      <div className={`${CONTAINER} pb-16 lg:pb-24`}>
        <div className="border-t border-brand-border pt-8">
          <KindFilters kind={kind} />
        </div>

        <div className="max-w-5xl">
          {lead ? (
            <>
              <Reveal className="mt-12 lg:mt-16">
                <LeadStory post={lead} />
              </Reveal>
              {rest.length > 0 && (
                <ul className="mt-12 divide-y divide-brand-border border-t border-brand-border">
                  {rest.map((post, i) => (
                    <li key={post.slug}>
                      <Reveal y={24}>
                        <PostRow post={post} index={i + 1} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-border px-4 py-20 text-center">
              <h2 className="font-display text-display-xs font-semibold text-brand-primary">Nothing here yet</h2>
              <p className="max-w-[48ch] text-md text-brand-muted">
                {kind
                  ? `No posts under “${FILTER_LABEL[kind]}” yet. Read everything else, or send us one.`
                  : "There are no posts yet. Be the first and send us one."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {kind && (
                  <Button href="/spotlight" variant="outline" aria-label="Show all Spotlight posts">
                    See all posts
                  </Button>
                )}
                <Button href={STORY_MAILTO} variant="soft" aria-label="Email your story to SCESA">
                  Send your story
                </Button>
              </div>
            </div>
          )}
        </div>

        <Reveal className="mt-20 lg:mt-28">
          <StoryBand />
        </Reveal>
      </div>
    </main>
  );
}
