import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";
import { COMMUNITIES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { CONTAINER, FOCUS_RING } from "@/lib/styles";
import { RuledItem } from "@/presentation/components/motion/RuledItem";
import { Button } from "@/presentation/components/ui/Button";
import { SectionLabel } from "./SectionLabel";

export function CommunitiesIndex() {
  return (
    <section
      aria-labelledby="communities-title"
      className="mx-2 rounded-[2rem] bg-brand-navy py-16 text-white sm:mx-4 lg:rounded-[3rem] lg:py-28 dark:bg-slate-900"
    >
      <div className={CONTAINER}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <SectionLabel index={3} className="text-slate-300">
              Find your tribe
            </SectionLabel>
            <h2
              id="communities-title"
              className="mt-6 font-display text-display-md font-semibold text-balance lg:text-display-xl"
            >
              Communities under SCESA
            </h2>
          </div>
          <p className="text-lg text-slate-300 lg:col-span-5 lg:pb-3">
            Each community runs its own sessions. Join SCESA, pick the ones you care about and meet people building the
            same things you are.
          </p>
        </div>

        <ul className="mt-14 border-b border-white/15 lg:mt-20">
          {COMMUNITIES.map((name, i) => (
            <RuledItem key={name} ruleClassName="bg-white/15">
              <Link
                href="/join"
                className={cn(
                  "group relative isolate flex items-center gap-4 overflow-hidden py-6 transition-colors duration-500 hover:text-brand-navy focus-visible:text-brand-navy sm:gap-8 lg:py-8",
                  "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-brand-accent before:transition-transform before:duration-500 before:ease-out-expo hover:before:scale-y-100 focus-visible:before:scale-y-100",
                  FOCUS_RING,
                  "focus-visible:ring-inset",
                )}
              >
                <span aria-hidden className="w-8 shrink-0 pl-2 text-sm font-semibold text-slate-400 tabular-nums transition-colors duration-500 group-hover:text-brand-navy group-focus-visible:text-brand-navy sm:pl-4">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-display-xs font-semibold transition-transform duration-500 ease-out-expo group-hover:translate-x-3 sm:text-display-sm lg:text-display-md">
                  {name}
                  <span className="sr-only">: join SCESA to take part</span>
                </span>
                <ArrowUpRightIcon
                  aria-hidden
                  className="mr-2 ml-auto size-6 shrink-0 -rotate-45 opacity-40 transition duration-500 ease-out-expo group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100 sm:mr-4 lg:size-8"
                />
              </Link>
            </RuledItem>
          ))}
        </ul>

        <div className="mt-12 flex justify-center lg:justify-start">
          <Button
            href="/join"
            variant="soft"
            size="lg"
            className="focus-visible:ring-offset-brand-navy dark:focus-visible:ring-offset-slate-900"
          >
            Join a community
          </Button>
        </div>
      </div>
    </section>
  );
}
