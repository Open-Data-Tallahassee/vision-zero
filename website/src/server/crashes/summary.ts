import type { Geography } from "@/lib/map-state";
import type { CrashQueryResult } from "./types";

export interface MonthSummary {
  month: string; // YYYY-MM
  crashes: number;
  fatalCrashes: number;
}

/** Counts crashes and fatal crashes for every month in coverage, including months with none. */
export function summarizeByMonth({ features, coverage }: Pick<CrashQueryResult, "features" | "coverage">): MonthSummary[] {
  const months: MonthSummary[] = [];
  const byMonth = new Map<string, MonthSummary>();
  for (let d = new Date(`${coverage.start.slice(0, 7)}-01T00:00:00Z`); d.toISOString().slice(0, 7) <= coverage.end.slice(0, 7); d.setUTCMonth(d.getUTCMonth() + 1)) {
    const m = { month: d.toISOString().slice(0, 7), crashes: 0, fatalCrashes: 0 };
    months.push(m);
    byMonth.set(m.month, m);
  }
  for (const c of features) {
    const m = byMonth.get(c.date.slice(0, 7));
    if (!m) continue;
    m.crashes++;
    if (c.severity === "fatal") m.fatalCrashes++;
  }
  return months;
}

export type MonthlyByGeography = Record<Geography, MonthSummary[]>;
