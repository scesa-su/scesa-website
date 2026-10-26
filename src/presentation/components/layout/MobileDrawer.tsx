"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { NAV_LINKS, isActivePath } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { Button } from "@/presentation/components/ui/Button";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on any route change, including back/forward (reset during render, not in an effect).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Desktop nav takes over at lg, so close the drawer if the viewport grows past it.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, close]);

  // Keep Tab / Shift+Tab inside the open drawer.
  const trapFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll<HTMLElement>("button, a");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={open ? "mobile-drawer" : undefined}
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-lg text-brand-primary hover:bg-navy-25",
          FOCUS_RING,
        )}
      >
        <MenuIcon aria-hidden className="size-6" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            onKeyDown={trapFocus}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-brand-navy px-6 py-10 text-white dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className={cn(
                "inline-flex size-10 items-center justify-center self-start rounded-lg hover:bg-white/10",
                FOCUS_RING,
              )}
            >
              <XIcon aria-hidden className="size-6" />
            </button>

            <nav aria-label="Mobile" className="mt-10">
              <ul className="flex flex-col items-end gap-10">
                {NAV_LINKS.map(({ label, href }) => {
                  const active = isActivePath(pathname, href);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-md text-lg font-medium",
                          active ? "text-orange-300 underline underline-offset-8" : "hover:text-orange-300",
                          FOCUS_RING,
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Button
                    href="/join"
                    onClick={close}
                    className="focus-visible:ring-offset-brand-navy dark:focus-visible:ring-offset-slate-900"
                  >
                    Join SCESA
                  </Button>
                </li>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
