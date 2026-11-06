"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "@/server/requests/actions";

export interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "date" | "textarea";
  required?: boolean;
  hint?: string;
  defaultValue?: string;
  autoComplete?: string;
}

interface Props {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  fields: Field[];
  submitLabel: string;
  received: React.ReactNode;
}

export default function RequestForm({ action, fields, submitLabel, received }: Props) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" });
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const errors = state.status === "invalid" ? state.errors : {};
  const values: Record<string, string> = state.status === "invalid" ? state.values : {};

  useEffect(() => {
    if (state.status === "invalid" || state.status === "failed" || state.status === "closed") summaryRef.current?.focus();
    if (state.status === "received") doneRef.current?.focus();
  }, [state]);

  if (state.status === "received") {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="bg-accent p-6 text-accent-ink">
        {received}
      </div>
    );
  }

  const describedBy = (f: Field) => [f.hint && `${f.name}-hint`, errors[f.name] && `${f.name}-error`].filter(Boolean).join(" ") || undefined;

  return (
    <form key={JSON.stringify(values)} action={formAction} noValidate className="mt-10 max-w-[44rem] space-y-7">
      <div ref={summaryRef} tabIndex={-1} aria-live="assertive">
        {state.status === "invalid" && (
          <div className="bg-surface p-5">
            <p>Check {Object.keys(errors).length === 1 ? "this field" : `these ${Object.keys(errors).length} fields`}:</p>
            <ul className="mt-2 list-disc pl-6">
              {Object.entries(errors).map(([k, msg]) => (
                <li key={k}>
                  <a href={`#${k}`} className="text-fatal underline">{msg}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {state.status === "failed" && <p className="bg-surface p-5">Your request couldn&rsquo;t be saved. Nothing was lost on this page; please try again in a minute.</p>}
        {state.status === "closed" && <p className="bg-surface p-5">This form isn&rsquo;t accepting requests right now.</p>}
      </div>

      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="field-label">
            {f.label}
            {!f.required && <span className="text-muted"> (optional)</span>}
          </label>
          {f.hint && <p id={`${f.name}-hint`} className="mt-1 text-small text-muted">{f.hint}</p>}
          {f.type === "textarea" ? (
            <textarea id={f.name} name={f.name} rows={5} required={f.required} defaultValue={values[f.name] ?? f.defaultValue} aria-invalid={!!errors[f.name]} aria-describedby={describedBy(f)} className="field-input py-3" />
          ) : (
            <input id={f.name} name={f.name} type={f.type ?? "text"} required={f.required} defaultValue={values[f.name] ?? f.defaultValue} autoComplete={f.autoComplete} aria-invalid={!!errors[f.name]} aria-describedby={describedBy(f)} className="field-input" />
          )}
          {errors[f.name] && <p id={`${f.name}-error`} className="field-error">{errors[f.name]}</p>}
        </div>
      ))}

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="space-y-4">
        <legend className="field-label">Before you send</legend>
        {[
          { name: "terms", label: <>I agree to the <Link href="/terms" target="_blank" className="text-link">Terms of Service</Link>.</> },
          { name: "privacy", label: <>I acknowledge the <Link href="/privacy" target="_blank" className="text-link">Privacy Policy</Link> and how my request information will be used.</> },
        ].map((c) => (
          <div key={c.name}>
            <label className="flex items-start gap-3">
              <input id={c.name} name={c.name} type="checkbox" required defaultChecked={values[c.name] === "on"} aria-invalid={!!errors[c.name]} aria-describedby={errors[c.name] ? `${c.name}-error` : undefined} className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]" />
              <span>{c.label}</span>
            </label>
            {errors[c.name] && <p id={`${c.name}-error`} className="field-error">{errors[c.name]}</p>}
          </div>
        ))}
        <label className="flex items-start gap-3">
          <input name="collaboration" type="checkbox" defaultChecked={values.collaboration === "on"} className="mt-1 h-5 w-5 shrink-0 accent-[var(--ink)]" />
          <span>
            You may keep my contact details past 12 months while we work together on this. <span className="text-muted">(optional)</span>
          </span>
        </label>
      </fieldset>
      <p className="text-small text-muted">The policies open in a new tab, so nothing you&rsquo;ve typed here is lost.</p>

      <button type="submit" disabled={pending} className="button disabled:opacity-60">
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
