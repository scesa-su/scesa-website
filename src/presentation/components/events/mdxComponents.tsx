import type { ComponentProps } from "react";
import { proseElements } from "@/presentation/components/ui/prose";

const BODY = "text-lg leading-relaxed text-brand-muted";
const H_TOP = "mt-10 font-display text-display-xs font-semibold text-balance text-brand-primary";

/**
 * Token-styled elements for MDX event bodies. The page's "About this event" is the h2,
 * so editor headings 1–2 render as h3, 3 as h4 and 4–6 as h5.
 */
export const mdxComponents = {
  ...proseElements,
  h1: (props: ComponentProps<"h1">) => <h3 className={H_TOP} {...props} />,
  h2: (props: ComponentProps<"h2">) => <h3 className={H_TOP} {...props} />,
  h3: (props: ComponentProps<"h3">) => <h4 className="mt-8 text-xl font-semibold text-brand-primary" {...props} />,
  h4: (props: ComponentProps<"h4">) => <h5 className="mt-4 text-md font-semibold text-brand-primary" {...props} />,
  h5: (props: ComponentProps<"h5">) => <h5 className="mt-4 text-md font-semibold text-brand-primary" {...props} />,
  h6: (props: ComponentProps<"h6">) => <h5 className="mt-4 text-md font-semibold text-brand-primary" {...props} />,
  p: (props: ComponentProps<"p">) => <p className={`mt-4 ${BODY}`} {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className={`mt-4 list-disc space-y-2 pl-6 marker:text-brand-accent ${BODY}`} {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className={`mt-4 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-brand-accent ${BODY}`} {...props} />,
};
