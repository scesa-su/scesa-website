import Image from "next/image";
import Link from "next/link";
import type { SpotlightPost } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { MarginNote } from "./MarginNote";
import { PostMeta } from "./PostMeta";

/** Margin-note rail on the left at lg; the note sits above the title below lg. */
export const RAIL = "grid gap-3 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-10";

const TITLE_LINK =
  "rounded-sm after:absolute after:inset-0 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

const href = (slug: string) => `/spotlight/${slug}`;

type EntryProps = { post: SpotlightPost; index?: number };

export function LeadStory({ post }: EntryProps) {
  return (
    <article className={cn(RAIL, "relative")}>
      <MarginNote post={post} className="lg:pt-1" />
      <div>
        {post.coverImage && post.coverAlt && (
          <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl border border-brand-border">
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              priority
              sizes="(min-width: 1024px) 680px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <h2 className="font-display text-display-sm font-semibold text-balance text-brand-primary lg:text-display-md">
          <Link href={href(post.slug)} aria-label={`Read: ${post.title}`} className={TITLE_LINK}>
            {post.title}
          </Link>
        </h2>
        <p className="mt-3 max-w-[60ch] text-lg text-slate-600 dark:text-slate-300">{post.dek}</p>
        <PostMeta {...post} className="mt-4" />
      </div>
    </article>
  );
}

type PostRowProps = EntryProps & { heading?: "h2" | "h3" };

export function PostRow({ post, index, heading: Heading = "h2" }: PostRowProps) {
  const cover = post.coverImage && post.coverAlt ? { src: post.coverImage, alt: post.coverAlt } : undefined;
  return (
    <article className={cn(RAIL, "relative py-8")}>
      <MarginNote post={post} index={index} />
      <div className={cn("grid gap-4", cover && "grid-cols-[minmax(0,1fr)_5.5rem] sm:grid-cols-[minmax(0,1fr)_9rem] sm:gap-8")}>
        <div>
          <Heading className="font-display text-xl font-semibold text-balance text-brand-primary">
            <Link href={href(post.slug)} aria-label={`Read: ${post.title}`} className={TITLE_LINK}>
              {post.title}
            </Link>
          </Heading>
          <p className="mt-2 max-w-[60ch] text-md text-slate-600 dark:text-slate-300">
            {post.member ? `“${post.member.quote}”` : post.excerpt}
          </p>
          <PostMeta {...post} className="mt-3" />
        </div>
        {cover && (
          <div className="relative aspect-square overflow-hidden rounded-xl border border-brand-border sm:aspect-4/3">
            <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 640px) 144px, 88px" className="object-cover" />
          </div>
        )}
      </div>
    </article>
  );
}
