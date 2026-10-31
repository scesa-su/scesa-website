"use client";

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
  confirmed: "You're a SCESA member. Welcome! Join the members' WhatsApp community below.",
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
        {result && "status" in result && (
          <div className="flex flex-col gap-4">
            <p className="text-md text-brand-primary">{MESSAGES[result.status]}</p>
            {result.inviteUrl && (
              <Button href={result.inviteUrl} target="_blank" rel="noopener noreferrer" aria-label="Join the WhatsApp community (opens in a new tab)" size="lg" className="self-start">
                Join the WhatsApp community
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
