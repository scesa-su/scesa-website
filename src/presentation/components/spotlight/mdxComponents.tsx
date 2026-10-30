import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";
import { proseElements } from "@/presentation/components/ui/prose";
import { Polaroid } from "./Polaroid";

const BODY = "text-lg leading-[1.7] text-slate-700 dark:text-slate-300";

// Blocks editors insert from Keystatic; every prop is a string because next-mdx-remote drops {…} expressions.

function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return (
    <figure className="my-10 border-y-2 border-brand-accent py-6">
      <blockquote className="font-display text-display-xs font-semibold text-brand-primary md:text-display-sm">
        <p>“{quote}”</p>
      </blockquote>
      {attribution && <figcaption className="mt-3 text-md text-slate-600 dark:text-slate-300">— {attribution}</figcaption>}
    </figure>
  );
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  return (
    <figure className="mt-8">
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1067}
        sizes="(min-width: 768px) 68ch, 100vw"
        className="h-auto w-full rounded-2xl border border-brand-border"
      />
      {caption && <figcaption className="mt-2 text-sm text-slate-600 dark:text-slate-300">{caption}</figcaption>}
    </figure>
  );
}

function PhotoGallery({ children }: { children?: ReactNode }) {
  // Alternate the tilt like the Gallery after the article.
  return <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 [&>li:nth-child(even)>figure]:rotate-1">{children}</ul>;
}

function GalleryImage({ src, alt }: { src: string; alt: string }) {
  return (
    <li>
      <Polaroid src={src} alt={alt} sizes="(min-width: 640px) 220px, 45vw" />
    </li>
  );
}

function Callout({ title, children }: { title?: string; children?: ReactNode }) {
  return (
    <aside className="mt-8 rounded-2xl border border-brand-border bg-navy-25 p-5 [&>*:first-child]:mt-0">
      {title && <p className="font-display text-xl font-semibold text-brand-primary">{title}</p>}
      {children}
    </aside>
  );
}

/** Token-styled elements for Spotlight articles; h2 stays h2 because the article title is the page h1. */
export const spotlightMdxComponents = {
  ...proseElements,
  PullQuote,
  Figure,
  PhotoGallery,
  GalleryImage,
  Callout,
  // Editor heading 1 shares h2's level: the article title is the only h1.
  h1: (props: ComponentProps<"h1">) => <h2 className="mt-10 font-display text-display-xs font-semibold text-brand-primary" {...props} />,
  h2: (props: ComponentProps<"h2">) => <h2 className="mt-10 font-display text-display-xs font-semibold text-brand-primary" {...props} />,
  h3: (props: ComponentProps<"h3">) => <h3 className="mt-8 text-xl font-semibold text-brand-primary" {...props} />,
  h4: (props: ComponentProps<"h4">) => <h4 className="mt-6 text-lg font-semibold text-brand-primary" {...props} />,
  h5: (props: ComponentProps<"h5">) => <h4 className="mt-6 text-lg font-semibold text-brand-primary" {...props} />,
  h6: (props: ComponentProps<"h6">) => <h4 className="mt-6 text-lg font-semibold text-brand-primary" {...props} />,
  p: (props: ComponentProps<"p">) => <p className={`mt-5 ${BODY}`} {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className={`mt-5 list-disc space-y-2 pl-6 ${BODY}`} {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className={`mt-5 list-decimal space-y-2 pl-6 ${BODY}`} {...props} />,
};
