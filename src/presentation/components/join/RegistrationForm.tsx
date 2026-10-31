"use client";

import { CheckIcon } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { memberApplicationSchema } from "@/data/models/memberSchema";
import { cn } from "@/lib/cn";
import { COMMUNITIES, CONTACT_EMAIL, MEMBERSHIP_FEE_KES, MPESA_ACCOUNT, MPESA_PAYBILL, STRATHMORE_SCHOOLS } from "@/lib/constants";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";
import { ERROR_TEXT, SelectField, TextField } from "./Field";

const STEPS = ["Your details", "Communities", "Payment", "Done"] as const;

// The schema shared with the server, split by the step that collects each field.
const STEP_SCHEMAS = [
  memberApplicationSchema.pick({ fullName: true, studentId: true, email: true, phone: true, course: true, year: true }),
  memberApplicationSchema.pick({ communities: true }),
  memberApplicationSchema.pick({ mpesaCode: true }),
];

// Picked from a dropdown when the school or course is not listed; the course is then typed in.
const OTHER = "Other";

type Values = {
  fullName: string;
  school: string;
  courseChoice: string;
  studentId: string;
  email: string;
  phone: string;
  course: string;
  year: string;
  communities: string[];
  mpesaCode: string;
  website: string;
};
type FieldName = Exclude<keyof Values, "website" | "courseChoice">;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY: Values = {
  fullName: "",
  school: "",
  courseChoice: "",
  studentId: "",
  email: "",
  phone: "",
  course: "",
  year: "",
  communities: [],
  mpesaCode: "",
  website: "",
};

const firstErrors = (fieldErrors: Record<string, string[] | undefined>): Errors =>
  Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]]));

export function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");
  const [checking, setChecking] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Move focus to the new step's heading so keyboard and screen reader users start at the top of it.
  useEffect(() => {
    if (moved.current) heading.current?.focus();
    moved.current = true;
  }, [step]);

  const set = (name: keyof Values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [name]: e.target.value }));

  const courses = STRATHMORE_SCHOOLS.find((s) => s.name === values.school)?.courses ?? [];
  const typingCourse = values.school === OTHER || values.courseChoice === OTHER;

  // The school narrows the course list; changing either resets what depends on it.
  const pickSchool = (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, school: e.target.value, courseChoice: "", course: "" }));
  const pickCourse = (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, courseChoice: e.target.value, course: e.target.value === OTHER ? "" : e.target.value }));

  /** Warns before payment when the student ID is already in the sheet. If the check itself fails, carry on: the server checks again on submit. */
  async function checkRegistered(): Promise<boolean> {
    setChecking(true);
    try {
      const res = await fetch("/api/register/check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ studentId: values.studentId }),
      });
      const body = (await res.json().catch(() => ({}))) as { registered?: boolean };
      return res.ok && body.registered === true;
    } catch {
      return false;
    } finally {
      setChecking(false);
    }
  }

  function toggleCommunity(name: string) {
    setValues((v) => ({
      ...v,
      communities: v.communities.includes(name) ? v.communities.filter((c) => c !== name) : [...v.communities, name],
    }));
  }

  async function submit() {
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await res.json().catch(() => ({}))) as {
        reference?: string;
        error?: string;
        fieldErrors?: Record<string, string[]>;
      };
      if (res.ok && body.reference) {
        setReference(body.reference);
        setStep(3);
        return;
      }
      if (res.status === 400 && body.fieldErrors) {
        const next = firstErrors(body.fieldErrors);
        setErrors(next);
        const back = STEP_SCHEMAS.findIndex((s) => Object.keys(s.shape).some((k) => k in next));
        if (back >= 0) setStep(back);
      }
      setFormError(body.error ?? "Something went wrong. Please try again.");
    } catch {
      setFormError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = STEP_SCHEMAS[step].safeParse(values);
    const next: Errors = result.success
      ? {}
      : // First message per field; issues are in field order.
        Object.fromEntries([...result.error.issues].reverse().map((i) => [String(i.path[0]), i.message]));
    if (step === 0 && !values.school) next.school = "Pick your school";
    if (step === 0 && !typingCourse && !values.courseChoice) next.course = "Pick your course";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    if (step === 0) {
      const registered = await checkRegistered();
      setAlreadyRegistered(registered);
      if (registered) return;
    }
    if (step < 2) setStep(step + 1);
    else void submit();
  }

  return (
    <Card className="p-5 sm:p-8">
      <ol aria-label="Progress" className="grid grid-cols-4 gap-2">
        {STEPS.map((label, i) => (
          <li key={label} aria-current={i === step ? "step" : undefined} className="flex flex-col gap-2">
            <span className={cn("h-1.5 rounded-full", i <= step ? "bg-brand-accent" : "bg-slate-200 dark:bg-slate-700")} />
            <span
              className={cn(
                "text-xs",
                i === step ? "font-semibold text-brand-primary" : "text-slate-600 dark:text-slate-300",
              )}
            >
              <span className="sr-only sm:not-sr-only">{label}</span>
              <span className="sm:hidden" aria-hidden>
                {i + 1}
              </span>
            </span>
          </li>
        ))}
      </ol>
      <p aria-live="polite" className="sr-only">
        {`Step ${step + 1} of 4: ${STEPS[step]}`}
      </p>

      <h2 ref={heading} tabIndex={-1} className="mt-8 font-display text-display-xs font-semibold text-brand-primary focus:outline-none">
        {STEPS[step]}
      </h2>

      {step === 3 ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-md text-slate-600 dark:text-slate-300">
            We have your application. Your reference is:
          </p>
          <p className="font-mono text-display-xs font-semibold tracking-wider break-all text-brand-primary">{reference}</p>
          <p className="text-md text-slate-600 dark:text-slate-300">
            Save it. The committee matches your M-Pesa payment and confirms your membership, usually within a few days.
            Once you are confirmed, the status page shows your invite to the SCESA WhatsApp community.
          </p>
          <Button href={`/join/status?ref=${encodeURIComponent(reference)}`} size="lg" className="self-start">
            Check your status
          </Button>
        </div>
      ) : (
        <form method="post" noValidate onSubmit={onSubmit} aria-label="Membership application" className="mt-6">
          {/* Honeypot: hidden from people and assistive tech; bots that fill it are ignored. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
          </div>

          {step === 0 && (
            <div className="grid gap-5 md:grid-cols-2">
              <TextField id="fullName" label="Full name" autoComplete="name" value={values.fullName} onChange={set("fullName")} error={errors.fullName} className="md:col-span-2" />
              <TextField id="studentId" label="Strathmore student ID" inputMode="numeric" maxLength={6} placeholder="123456" value={values.studentId} onChange={set("studentId")} error={errors.studentId} />
              <TextField id="email" label="Strathmore email" type="email" autoComplete="email" placeholder="you@strathmore.edu" value={values.email} onChange={set("email")} error={errors.email} />
              <TextField id="phone" label="Phone number" type="tel" autoComplete="tel" placeholder="0712 345 678" hint="The number you will pay from." value={values.phone} onChange={set("phone")} error={errors.phone} />
              <SelectField id="school" label="School" value={values.school} onChange={pickSchool} error={errors.school}>
                <option value="">Select your school</option>
                {STRATHMORE_SCHOOLS.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
                <option value={OTHER}>Other</option>
              </SelectField>
              {values.school !== OTHER && (
                <SelectField
                  id="courseChoice"
                  label="Course"
                  value={values.courseChoice}
                  onChange={pickCourse}
                  disabled={!values.school}
                  hint={values.school ? undefined : "Pick your school first."}
                  error={typingCourse ? undefined : errors.course}
                >
                  <option value="">Select your course</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value={OTHER}>Other (not listed)</option>
                </SelectField>
              )}
              {typingCourse && (
                <TextField id="course" label="Your course" placeholder="Bachelor of …" value={values.course} onChange={set("course")} error={errors.course} />
              )}
              <SelectField id="year" label="Year of study" value={values.year} onChange={set("year")} error={errors.year}>
                <option value="">Select your year</option>
                {[1, 2, 3, 4, 5].map((y) => (
                  <option key={y} value={y}>
                    Year {y}
                  </option>
                ))}
              </SelectField>
            </div>
          )}

          {step === 1 && (
            <fieldset aria-describedby={errors.communities ? "communities-error" : undefined}>
              <legend className="text-md text-slate-600 dark:text-slate-300">
                Pick the communities you want to join. You can pick more than one.
              </legend>
              <div className="mt-4 flex flex-wrap gap-2">
                {COMMUNITIES.map((c) => {
                  const checked = values.communities.includes(c);
                  return (
                    <label
                      key={c}
                      className={cn(
                        "inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                        "has-focus-visible:ring-2 has-focus-visible:ring-brand-accent has-focus-visible:ring-offset-2 has-focus-visible:ring-offset-brand-background",
                        checked
                          ? "border-brand-primary bg-brand-primary text-brand-background"
                          : "border-brand-border bg-brand-surface text-brand-primary hover:bg-navy-25",
                      )}
                    >
                      <input type="checkbox" name="communities" value={c} checked={checked} onChange={() => toggleCommunity(c)} className="sr-only" />
                      {checked && <CheckIcon aria-hidden className="size-4" />}
                      {c}
                    </label>
                  );
                })}
              </div>
              {errors.communities && (
                <p id="communities-error" className={`mt-3 ${ERROR_TEXT}`}>
                  {errors.communities}
                </p>
              )}
            </fieldset>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-md text-slate-600 dark:text-slate-300">
                  Membership is a one-time fee. On your phone, open M-Pesa, choose Lipa na M-Pesa, then Pay Bill:
                </p>
                <dl className="mt-4 grid gap-3 rounded-xl bg-navy-25 p-4 sm:grid-cols-3">
                  {[
                    ["Business number", MPESA_PAYBILL],
                    ["Account number", MPESA_ACCOUNT],
                    ["Amount", `KES ${MEMBERSHIP_FEE_KES}`],
                  ].map(([term, value]) => (
                    <div key={term}>
                      <dt className="text-sm text-slate-600 dark:text-slate-300">{term}</dt>
                      <dd className="font-mono text-lg font-semibold break-all text-brand-primary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <TextField
                id="mpesaCode"
                label="M-Pesa confirmation code"
                autoComplete="off"
                autoCapitalize="characters"
                maxLength={12}
                placeholder="SJK4H7Q2XP"
                hint="The 10-character code at the start of the M-Pesa SMS you get after paying."
                value={values.mpesaCode}
                onChange={set("mpesaCode")}
                error={errors.mpesaCode}
                className="sm:max-w-sm"
              />
            </div>
          )}

          {step === 0 && alreadyRegistered && (
            <div role="alert" className="mt-6 rounded-lg border border-brand-border bg-navy-25 p-4 text-md text-brand-primary">
              <p className="font-semibold">This student ID is already registered.</p>
              <p className="mt-1">
                You have probably joined before.{" "}
                <a href="/join/status" className="font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
                  Check your status
                </a>{" "}
                with your reference, or email{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">
                  {CONTACT_EMAIL}
                </a>{" "}
                if you joined through the Google Form or lost your reference.
              </p>
            </div>
          )}

          {formError && (
            <p role="alert" className={cn("mt-6 rounded-lg bg-orange-50 p-3 dark:bg-slate-900", ERROR_TEXT)}>
              {formError}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {step > 0 && (
              <Button variant="outline" size="lg" onClick={() => setStep(step - 1)} disabled={submitting}>
                Back
              </Button>
            )}
            <Button type="submit" size="lg" disabled={submitting || checking}>
              {checking ? "Checking…" : step < 2 ? "Continue" : submitting ? "Submitting…" : "Submit application"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
