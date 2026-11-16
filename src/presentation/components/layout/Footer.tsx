import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { CONTACT_EMAIL, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { CONTAINER, FOCUS_RING } from "@/lib/styles";
import { Magnetic } from "@/presentation/components/motion/Magnetic";
import { Button } from "@/presentation/components/ui/Button";
import { BackToTop } from "./BackToTop";
import { FooterWordmark } from "./FooterWordmark";
import { SOCIAL_ICONS, isExternal, socialLabel } from "./SocialIcons";

const HEADING = "text-xs font-semibold uppercase tracking-[0.2em] text-slate-400";
const LINK = cn("rounded-lg text-md transition-colors duration-200 hover:text-orange-300", FOCUS_RING);
const RING_ON_NAVY = "focus-visible:ring-offset-brand-navy dark:focus-visible:ring-offset-slate-900";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-navy text-white dark:bg-slate-900">
      <div className={`${CONTAINER} pt-16 lg:pt-24`}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="max-w-3xl font-display text-display-md font-semibold text-balance lg:text-display-xl">
            Ready to build with us?
          </h2>
          <Magnetic>
            <Button href="/join" size="lg" className={RING_ON_NAVY}>
              Join SCESA
            </Button>
          </Magnetic>
        </div>

        <div className="mt-16 grid gap-12 border-t border-white/15 pt-12 sm:grid-cols-3">
          <nav aria-labelledby="footer-explore">
            <h3 id="footer-explore" className={HEADING}>
              Explore
            </h3>
            <ul className="mt-6 flex flex-col items-start gap-4">
              {NAV_LINKS.filter(({ href }) => href !== "/").map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={LINK}>
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/join" className={LINK}>
                  Membership
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h3 id="footer-connect" className={HEADING}>
              Connect
            </h3>
            <ul aria-labelledby="footer-connect" className="mt-6 flex flex-col items-start gap-4">
              {SOCIAL_LINKS.filter(({ icon }) => icon !== "email").map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={socialLabel(label, href)}
                    {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}
                    className={cn(LINK, "group inline-flex items-center gap-3")}
                  >
                    {SOCIAL_ICONS[icon]}
                    {label}
                    <ArrowUpRightIcon
                      aria-hidden
                      className="size-4 opacity-0 transition duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={HEADING}>Contact</h3>
            <address className="mt-6 flex flex-col items-start gap-4 not-italic">
              <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
                {CONTACT_EMAIL}
              </a>
              <p className="text-md text-slate-300">
                Strathmore University
                <br />
                Madaraka, Nairobi, Kenya
              </p>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 py-6 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Strathmore Computing and Engineering Students Association</p>
          <BackToTop className="hover:text-orange-300" />
        </div>
      </div>

      <FooterWordmark />
    </footer>
  );
}
