import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { eventRepository } from "@/data/repositories/EventRepository";
import { spotlightRepository } from "@/data/repositories/SpotlightRepository";
import { SITE_URL } from "@/lib/constants";
import { CONTAINER } from "@/presentation/components/about/styles";
import { PostRow } from "@/presentation/components/spotlight/FeedEntry";
import { MarginNote } from "@/presentation/components/spotlight/MarginNote";
import { PostMeta } from "@/presentation/components/spotlight/PostMeta";
import { spotlightMdxComponents } from "@/presentation/components/spotlight/mdxComponents";
import { Button } from "@/presentation/components/ui/Button";

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

  return (
    <main className={`${CONTAINER} py-12 lg:pb-24`}>
      <article className="mx-auto max-w-[68ch]">
        <header>
          <MarginNote post={post} />
          <h1 className="mt-4 font-display text-display-sm font-semibold text-balance text-brand-primary lg:text-display-lg">
            {post.title}
          </h1>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300">{post.dek}</p>
          {post.member && (
            <p className="mt-4 text-md font-medium text-brand-primary">
              {post.member.name}, {post.member.degree}, {post.member.year}
            </p>
          )}
          <PostMeta {...post} className="mt-4" />
        </header>

        {post.coverImage && post.coverAlt && (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-2xl border border-brand-border">
            <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          </div>
        )}

        {post.member && (
          <figure className="mt-10 border-l-4 border-brand-accent pl-6">
            <blockquote className="font-display text-display-xs font-medium text-balance text-brand-primary md:text-display-sm">
              “{post.member.quote}”
            </blockquote>
            <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-300">{post.member.name}</figcaption>
          </figure>
        )}

        <div className="mt-4">
          <MDXRemote source={post.body} components={spotlightMdxComponents} />
        </div>

        {event && (
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
      </article>

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
