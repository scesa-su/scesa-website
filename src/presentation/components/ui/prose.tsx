import Image from "next/image";
import type { ComponentProps } from "react";

/**
 * Elements Keystatic's MDX editor can produce that look the same in events and Spotlight
 * (Tailwind's preflight strips the browser defaults). Each map adds its own headings, p and lists.
 */
export const proseElements = {
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-brand-primary" {...props} />,
  em: (props: ComponentProps<"em">) => <em className="italic" {...props} />,
  del: (props: ComponentProps<"del">) => <del className="line-through decoration-slate-500" {...props} />,
  code: (props: ComponentProps<"code">) => (
    <code className="rounded bg-navy-25 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-primary" {...props} />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre
      className="mt-5 overflow-x-auto rounded-xl border border-brand-border bg-navy-25 p-4 text-sm leading-relaxed text-brand-primary [&>code]:bg-transparent [&>code]:p-0"
      {...props}
    />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="mt-6 border-l-4 border-brand-accent pl-5 [&>p:first-child]:mt-0 [&>p]:text-brand-primary" {...props} />
  ),
  hr: (props: ComponentProps<"hr">) => <hr className="my-8 border-brand-border" {...props} />,
  li: (props: ComponentProps<"li">) => <li className="pl-1 [&>ol]:mt-2 [&>p]:mt-0 [&>ul]:mt-2" {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      className="rounded-sm font-medium text-brand-primary underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      {...props}
    />
  ),
  // Markdown images are local uploads under /images/; next/image rejects any other host at build time.
  img: ({ src, alt }: ComponentProps<"img">) =>
    typeof src === "string" ? (
      <Image src={src} alt={alt ?? ""} width={1600} height={1067} sizes="(min-width: 768px) 68ch, 100vw" className="mt-6 h-auto w-full rounded-2xl border border-brand-border" />
    ) : null,
  table: (props: ComponentProps<"table">) => (
    <div className="mt-6 overflow-x-auto rounded-xl border border-brand-border">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  thead: (props: ComponentProps<"thead">) => <thead className="bg-navy-25 text-brand-primary" {...props} />,
  th: (props: ComponentProps<"th">) => <th className="border-b border-brand-border px-4 py-2 font-semibold" {...props} />,
  td: (props: ComponentProps<"td">) => (
    <td className="border-b border-brand-border px-4 py-2 text-slate-700 dark:text-slate-300" {...props} />
  ),
};
