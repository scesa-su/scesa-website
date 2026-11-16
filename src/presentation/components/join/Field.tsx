import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { FOCUS_RING_OFFSET } from "@/lib/styles";

const CONTROL =
  "h-11 w-full rounded-lg border bg-brand-surface px-3 text-md text-brand-primary placeholder:text-slate-500 dark:placeholder:text-slate-400";

// orange-700 / orange-300 keep error text above 4.5:1 on both backgrounds; the error base red does not.
export const ERROR_TEXT = "text-sm text-orange-700 dark:text-orange-300";

type FieldProps = { id: string; label: string; hint?: string; error?: string };

function describedBy(id: string, hint?: string, error?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

function FieldText({ id, hint, error }: Omit<FieldProps, "label">) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-brand-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={ERROR_TEXT}>
          {error}
        </p>
      )}
    </>
  );
}

/** Labelled input whose hint and error are linked with aria-describedby. */
export function TextField({ id, label, hint, error, className, ...props }: FieldProps & ComponentProps<"input">) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-brand-primary">
        {label}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(CONTROL, FOCUS_RING_OFFSET, error ? "border-orange-700 dark:border-orange-300" : "border-brand-border")}
        {...props}
      />
      <FieldText id={id} hint={hint} error={error} />
    </div>
  );
}

export function SelectField({ id, label, hint, error, className, children, ...props }: FieldProps & ComponentProps<"select">) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-brand-primary">
        {label}
      </label>
      <select
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={cn(CONTROL, FOCUS_RING_OFFSET, error ? "border-orange-700 dark:border-orange-300" : "border-brand-border")}
        {...props}
      >
        {children}
      </select>
      <FieldText id={id} hint={hint} error={error} />
    </div>
  );
}
