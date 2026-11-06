"use server";

import { headers } from "next/headers";
import { pathways } from "@/config/pathways";
import { getDb } from "@/server/db";
import { POLICIES_APPROVED, POLICY_VERSIONS } from "@/server/policies/versions";
import { cityRequestSchema, dataRequestSchema, deleteAfter, parseForm, type FieldErrors } from "./validation";

export type FormState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; values: Record<string, string> }
  | { status: "received" }
  | { status: "closed" }
  | { status: "failed" };

// Per-instance limit. Serverless instances don't share memory, so this only slows bursts from one address.
const recent = new Map<string, number[]>();
async function tooMany() {
  const ip = (await headers()).get("x-nf-client-connection-ip") ?? (await headers()).get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 5;
}

// React resets the form after an action, so invalid submissions send the entries back to refill it.
const valuesOf = (form: FormData) =>
  Object.fromEntries([...form.entries()].filter(([k, v]) => typeof v === "string" && !k.startsWith("$") && k !== "website")) as Record<string, string>;

const accepted = () => {
  const now = new Date();
  return {
    termsVersion: POLICY_VERSIONS.terms.version,
    privacyVersion: POLICY_VERSIONS.privacy.version,
    acceptedAt: now,
    deleteAfter: deleteAfter(now),
  };
};

export async function submitCityRequest(_: FormState, form: FormData): Promise<FormState> {
  const db = getDb();
  if (!pathways.cityRequests || !db || !POLICIES_APPROVED) return { status: "closed" };
  const parsed = parseForm(cityRequestSchema, form);
  if (!parsed.ok) return { status: "invalid", errors: parsed.errors, values: valuesOf(form) };
  if (await tooMany()) return { status: "invalid", errors: { form: "Too many requests from this connection. Try again in a few minutes." }, values: valuesOf(form) };
  const { city, email, message, collaboration } = parsed.data;
  try {
    await db.cityRequest.create({ data: { city, email, message, ongoingCollaboration: collaboration === "on", ...accepted() }, select: { id: true } });
    return { status: "received" };
  } catch (e) {
    console.error("city request failed", e instanceof Error ? e.message : e);
    return { status: "failed" };
  }
}

export async function submitDataRequest(_: FormState, form: FormData): Promise<FormState> {
  const db = getDb();
  if (!pathways.dataRequests || !db || !POLICIES_APPROVED) return { status: "closed" };
  const parsed = parseForm(dataRequestSchema, form);
  if (!parsed.ok) return { status: "invalid", errors: parsed.errors, values: valuesOf(form) };
  if (await tooMany()) return { status: "invalid", errors: { form: "Too many requests from this connection. Try again in a few minutes." }, values: valuesOf(form) };
  const { geography, dateFrom, dateTo, description, email, intendedUse, collaboration } = parsed.data;
  try {
    await db.dataRequest.create({
      data: { geography, dateFrom: new Date(dateFrom), dateTo: new Date(dateTo), description, email, intendedUse, ongoingCollaboration: collaboration === "on", ...accepted() },
      select: { id: true },
    });
    return { status: "received" };
  } catch (e) {
    console.error("data request failed", e instanceof Error ? e.message : e);
    return { status: "failed" };
  }
}
