import type { Metadata } from "next";
import { cn } from "@/lib/cn";
import { CONTAINER, EYEBROW } from "@/lib/styles";
import { RevealText } from "@/presentation/components/motion/RevealText";
import { Polaroid } from "@/presentation/components/spotlight/Polaroid";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";
import { Button } from "@/presentation/components/ui/Button";
import SiteLayout from "./(site)/layout";

export const metadata: Metadata = { title: { absolute: "Page not found | SCESA" } };

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/spotlight", label: "Spotlight" },
  { href: "/about", label: "About SCESA" },
];

// Root not-found replaces the (site) layout, so it wraps itself in it to keep the navbar and footer.
export default function NotFound() {
  return (
    <SiteLayout>
      <main className="relative flex flex-1 overflow-x-clip">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-blueprint" />
        <div className={`${CONTAINER} relative grid flex-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-24`}>
          <div className="lg:col-span-7">
            <p className={cn(EYEBROW, "motion-safe:animate-fade-up")}>Error 404</p>
            <h1 className="mt-6 font-display text-display-md font-semibold text-balance text-brand-primary sm:text-display-lg xl:text-display-xl">
              <RevealText lines={["This page isn't", "on the board"]} />
            </h1>
            <p className="mt-6 max-w-md text-lg text-brand-muted">
              The link may be old, or the page may have moved. Head back home or pick up from one of these.
            </p>
            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <Button href="/" size="xl" className="self-start">
                Back to home
              </Button>
              <ul className="flex flex-wrap gap-x-6 gap-y-3">
                {LINKS.map((link) => (
                  <li key={link.href}>
                    <ArrowLink href={link.href}>{link.label}</ArrowLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Polaroid
              src="/images/not-found/404_not_found.svg"
              alt="Illustration of a person asleep in a bin, holding 404 balloons"
              sizes="(min-width: 1024px) 40vw, 90vw"
              index={1}
              priority
              className="mx-auto w-full max-w-md p-3 pb-0"
              caption={<span className="font-marker text-lg font-bold text-slate-800">Debugging in my dreams. Try heading back home.</span>}
            />
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}
