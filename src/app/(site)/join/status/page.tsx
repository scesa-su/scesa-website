import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/constants";
import { CONTAINER, FOCUS_RING } from "@/lib/styles";
import { StatusLookup } from "@/presentation/components/join/StatusLookup";
import { PageHeader } from "@/presentation/components/layout/PageHeader";
import { BackLink } from "@/presentation/components/ui/BackLink";

export const metadata: Metadata = {
  title: "Membership status",
  description: "Check whether your SCESA membership payment has been confirmed.",
  robots: { index: false },
};

export default async function StatusPage({ searchParams }: PageProps<"/join/status">) {
  const { ref } = await searchParams;
  return (
    <main>
      <PageHeader
        eyebrow="Membership"
        title={["Check your", "status"]}
        underline
        intro={
          <>
            Enter the reference you got when you applied and your student ID. Lost your reference, or joined through
            the Google Form? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className={`font-medium text-brand-primary underline underline-offset-4 ${FOCUS_RING}`}>
              {CONTACT_EMAIL}
            </a>
            .
          </>
        }
      />
      <div className={`${CONTAINER} border-t border-brand-border pt-10 pb-16 lg:pt-14 lg:pb-24`}>
        <div className="max-w-3xl">
          <StatusLookup initialReference={typeof ref === "string" ? ref : ""} />
          <BackLink href="/join" className="mt-8">
            Back to joining
          </BackLink>
        </div>
      </div>
    </main>
  );
}
