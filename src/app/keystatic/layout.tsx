import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { keystaticEnabled } from "@/lib/keystatic";

export const metadata: Metadata = { title: "SCESA content editor", robots: { index: false, follow: false } };

export default function KeystaticLayout({ children }: LayoutProps<"/keystatic">) {
  if (!keystaticEnabled()) notFound();
  return children;
}
