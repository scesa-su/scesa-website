import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/constants";
import { StatusLookup } from "@/presentation/components/join/StatusLookup";

export const metadata: Metadata = {
  title: "Membership status | SCESA",
  description: "Check whether your SCESA membership payment has been confirmed.",
  robots: { index: false },
};

export default async function StatusPage({ searchParams }: PageProps<"/join/status">) {
  const { ref } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 lg:pb-20">
      <h1 className="font-display text-display-sm font-semibold text-brand-primary lg:text-display-md">Membership status</h1>
      <p className="mt-3 text-lg text-slate-600 dark:text-slate-300">
        Enter the reference you got when you applied and your student ID. Lost your reference, or joined through the
        Google Form? Email{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-primary underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <div className="mt-8">
        <StatusLookup initialReference={typeof ref === "string" ? ref : ""} />
      </div>
    </main>
  );
}
