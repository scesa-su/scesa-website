import type { Metadata } from "next";
import { CheckIcon } from "lucide-react";
import { CONTACT_EMAIL, MEMBERSHIP_FEE_KES, MEMBERSHIP_GOOGLE_FORM_URL } from "@/lib/constants";
import { CONTAINER, EYEBROW, FOCUS_RING } from "@/lib/styles";
import { RegistrationForm } from "@/presentation/components/join/RegistrationForm";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { Reveal } from "@/presentation/components/motion/Reveal";
import { ArrowLink } from "@/presentation/components/ui/ArrowLink";

export const metadata: Metadata = {
  title: "Join",
  description: `Become a SCESA member: a one-time KES ${MEMBERSHIP_FEE_KES} fee, open to Strathmore computing and engineering students.`,
};

const LINK = `font-medium text-brand-primary underline underline-offset-4 ${FOCUS_RING}`;

const BENEFITS = [
  "Join the communities you care about",
  "Workshops, hackathons and industry visits",
  "Mentorship and career advice from SCESA alumni",
  "The members' WhatsApp community",
];

export default function JoinPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Membership"
        title={["Join SCESA"]}
        underline
        intro={`Membership is open to Strathmore University students and costs a one-time KES ${MEMBERSHIP_FEE_KES}. Fill in your details, pick your communities and pay with M-Pesa. It takes about three minutes.`}
        aside={
          <div className="flex flex-col gap-2 lg:items-end lg:text-right">
            <p className="flex items-baseline gap-2 font-display text-brand-primary">
              <span className="text-xl font-medium">KES</span>
              <span className="text-display-xl font-semibold tabular-nums">{MEMBERSHIP_FEE_KES}</span>
            </p>
            <p className="text-md text-brand-muted">One-time fee, paid with M-Pesa</p>
            <ArrowLink href="/join/status" className="mt-2">
              Already applied? Check your status
            </ArrowLink>
          </div>
        }
      />

      <div className={`${CONTAINER} grid gap-12 border-t border-brand-border pt-10 pb-16 lg:grid-cols-12 lg:gap-16 lg:pt-14 lg:pb-24`}>
        <div className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
          <noscript>
            <p className="mb-6 rounded-2xl border border-brand-border p-4 text-md text-brand-primary">
              This form needs JavaScript.{" "}
              {MEMBERSHIP_GOOGLE_FORM_URL ? (
                <a href={MEMBERSHIP_GOOGLE_FORM_URL} className={LINK}>
                  Apply with our Google Form instead
                </a>
              ) : (
                <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
                  Email {CONTACT_EMAIL} to join instead
                </a>
              )}
              .
            </p>
          </noscript>
          <RegistrationForm />
        </div>

        <aside className="lg:sticky lg:top-28 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-start">
          <p className={EYEBROW}>What you get</p>
          <ul className="mt-6 border-b border-brand-border">
            {BENEFITS.map((benefit, i) => (
              <li key={benefit} className="border-t border-brand-border">
                <Reveal y={16} delay={i * 0.06} className="flex items-start gap-3 py-4 text-md text-brand-primary">
                  <CheckIcon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-accent" />
                  {benefit}
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-brand-muted">
            Questions about membership? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </aside>
      </div>
    </main>
  );
}
