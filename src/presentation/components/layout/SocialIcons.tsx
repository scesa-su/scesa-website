import { CalendarDaysIcon, MailIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { SocialIcon } from "@/lib/constants";

// lucide-react 1.x ships no brand icons, so these are small inline outlines.
function BrandSvg({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
    >
      {children}
    </svg>
  );
}

export const SOCIAL_ICONS: Record<SocialIcon, ReactNode> = {
  linkedin: (
    <BrandSvg>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </BrandSvg>
  ),
  instagram: (
    <BrandSvg>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </BrandSvg>
  ),
  tiktok: (
    <BrandSvg>
      <path d="M21 7.917v4.034a9.948 9.948 0 0 1-5-1.951v4.5a6.5 6.5 0 1 1-8-6.326v4.326a2.5 2.5 0 1 0 4 2V3h4.083A6.005 6.005 0 0 0 21 7.917z" />
    </BrandSvg>
  ),
  email: <MailIcon aria-hidden className="size-5" />,
  luma: <CalendarDaysIcon aria-hidden className="size-5" />,
};

export const isExternal = (href: string) => href.startsWith("http");

export function socialLabel(label: string, href: string) {
  return isExternal(href) ? `SCESA on ${label} (opens in new tab)` : `${label} SCESA`;
}
