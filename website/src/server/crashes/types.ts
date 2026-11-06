import type { MapState } from "@/lib/map-state";

/** The public crash record. Nothing else about a crash leaves the server. */
export interface CrashFeature {
  id: string;
  date: string; // YYYY-MM-DD, local
  time: string; // HH:MM, local
  severity: "fatal" | "nonfatal";
  roadUsers: ("bicyclist" | "motor_vehicle" | "pedestrian")[];
  vehicles: number;
  people: number;
  lng: number;
  lat: number;
}

export const CRASH_FIELDS = ["id", "date", "time", "severity", "roadUsers", "vehicles", "people", "lng", "lat"] as const satisfies readonly (keyof CrashFeature)[];

export interface Coverage {
  start: string;
  end: string;
  source: string;
  boundaries: string;
  sourceRecords: number;
  excluded: { duplicate: number; outsideWindow: number; missingLocation: number; outsideCounty: number };
}

export interface CrashTotals {
  crashes: number;
  fatalCrashes: number;
  /** People killed. Null until person-level records are reconciled. */
  fatalities: number | null;
  pedestrian: number;
  bicyclist: number;
}

export interface CrashQueryResult {
  features: CrashFeature[];
  totals: CrashTotals;
  coverage: Coverage;
}

export type CrashFilters = Pick<MapState, "geo" | "from" | "to" | "severity" | "user">;

export interface CrashSource {
  getCoverage(): Promise<Coverage>;
  queryCrashes(filters: CrashFilters): Promise<CrashQueryResult>;
}
