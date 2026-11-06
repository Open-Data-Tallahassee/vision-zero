import "server-only";
import { fileSource } from "./file";
import type { CrashSource } from "./types";

// CRASH_SOURCE picks the adapter. Only "file" exists until crash data moves to Postgres.
const source: CrashSource = fileSource;

export const getCoverage = () => source.getCoverage();
export const queryCrashes: CrashSource["queryCrashes"] = (filters) => source.queryCrashes(filters);
export type * from "./types";

export { summarizeByMonth } from "./summary";
export type { MonthSummary, MonthlyByGeography } from "./summary";
