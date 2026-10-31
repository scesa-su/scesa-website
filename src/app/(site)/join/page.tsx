import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, MEMBERSHIP_FEE_KES, MEMBERSHIP_GOOGLE_FORM_URL } from "@/lib/constants";
import { RegistrationForm } from "@/presentation/components/join/RegistrationForm";

export const metadata: Metadata = {
  title: "Join | SCESA",
  description: `Become a SCESA member: a one-time KES ${MEMBERSHIP_FEE_KES} fee, open to Strathmore computing and engineering students.`,
};

const LINK = "font-medium text-brand-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent";

export default function JoinPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 lg:pb-20">
      <h1 className="font-display text-display-sm font-semibold text-brand-primary lg:text-display-md">Join SCESA</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
        Membership is open to Strathmore University students and costs a one-time KES {MEMBERSHIP_FEE_KES}. Fill in your
        details, pick your communities and pay with M-Pesa. It takes about three minutes.
      </p>
      <p className="mt-2 text-md text-slate-600 dark:text-slate-300">
        Already applied?{" "}
        <Link href="/join/status" className={LINK}>
          Check your status
        </Link>
        .
      </p>
      <noscript>
        <p className="mt-6 rounded-lg border border-brand-border p-4 text-md text-brand-primary">
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
      <div className="mt-8">
        <RegistrationForm />
      </div>
    </main>
  );
}
