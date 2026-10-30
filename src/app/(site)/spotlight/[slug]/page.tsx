import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { eventRepository } from "@/data/repositories/EventRepository";
import { spotlightRepository } from "@/data/repositories/SpotlightRepository";
import { SITE_URL } from "@/lib/constants";
import remarkGfm from "remark-gfm";
import { allowOnly } from "@/lib/mdx";
import { CONTAINER } from "@/presentation/components/about/styles";
import { PostRow } from "@/presentation/components/spotlight/FeedEntry";
import { cn } from "@/lib/cn";
import {
  DefaultHeader,
  EventCard,
  MemberHeader,
  ProjectStatus,
  RecapHeader,
} from "@/presentation/components/spotlight/ArticleHeader";
import { Gallery } from "@/presentation/components/spotlight/Gallery";
import { spotlightMdxComponents } from "@/presentation/components/spotlight/mdxComponents";
import { Button } from "@/presentation/components/ui/Button";

// GFM: strikethrough and tables as Keystatic saves them. Only elements with a component render; raw HTML is dropped.
const mdxOptions = { remarkPlugins: [remarkGfm, allowOnly(Object.keys(spotlightMdxComponents))] };

// Event status comes from the clock, so rebuild hourly.
export const revalidate = 3600;

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await spotlightRepository.getAll()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/spotlight/[slug]">): Promise<Metadata> {
  const post = await spotlightRepository.getBySlug((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | SCESA Spotlight`,
    description: post.dek,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
      url: `${SITE_URL}/spotlight/${post.slug}`,
      images: post.coverImage ? [{ url: new URL(post.coverImage, SITE_URL).toString(), alt: post.coverAlt }] : undefined,
    },
  };
}

export default async function SpotlightArticlePage({ params }: PageProps<"/spotlight/[slug]">) {
  const { slug } = await params;
  const post = await spotlightRepository.getBySlug(slug);
  if (!post) notFound();
  const [related, event] = await Promise.all([
    spotlightRepository.getRelated(slug),
    post.eventSlug ? eventRepository.getBySlug(post.eventSlug) : undefined,
  ]);

  const coming = post.kind === "coming-up" && event;
  const wideMember = post.kind === "member" && post.member?.photo;
  const body = (
    <>
      <ProjectStatus post={post} />
      <div className="mt-4">
        <MDXRemote source={post.body} components={spotlightMdxComponents} options={{ mdxOptions }} />
      </div>
      <Gallery images={post.gallery} />
      {event && !coming && (
        <Button
          href={`/events/${event.slug}`}
          variant="soft"
          size="lg"
          className="mt-10"
          aria-label={`See the event details: ${event.title}`}
        >
          See the event details
        </Button>
      )}
    </>
  );

  return (
    <main className={`${CONTAINER} py-12 lg:pb-24`}>
      {post.kind === "recap" && post.coverImage ? (
        <article className="mx-auto max-w-6xl">
          <RecapHeader post={post} />
          <div className="mx-auto max-w-[68ch]">{body}</div>
        </article>
      ) : coming ? (
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,68ch)_20rem] lg:justify-between">
          <article>
            <DefaultHeader post={post} />
            {body}
          </article>
          <aside aria-label="Event">
            <EventCard event={event} />
          </aside>
        </div>
      ) : (
        <article className={cn("mx-auto", wideMember ? "max-w-5xl" : "max-w-[68ch]")}>
          {post.kind === "member" ? <MemberHeader post={post} /> : <DefaultHeader post={post} />}
          <div className={cn(wideMember && "max-w-[68ch]")}>
            {body}
          </div>
        </article>
      )}

      <section aria-label="More from Spotlight" className="mx-auto mt-20 max-w-4xl">
        {related.length > 0 && (
          <>
            <h2 id="more-spotlight" className="font-display text-display-xs font-semibold text-brand-primary md:text-display-sm">
              More from Spotlight
            </h2>
            <ul className="mt-6 divide-y divide-brand-border border-t border-brand-border">
              {related.map((p, i) => (
                <li key={p.slug}>
                  <PostRow post={p} index={i} heading="h3" />
                </li>
              ))}
            </ul>
          </>
        )}
        <Button href="/spotlight" variant="outline" size="lg" className="mt-8" aria-label="Back to all Spotlight posts">
          Back to all posts
        </Button>
      </section>
    </main>
  );
}
