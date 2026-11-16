"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, XIcon } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS, isActivePath } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { EYEBROW, FOCUS_RING } from "@/lib/styles";
import { DURATION, EASE_OUT_EXPO } from "@/presentation/components/motion/tokens";
import { Button } from "@/presentation/components/ui/Button";
import { SOCIAL_ICONS, isExternal, socialLabel } from "./SocialIcons";
import { ThemeToggle } from "./ThemeToggle";

const noopSubscribe = () => () => {};
const PANEL = { duration: DURATION.base, ease: EASE_OUT_EXPO };
const item = (i: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { ...PANEL, delay: 0.12 + i * 0.05 } },
});

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

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

  // Rendered into <body>: the header's blur and slide transform would otherwise trap a fixed overlay inside it.
  const drawer = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          data-lenis-prevent
          onKeyDown={trapFocus}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={PANEL}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-brand-navy px-6 pt-6 pb-10 text-white dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <p className={cn(EYEBROW, "text-slate-300")}>Menu</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className={cn("inline-flex size-11 items-center justify-center rounded-lg hover:bg-white/10", FOCUS_RING)}
            >
              <XIcon aria-hidden className="size-6" />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-12">
            <ul className="flex flex-col gap-4">
              {NAV_LINKS.map(({ label, href }, i) => {
                const active = isActivePath(pathname, href);
                return (
                  <motion.li key={href} {...item(i)}>
                    <Link
                      href={href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-baseline gap-4 rounded-lg font-display text-display-md font-semibold transition-colors duration-200",
                        active ? "text-orange-300" : "hover:text-orange-300",
                        FOCUS_RING,
                      )}
                    >
                      <span aria-hidden className="font-body text-xs font-medium text-slate-400 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <motion.div {...item(NAV_LINKS.length)} className="mt-10">
              <Button
                href="/join"
                size="lg"
                onClick={close}
                className="w-full focus-visible:ring-offset-brand-navy dark:focus-visible:ring-offset-slate-900"
              >
                Join SCESA
              </Button>
            </motion.div>
          </nav>

          <motion.div
            {...item(NAV_LINKS.length + 1)}
            className="mt-auto flex items-center justify-between gap-4 border-t border-white/15 pt-6"
          >
            <ul className="flex items-center gap-1" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={socialLabel(label, href)}
                    {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}
                    className={cn(
                      "inline-flex size-11 items-center justify-center rounded-lg transition-colors duration-200 hover:bg-white/10 hover:text-orange-300",
                      FOCUS_RING,
                    )}
                  >
                    {SOCIAL_ICONS[icon]}
                  </a>
                </li>
              ))}
            </ul>
            <ThemeToggle className="size-11 text-white hover:bg-white/10" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={open ? "mobile-drawer" : undefined}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-lg text-brand-primary transition-colors duration-200 hover:bg-navy-25",
          FOCUS_RING,
        )}
      >
        <MenuIcon aria-hidden className="size-6" />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
