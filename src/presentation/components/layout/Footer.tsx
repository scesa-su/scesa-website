import Link from "next/link";
import { CalendarDaysIcon, MailIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NAV_LINKS, SOCIAL_LINKS, type SocialIcon } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { Button } from "@/presentation/components/ui/Button";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const FOCUS_RING =
  "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

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

const ICONS: Record<SocialIcon, ReactNode> = {
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

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white dark:bg-slate-900">
      <div className="mx-auto w-full max-w-360 px-4 py-12 md:px-8 lg:px-14 lg:py-16">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Logo tone="light" />
              <p className="max-w-xs text-sm">
                Strathmore Computing and Engineering Students Association
              </p>
            </div>
            <ul className="flex items-center gap-5" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href, icon }) => {
                const external = href.startsWith("http");
                return (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={external ? `SCESA on ${label} (opens in new tab)` : `${label} SCESA`}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className={cn("inline-flex p-1 hover:text-orange-300", FOCUS_RING)}
                    >
                      {ICONS[icon]}
                    </a>
                  </li>
                );
              })}
            </ul>
            {/* Header follows the design exactly, so the theme switch lives here. */}
            <ThemeToggle className="-ml-2 text-white hover:bg-white/10" />
          </div>

          <nav aria-labelledby="footer-links-heading" className="md:min-w-56">
            <h2 id="footer-links-heading" className="font-display text-xl font-medium">
              Links
            </h2>
            <ul className="mt-6 flex flex-col items-start gap-6">
              {NAV_LINKS.filter(({ href }) => href !== "/").map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={cn("text-md hover:text-orange-300", FOCUS_RING)}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Button
                  href="/join"
                  size="sm"
                  className="focus-visible:ring-offset-brand-navy dark:focus-visible:ring-offset-slate-900"
                >
                  Join SCESA
                </Button>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-12 text-center text-sm">
          &copy; {new Date().getFullYear()} Strathmore Computing and Engineering Students
          Association
        </p>
      </div>
    </footer>
  );
}
