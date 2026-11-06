import "server-only";
import data from "./generated/crashes.json";
import { CRASH_FIELDS, type Coverage, type CrashFeature, type CrashFilters, type CrashQueryResult, type CrashSource } from "./types";

interface StoredCrash extends CrashFeature {
  inCity: boolean;
}

export function createFileSource(dataset: { coverage: Coverage; crashes: StoredCrash[] }): CrashSource {
  const matches = (c: StoredCrash, f: CrashFilters) =>
    (f.geo === "leon" || c.inCity) &&
    c.date >= f.from &&
    c.date <= f.to &&
    (f.severity === "all" ||
      (f.severity === "serious" ? c.injury === "fatal" || c.injury === "serious" : c.severity === f.severity)) &&
    (f.user === "all" || c.roadUsers.includes(f.user));

  const toPublic = (c: StoredCrash) => Object.fromEntries(CRASH_FIELDS.map((k) => [k, c[k]])) as unknown as CrashFeature;

  return {
    async getCoverage() {
      return dataset.coverage;
    },
    async queryCrashes(filters): Promise<CrashQueryResult> {
      const features = dataset.crashes.filter((c) => matches(c, filters)).map(toPublic);
      return {
        features,
        totals: {
          crashes: features.length,
          fatalCrashes: features.filter((c) => c.severity === "fatal").length,
          fatalities: features.reduce((n, c) => n + c.killed, 0),
          seriousInjuries: features.reduce((n, c) => n + c.seriousInjuries, 0),
          pedestrian: features.filter((c) => c.roadUsers.includes("pedestrian")).length,
          bicyclist: features.filter((c) => c.roadUsers.includes("bicyclist")).length,
        },
        coverage: dataset.coverage,
      };
    },
  };
}

export const fileSource = createFileSource(data as { coverage: Coverage; crashes: StoredCrash[] });
