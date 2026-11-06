import { z } from "zod";

const checked = (message: string) => z.literal("on", { error: message });
const optionalText = (max: number) =>
  z.string().trim().max(max, `Keep this under ${max} characters.`).transform((v) => v || undefined).optional();
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a date.");

const common = {
  terms: checked("Agree to the Terms of Service to send this request."),
  privacy: checked("Acknowledge the Privacy Policy to send this request."),
  collaboration: z.literal("on").optional(),
  // Honeypot: hidden from people, often filled by bots.
  website: z.string().max(0).optional(),
};

export const cityRequestSchema = z.object({
  city: z.string().trim().min(2, "Enter a Florida city or county.").max(100, "Keep this under 100 characters."),
  email: z.union([z.literal(""), z.email("Enter a valid email address, or leave it empty.")]).optional().transform((v) => v || undefined),
  message: optionalText(2000),
  ...common,
});

export const dataRequestSchema = z
  .object({
    geography: z.string().trim().min(2, "Enter the city, county or area.").max(120, "Keep this under 120 characters."),
    dateFrom: date,
    dateTo: date,
    description: z.string().trim().min(10, "Describe the information you need in a sentence or two.").max(2000, "Keep this under 2,000 characters."),
    email: z.email("Enter an email address so we can reply."),
    intendedUse: optionalText(1000),
    ...common,
  })
  .refine((v) => v.dateFrom <= v.dateTo, { path: ["dateTo"], message: "The end date must be on or after the start date." });

export type FieldErrors = Record<string, string>;

export function parseForm<T extends z.ZodType>(schema: T, form: FormData): { ok: true; data: z.infer<T> } | { ok: false; errors: FieldErrors } {
  const raw = Object.fromEntries([...form.entries()].filter(([, v]) => typeof v === "string"));
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, data: result.data };
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return { ok: false, errors };
}

export const deleteAfter = (from: Date) => {
  const d = new Date(from);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d;
};
