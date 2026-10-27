import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/presentation/components/ui/Button";
import { BODY, FOCUS_RING, H2, SECTION } from "./styles";

// shortcut: placeholder path, the PDF is not in public/docs yet; add the signed constitution there.
const CONSTITUTION_PDF = "/docs/scesa-constitution.pdf";

// Portfolio p. 5, "Behavior" and "Professionalism".
const CONDUCT = [
  "Treat every member, guest and partner with respect, in person and online.",
  "Act with integrity: be honest about your work and give credit where it is due.",
  "Collaborate openly, share what you know and help newer members find their feet.",
  "Be professional: communicate clearly, keep your commitments and bring a positive attitude.",
  "Remember that how you behave at SCESA events reflects on the whole association.",
];

const CONSTITUTION = [
  "[confirm: official name and objects of the association]",
  "[confirm: who can become a member and how membership fees work]",
  "[confirm: executive board roles, elections and terms of office]",
  "[confirm: meetings, quorum and how the constitution is amended]",
];

export function ConductSection() {
  return (
    <section aria-labelledby="constitution" className={SECTION}>
      <h2 id="constitution" className={H2}>
        Constitution and code of conduct
      </h2>
      <div className="mt-8 max-w-3xl space-y-4">
        <Item title="Code of conduct">
          <ul className="list-disc space-y-2 pl-6">
            {CONDUCT.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </Item>
        <Item title="Constitution">
          <ul className="list-disc space-y-2 pl-6">
            {CONSTITUTION.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <Button
            href={CONSTITUTION_PDF}
            prefetch={false}
            variant="outline"
            className="mt-4"
            aria-label="Download the SCESA constitution (PDF)"
          >
            Download constitution (PDF)
          </Button>
        </Item>
      </div>
    </section>
  );
}

function Item({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group rounded-2xl border border-brand-border bg-brand-surface">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-6 py-4 text-lg font-semibold text-brand-primary [&::-webkit-details-marker]:hidden",
          FOCUS_RING,
        )}
      >
        {title}
        <ChevronDownIcon aria-hidden className="size-5 shrink-0 group-open:rotate-180" />
      </summary>
      <div className={`px-6 pb-6 ${BODY}`}>{children}</div>
    </details>
  );
}
