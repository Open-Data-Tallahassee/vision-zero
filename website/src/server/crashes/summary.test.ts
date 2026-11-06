import { describe, expect, it } from "vitest";
import { summarizeByMonth } from "./summary";
import type { Coverage, CrashFeature } from "./types";

const coverage = { start: "2020-01-01", end: "2020-03-31" } as Coverage;
const crash = (date: string, severity: CrashFeature["severity"]) => ({ date, severity }) as CrashFeature;

describe("summarizeByMonth", () => {
  it("includes empty months and counts fatal crashes", () => {
    expect(summarizeByMonth({ coverage, features: [crash("2020-01-05", "fatal"), crash("2020-01-09", "nonfatal"), crash("2020-03-31", "nonfatal")] })).toEqual([
      { month: "2020-01", crashes: 2, fatalCrashes: 1 },
      { month: "2020-02", crashes: 0, fatalCrashes: 0 },
      { month: "2020-03", crashes: 1, fatalCrashes: 0 },
    ]);
  });
});
