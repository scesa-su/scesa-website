import type { Metadata } from "next";
import { CONTAINER } from "@/lib/styles";
import { Button } from "@/presentation/components/ui/Button";
import { Polaroid } from "@/presentation/components/spotlight/Polaroid";
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
      <main className={`${CONTAINER} grid flex-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24`}>
        <div className="text-center lg:text-left">
          <p className="font-marker text-xl font-bold text-brand-accent">Error 404</p>
          <h1 className="mt-2 font-display text-display-sm font-semibold text-brand-primary lg:text-display-lg">
            This page isn&apos;t on the board
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-brand-muted lg:mx-0">
            The link may be old, or the page may have moved. Head back home or pick up from one of these.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Button href="/" size="lg">
              Back to home
            </Button>
            {LINKS.map((link) => (
              <Button key={link.href} href={link.href} variant="outline" size="lg">
                {link.label}
              </Button>
            ))}
          </div>
        </div>
        <Polaroid
          src="/images/not-found/404_not_found.svg"
          alt="Illustration of a person asleep in a bin, holding 404 balloons"
          sizes="(min-width: 1024px) 40vw, 90vw"
          index={1}
          priority
          className="mx-auto w-full max-w-md"
          caption={<span className="font-marker text-lg font-bold text-slate-800">Debugging in my dreams. Try heading back home.</span>}
        />
      </main>
    </SiteLayout>
  );
}
