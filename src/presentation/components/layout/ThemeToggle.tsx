"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { FOCUS_RING } from "@/lib/styles";

const noopSubscribe = () => () => {};

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards: avoids a theme mismatch.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const base = "inline-flex size-10 items-center justify-center rounded-lg";

  if (!mounted) return <span aria-hidden className={cn(base, className)} />;

  const next = resolvedTheme === "dark" ? "light" : "dark";
  const Icon = next === "dark" ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        base,
        "text-brand-primary transition-colors hover:bg-brand-sunken",
        FOCUS_RING,
        className,
      )}
    >
      <Icon aria-hidden className="size-5" />
    </button>
  );
}
