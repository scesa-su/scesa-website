import Link from "next/link";
import type { Partner } from "@/domain/entities/Partner";
import type { SpotlightPost } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { EYEBROW, FOCUS_RING, H2, SECTION } from "@/lib/styles";
import { Marquee } from "@/presentation/components/motion/Marquee";
import { Parallax } from "@/presentation/components/motion/Parallax";
import { MarginNote } from "@/presentation/components/spotlight/MarginNote";
import { Polaroid } from "@/presentation/components/spotlight/Polaroid";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";
import { SectionLabel } from "@/presentation/components/ui/SectionLabel";

export function SpotlightTeaser({ posts, partners }: { posts: SpotlightPost[]; partners: Partner[] }) {
  return (
    <section
      aria-labelledby={posts.length > 0 ? "spotlight-title" : undefined}
      aria-label={posts.length > 0 ? undefined : "Partners"}
      className={SECTION}
    >
      {posts.length > 0 && (
        <>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionLabel index={5}>From the board</SectionLabel>
              <h2 id="spotlight-title" className={`mt-6 ${H2}`}>
                What members have been up to
              </h2>
            </div>
            <ArrowLink href="/spotlight">Read all stories</ArrowLink>
          </div>
          <ul className="mt-14 grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
            {posts.map((post, i) => (
              <li key={post.slug} className={cn(i % 2 === 1 && "md:mt-28")}>
                {i % 2 === 1 ? (
                  <Parallax distance={40}>
                    <Story post={post} index={i} />
                  </Parallax>
                ) : (
                  <Story post={post} index={i} />
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      {partners.length > 0 && (
        <div className={cn(posts.length > 0 && "mt-24 lg:mt-32")}>
          <p className={cn(EYEBROW, "text-center")}>Organisations we&apos;ve worked with</p>
          <Marquee baseVelocity={-0.5} repeat={2} className="mt-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <ul className="flex shrink-0 items-center">
              {partners.map((p) => (
                <li
                  key={p.name}
                  className="px-8 font-display text-xl font-semibold whitespace-nowrap text-brand-muted lg:px-12 lg:text-display-xs"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          </Marquee>
        </div>
      )}
    </section>
  );
}

function Story({ post, index }: { post: SpotlightPost; index: number }) {
  return (
    <article className="group relative">
      {post.coverImage && post.coverAlt && (
        <Polaroid
          src={post.coverImage}
          alt={post.coverAlt}
          index={index}
          sizes="(min-width: 768px) 45vw, 100vw"
          caption={<MarginNote post={post} index={index} className="rotate-0 text-md text-slate-800 dark:text-slate-800" />}
          className="p-3 pb-0 transition-transform duration-700 ease-out-expo group-hover:rotate-0 group-hover:scale-[1.02]"
        />
      )}
      <h3 className="mt-8 font-display text-display-xs font-semibold text-balance text-brand-primary">
        <Link
          href={`/spotlight/${post.slug}`}
          aria-label={`Read: ${post.title}`}
          className={cn("rounded-sm after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-4", FOCUS_RING)}
        >
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 max-w-[50ch] text-md text-brand-muted">{post.dek}</p>
    </article>
  );
}
