import type { ComponentProps } from "react";

const BODY = "text-lg leading-[1.7] text-slate-700 dark:text-slate-300";

/** Token-styled elements for Spotlight articles; h2 stays h2 because the article title is the page h1. */
export const spotlightMdxComponents = {
  h2: (props: ComponentProps<"h2">) => <h2 className="mt-10 font-display text-display-xs font-semibold text-brand-primary" {...props} />,
  h3: (props: ComponentProps<"h3">) => <h3 className="mt-8 text-xl font-semibold text-brand-primary" {...props} />,
  p: (props: ComponentProps<"p">) => <p className={`mt-5 ${BODY}`} {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className={`mt-5 list-disc space-y-2 pl-6 ${BODY}`} {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className={`mt-5 list-decimal space-y-2 pl-6 ${BODY}`} {...props} />,
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="mt-6 border-l-4 border-brand-accent pl-5 [&>p]:mt-0 [&>p]:text-brand-primary" {...props} />
  ),
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-brand-primary" {...props} />,
  code: (props: ComponentProps<"code">) => <code className="rounded bg-navy-25 px-1.5 py-0.5 text-[0.9em] text-brand-primary" {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      className="rounded-sm font-medium text-brand-primary underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      {...props}
    />
  ),
};
