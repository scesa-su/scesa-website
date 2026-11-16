"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/presentation/components/ui/Button";

const HIDDEN_ON = ["/", "/join", "/about"];

export function FooterCta() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname === p || (p !== "/" && pathname.startsWith(`${p}/`)))) return null;

  return (
    <div className="mb-12 flex flex-col gap-8 border-b border-white/15 pb-16 lg:flex-row lg:items-end lg:justify-between">
      <h2 className="max-w-3xl font-display text-display-md font-semibold text-balance lg:text-display-xl">
        Ready to build with us?
      </h2>
      <Button href="/join" size="lg" className="self-start focus-visible:ring-offset-brand-navy dark:focus-visible:ring-offset-slate-900">
        Join SCESA
      </Button>
    </div>
  );
}
