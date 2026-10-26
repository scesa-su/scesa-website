import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom font sizes so `text-display-lg` isn't mistaken for a color.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-2xl",
        "display-xl",
        "display-lg",
        "display-md",
        "display-sm",
        "display-xs",
        "md",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
