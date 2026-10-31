"use client";

import { PartyPopperIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { statusLookupSchema } from "@/data/models/memberSchema";
import type { PaymentStatus } from "@/domain/entities/Member";
import { CONTACT_EMAIL } from "@/lib/constants";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";
import { ERROR_TEXT, TextField } from "./Field";

type Result = { status: PaymentStatus; inviteUrl?: string } | { error: string };
type Errors = { reference?: string; studentId?: string };

const MESSAGES: Record<PaymentStatus, string> = {
  pending: "We have your application and are still matching your M-Pesa payment. Check back in a day or two.",
  confirmed: "You're a SCESA member. Join the members' WhatsApp community below.",
  rejected: `We couldn't match your payment. Email ${CONTACT_EMAIL}, or apply again with the correct M-Pesa code.`,
};

export function StatusLookup({ initialReference = "" }: { initialReference?: string }) {
  const [reference, setReference] = useState(initialReference);
  const [studentId, setStudentId] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [result, setResult] = useState<Result>();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = statusLookupSchema.safeParse({ reference, studentId });
    if (!parsed.success) {
      const fieldErrors = z.flattenError(parsed.error).fieldErrors;
      setErrors({ reference: fieldErrors.reference?.[0], studentId: fieldErrors.studentId?.[0] });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const res = await fetch("/api/membership-status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => ({}))) as Partial<{ status: PaymentStatus; inviteUrl: string; error: string }>;
      setResult(res.ok && body.status ? { status: body.status, inviteUrl: body.inviteUrl } : { error: body.error ?? "Something went wrong. Please try again." });
    } catch {
      setResult({ error: "We couldn't reach the server. Check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-5 sm:p-8">
      <form method="post" noValidate onSubmit={onSubmit} aria-label="Check membership status" className="grid gap-5 md:grid-cols-2">
        <TextField
          id="reference"
          label="Reference"
          placeholder="SC-AB12CD34"
          autoCapitalize="characters"
          autoComplete="off"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          error={errors.reference}
        />
        <TextField
          id="studentId"
          label="Strathmore student ID"
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          error={errors.studentId}
        />
        <Button type="submit" size="lg" disabled={loading} className="md:col-span-2 md:justify-self-start">
          {loading ? "Checking…" : "Check status"}
        </Button>
      </form>

      <div aria-live="polite" className="mt-6">
        {result && "error" in result && <p className={ERROR_TEXT}>{result.error}</p>}
        {result && "status" in result && result.status === "confirmed" && (
          <div className="relative mt-10 rounded-2xl border border-brand-border bg-brand-background px-5 pt-14 pb-6 text-center">
            <span aria-hidden className="absolute inset-x-6 top-0 h-1 rounded-b-full bg-linear-to-r from-brand-secondary via-brand-accent to-success" />
            <span
              aria-hidden
              className="absolute top-0 left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-brand-border bg-brand-surface text-brand-accent"
            >
              <PartyPopperIcon className="size-8" />
            </span>
            <p className="font-display text-display-xs font-semibold text-brand-primary">Welcome to SCESA!</p>
            <p className="mt-2 text-md text-slate-600 dark:text-slate-300">{MESSAGES.confirmed}</p>
            {result.inviteUrl && (
              <Button href={result.inviteUrl} target="_blank" rel="noopener noreferrer" aria-label="Join the WhatsApp community (opens in a new tab)" size="lg" className="mt-6 w-full sm:w-auto">
                Join the WhatsApp community
              </Button>
            )}
          </div>
        )}
        {result && "status" in result && result.status !== "confirmed" && (
          <p className="text-md text-brand-primary">{MESSAGES[result.status]}</p>
        )}
      </div>
    </Card>
  );
}
