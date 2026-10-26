"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActivePath } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-10 xl:gap-12">
      {NAV_LINKS.map(({ label, href }) => {
        const active = isActivePath(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-md text-md font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-4 focus-visible:ring-offset-brand-surface",
                active
                  ? "text-orange-700 underline decoration-2 underline-offset-8 dark:text-brand-accent"
                  : "text-brand-primary hover:text-orange-700 dark:hover:text-brand-accent",
              )}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
