import Image from "next/image";
import type { Event } from "@/domain/entities/Event";
import { PROJECT_STAGES, type SpotlightLink, type SpotlightPost } from "@/domain/entities/SpotlightPost";
import { cn } from "@/lib/cn";
import { AddToCalendar } from "@/presentation/components/events/AddToCalendar";
import { EventMeta } from "@/presentation/components/events/EventMeta";
import { Button } from "@/presentation/components/ui/Button";
import { MarginNote } from "./MarginNote";
import { Polaroid } from "./Polaroid";
import { PostMeta } from "./PostMeta";

const H1 = "mt-4 font-display text-display-sm font-semibold text-balance text-brand-primary lg:text-display-lg";
const DEK = "mt-4 text-xl text-slate-600 dark:text-slate-300";
const BOX = "rounded-2xl border border-brand-border bg-navy-25 p-6";
const BOX_H2 = "font-display text-xl font-semibold text-brand-primary";

type PostProps = { post: SpotlightPost };

function TitleBlock({ post }: PostProps) {
  return (
    <>
      <MarginNote post={post} />
      <h1 className={H1}>{post.title}</h1>
      <p className={DEK}>{post.dek}</p>
      <PostMeta {...post} className="mt-4" />
    </>
  );
}

function Cover({ post, wide, priority = true }: PostProps & { wide?: boolean; priority?: boolean }) {
  if (!post.coverImage || !post.coverAlt) return null;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-brand-border",
        wide ? "aspect-video lg:aspect-2/1" : "mt-10 aspect-video",
      )}
    >
      <Image
        src={post.coverImage}
        alt={post.coverAlt}
        fill
        priority={priority}
        sizes={wide ? "(min-width: 1440px) 1280px, 100vw" : "(min-width: 768px) 720px, 100vw"}
        // Faces usually sit in the upper third; keep them in a wide crop.
        className={cn("object-cover", wide && "object-[50%_30%]")}
      />
    </div>
  );
}

function Links({ links, owner }: { links?: SpotlightLink[]; owner: string }) {
  if (!links?.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {links.map((l, i) => (
        <Button
          key={`${i}-${l.url}`}
          href={l.url}
          variant="outline"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${owner}: ${l.label} (opens in a new tab)`}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}

/** Note, title, dek and meta in the reading column, with the cover below. */
export function DefaultHeader({ post }: PostProps) {
  return (
    <header>
      <TitleBlock post={post} />
      <Cover post={post} />
    </header>
  );
}

/** Recaps lead with a wide photo, then the title in the reading column. */
export function RecapHeader({ post }: PostProps) {
  return (
    <header className="flex flex-col gap-10">
      <Cover post={post} wide />
      <div className="mx-auto w-full max-w-[68ch]">
        <TitleBlock post={post} />
      </div>
    </header>
  );
}

/** Member profile: polaroid portrait beside name, degree, year and their quote. */
export function MemberHeader({ post }: PostProps) {
  const m = post.member;
  if (!m) return <DefaultHeader post={post} />;
  const photo = m.photo && m.photoAlt ? { src: m.photo, alt: m.photoAlt } : undefined;
  return (
    <header>
      <div className={cn("grid gap-8", photo && "sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-start lg:gap-12")}>
        {photo && (
          <Polaroid
            {...photo}
            priority
            aspect="aspect-4/5"
            sizes="(min-width: 640px) 224px, 80vw"
            caption={<span className="font-marker text-md text-slate-800">{m.name}</span>}
            className="max-w-64 sm:max-w-none"
          />
        )}
        <div>
          <MarginNote post={post} />
          <h1 className={H1}>{post.title}</h1>
          <p className={DEK}>{post.dek}</p>
          <p className="mt-4 text-md font-medium text-brand-primary">
            {m.name}, {m.degree}, {m.year}
          </p>
          <figure className="mt-6 border-l-4 border-brand-accent pl-6">
            <blockquote className="font-display text-display-xs font-medium text-balance text-brand-primary">
              “{m.quote}”
            </blockquote>
          </figure>
          <Links links={m.links} owner={m.name} />
          <PostMeta {...post} className="mt-6" />
        </div>
      </div>
      <div className="max-w-[68ch]">
        <Cover post={post} priority={!photo} />
      </div>
    </header>
  );
}

const STAGE_LABEL = { idea: "Idea", building: "Building", testing: "Testing", launched: "Launched" } as const;

/** Stage stepper, team and links for in-the-works posts. */
export function ProjectStatus({ post }: PostProps) {
  const p = post.project;
  if (!p) return null;
  const current = PROJECT_STAGES.indexOf(p.stage);
  return (
    <section aria-labelledby="project-status" className={cn(BOX, "mt-10")}>
      <h2 id="project-status" className={BOX_H2}>
        Where it&apos;s at: {STAGE_LABEL[p.stage]}
      </h2>
      <ol className="mt-4 grid grid-cols-4 gap-2" aria-label="Project stages">
        {PROJECT_STAGES.map((s, i) => (
          <li key={s} aria-current={i === current ? "step" : undefined} className="flex flex-col gap-2">
            <span
              aria-hidden="true"
              className={cn(
                "h-1.5 rounded-full",
                i < current ? "bg-navy-400" : i === current ? "bg-brand-accent" : "bg-slate-300 dark:bg-slate-600",
              )}
            />
            <span
              className={cn(
                "text-xs sm:text-sm",
                i === current ? "font-semibold text-brand-primary" : "text-slate-600 dark:text-slate-300",
              )}
            >
              {STAGE_LABEL[s]}
            </span>
          </li>
        ))}
      </ol>
      {p.team?.length ? (
        <p className="mt-5 text-md text-slate-700 dark:text-slate-200">
          <span className="font-semibold text-brand-primary">Team: </span>
          {p.team.join(", ")}
        </p>
      ) : null}
      <Links links={p.links} owner={post.title} />
    </section>
  );
}

/** Coming-up aside: the linked event's date, place and calendar download. */
export function EventCard({ event }: { event: Event }) {
  return (
    <section aria-labelledby="event-card" className={cn(BOX, "flex flex-col gap-5 lg:sticky lg:top-24")}>
      <h2 id="event-card" className={BOX_H2}>
        {event.title}
      </h2>
      <EventMeta {...event} />
      {event.status !== "completed" && (
        <AddToCalendar slug={event.slug} title={event.title} virtualUrl={event.virtualUrl} registrationUrl={event.registrationUrl} />
      )}
      <Button href={`/events/${event.slug}`} variant="soft" aria-label={`See the event details: ${event.title}`}>
        See the event details
      </Button>
    </section>
  );
}
