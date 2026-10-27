import type { ComponentProps } from "react";

/** Token-styled elements for MDX event bodies. */
export const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => <h3 className="mt-6 font-display text-display-xs font-semibold text-brand-primary" {...props} />,
  h3: (props: ComponentProps<"h3">) => <h4 className="mt-4 text-lg font-semibold text-brand-primary" {...props} />,
  p: (props: ComponentProps<"p">) => <p className="mt-3 text-md text-slate-600 dark:text-slate-300" {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className="mt-3 list-disc space-y-1 pl-6 text-md text-slate-600 dark:text-slate-300" {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className="mt-3 list-decimal space-y-1 pl-6 text-md text-slate-600 dark:text-slate-300" {...props} />,
  strong: (props: ComponentProps<"strong">) => <strong className="font-semibold text-brand-primary" {...props} />,
  a: (props: ComponentProps<"a">) => (
    <a
      className="rounded-sm font-medium text-brand-primary underline underline-offset-2 hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      {...props}
    />
  ),
};
