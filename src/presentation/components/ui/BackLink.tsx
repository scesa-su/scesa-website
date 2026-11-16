import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING_OFFSET } from "@/lib/styles";

export function BackLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-brand-muted transition-colors duration-200 hover:text-brand-primary",
        FOCUS_RING_OFFSET,
        className,
      )}
    >
      <ArrowLeftIcon aria-hidden className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-x-1" />
      {children}
    </Link>
  );
}
