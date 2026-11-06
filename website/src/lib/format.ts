export const formatCount = (n: number | null | undefined) =>
  typeof n === "number" && Number.isFinite(n) ? n.toLocaleString("en-US") : "—";

export const formatDate = (iso: string, month: "long" | "short" = "long") =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month, day: "numeric", year: "numeric", timeZone: "UTC" });

const formatMonth = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

/** "January 2020 to June 2021" */
export const formatCoverage = ({ start, end }: { start: string; end: string }) => `${formatMonth(start)} to ${formatMonth(end)}`;
