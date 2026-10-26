"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/cn";

const ORDER = ["light", "dark", "system"] as const;
type ThemeName = (typeof ORDER)[number];
const ICONS = { light: SunIcon, dark: MoonIcon, system: MonitorIcon } as const;

const noopSubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards: avoids a theme mismatch.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const base = cn("inline-flex size-10 items-center justify-center rounded-lg", className);

  if (!mounted) return <span aria-hidden className={base} />;

  const current: ThemeName = ORDER.includes(theme as ThemeName) ? (theme as ThemeName) : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
  const Icon = ICONS[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${current}. Switch to ${next} theme`}
      title={`Theme: ${current}`}
      className={cn(
        base,
        "text-brand-primary transition-colors hover:bg-navy-25",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
      )}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  );
}
