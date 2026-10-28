import type { Metadata } from "next";
import { spotlightRepository } from "@/data/repositories/SpotlightRepository";
import { parseKind } from "@/domain/usecases/spotlightQueries";
import { Button } from "@/presentation/components/ui/Button";
import { CONTAINER } from "@/presentation/components/about/styles";
import { LeadStory, PostRow } from "@/presentation/components/spotlight/FeedEntry";
import { KindFilters } from "@/presentation/components/spotlight/KindFilters";
import { FILTER_LABEL } from "@/presentation/components/spotlight/kinds";
import { STORY_MAILTO, StoryBand } from "@/presentation/components/spotlight/StoryBand";

export const metadata: Metadata = {
  title: "Spotlight | SCESA",
  description: "Recaps, projects in progress, plans and the members behind them.",
};

export default async function SpotlightPage({ searchParams }: PageProps<"/spotlight">) {
  const kind = parseKind((await searchParams).kind);
  const [lead, ...rest] = await spotlightRepository.getAll(kind);

  return (
    <main className={`${CONTAINER} py-12 lg:pb-24`}>
      <div className="mx-auto max-w-4xl">
        <h1 className="font-display text-display-sm font-semibold text-brand-primary lg:text-display-md">
          What&apos;s new in SCESA
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
          Recaps, things members are building, what&apos;s coming up, and the people behind it all.
        </p>
        <div className="mt-8">
          <KindFilters kind={kind} />
        </div>

        {lead ? (
          <>
            <div className="mt-12">
              <LeadStory post={lead} />
            </div>
            {rest.length > 0 && (
              <ul className="mt-10 divide-y divide-brand-border border-t border-brand-border">
                {rest.map((post, i) => (
                  <li key={post.slug}>
                    <PostRow post={post} index={i + 1} />
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : (
          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-brand-border px-4 py-16 text-center">
            <h2 className="font-display text-display-xs font-semibold text-brand-primary">Nothing here yet</h2>
            <p className="max-w-[48ch] text-md text-slate-600 dark:text-slate-300">
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

        <div className="mt-16">
          <StoryBand />
        </div>
      </div>
    </main>
  );
}
