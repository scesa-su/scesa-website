"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS, isActivePath } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "@/lib/styles";

export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex items-center gap-12 xl:gap-16">
      {/* Desktop header per Home page.png: no Home link, the logo goes home. */}
      {NAV_LINKS.filter(({ href }) => href !== "/").map(({ label, href }) => {
        const active = isActivePath(pathname, href);
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative rounded-lg text-md font-medium transition-colors duration-200",
                "after:absolute after:inset-x-0 after:-bottom-1.5 after:h-0.5 after:origin-left after:rounded-full after:bg-current after:transition-transform after:duration-500 after:ease-out-expo",
                `focus-visible:ring-offset-4 focus-visible:ring-offset-brand-surface ${FOCUS_RING}`,
                active
                  ? "text-orange-700 after:scale-x-100 dark:text-brand-accent"
                  : "text-brand-primary after:scale-x-0 hover:text-orange-700 hover:after:scale-x-100 dark:hover:text-brand-accent",
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
