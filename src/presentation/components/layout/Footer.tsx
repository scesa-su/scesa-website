import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { CONTACT_EMAIL, NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { CONTAINER, FOCUS_RING } from "@/lib/styles";
import { BackToTop } from "./BackToTop";
import { FooterCta } from "./FooterCta";
import { FooterWordmark } from "./FooterWordmark";
import { SOCIAL_ICONS, isExternal, socialLabel } from "./SocialIcons";

const HEADING = "text-xs font-semibold uppercase tracking-[0.2em] text-slate-400";
const LINK = cn("rounded-lg text-md transition-colors duration-200 hover:text-orange-300", FOCUS_RING);

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-navy text-white dark:bg-slate-900">
      <div className={`${CONTAINER} pt-16 lg:pt-24`}>
        <FooterCta />

        <div className="grid gap-12 sm:grid-cols-3">
          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className={HEADING}>
              Explore
            </h2>
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
            <h2 id="footer-connect" className={HEADING}>
              Connect
            </h2>
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
            <h2 className={HEADING}>Contact</h2>
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
