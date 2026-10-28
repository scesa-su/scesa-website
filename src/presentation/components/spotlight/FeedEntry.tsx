import Link from "next/link";
import type { SpotlightPost } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { MarginNote } from "./MarginNote";
import { Polaroid } from "./Polaroid";
import { PostMeta } from "./PostMeta";

const TITLE_LINK =
  "rounded-sm after:absolute after:inset-0 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

/** The note as a caption on the white frame: dark ink in both themes. */
const ON_FRAME = "rotate-0 text-sm leading-tight text-slate-800 dark:text-slate-800 sm:text-md";

const href = (slug: string) => `/spotlight/${slug}`;

const coverOf = (post: SpotlightPost) =>
  post.coverImage && post.coverAlt ? { src: post.coverImage, alt: post.coverAlt } : undefined;

type EntryProps = { post: SpotlightPost; index?: number };

export function LeadStory({ post }: EntryProps) {
  const cover = coverOf(post);
  return (
    <article
      className={cn(
        "relative grid gap-8",
        cover &&
          "grid-cols-[7rem_minmax(0,1fr)] gap-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:items-center md:gap-10",
      )}
    >
      {cover && (
        <Polaroid
          {...cover}
          priority
          sizes="(min-width: 768px) 400px, 100vw"
          caption={<MarginNote post={post} className={cn(ON_FRAME, "md:text-lg")} />}
          className="self-start md:p-3 md:pb-0"
        />
      )}
      <div>
        {!cover && <MarginNote post={post} className="mb-4" />}
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

export function PostRow({ post, index = 0, heading: Heading = "h2" }: PostRowProps) {
  const cover = coverOf(post);
  return (
    <article
      className={cn(
        "relative grid gap-4 py-8",
        cover && "grid-cols-[7rem_minmax(0,1fr)] sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[13rem_minmax(0,1fr)]",
      )}
    >
      {cover && (
        <Polaroid
          {...cover}
          index={index}
          sizes="(min-width: 1024px) 208px, (min-width: 640px) 160px, 112px"
          caption={<MarginNote post={post} index={index} className={ON_FRAME} />}
          className="self-start"
        />
      )}
      <div>
        {!cover && <MarginNote post={post} index={index} className="mb-3" />}
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
    </article>
  );
}
