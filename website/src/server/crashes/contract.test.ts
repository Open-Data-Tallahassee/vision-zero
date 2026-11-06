import { describe, expect, it } from "vitest";
import { createFileSource } from "./file";
import { CRASH_FIELDS, type Coverage } from "./types";

const coverage: Coverage = {
  start: "2020-01-01",
  end: "2020-12-31",
  source: "test",
  boundaries: "test",
  sourceRecords: 4,
  excluded: { duplicate: 0, outsideWindow: 0, missingLocation: 0, outsideCounty: 0 },
};

const base = { time: "12:00", vehicles: 1, people: 1, lng: -84.28, lat: 30.45 };
const source = createFileSource({
  coverage,
  crashes: [
    { ...base, id: "1", date: "2020-01-01", severity: "nonfatal", roadUsers: ["motor_vehicle"], inCity: true },
    { ...base, id: "2", date: "2020-06-30", severity: "fatal", roadUsers: ["motor_vehicle", "pedestrian"], inCity: true },
    { ...base, id: "3", date: "2020-06-30", severity: "fatal", roadUsers: ["bicyclist"], inCity: false },
    { ...base, id: "4", date: "2020-12-31", severity: "nonfatal", roadUsers: ["motor_vehicle"], inCity: false },
  ],
});

const all = { geo: "leon", from: "2020-01-01", to: "2020-12-31", severity: "all", user: "all" } as const;
const ids = async (f: Partial<typeof all> | Record<string, string>) =>
  (await source.queryCrashes({ ...all, ...f } as typeof all)).features.map((c) => c.id);

describe("crash source contract", () => {
  it("returns only allowlisted fields", async () => {
    const { features } = await source.queryCrashes(all);
    for (const f of features) expect(Object.keys(f).sort()).toEqual([...CRASH_FIELDS].sort());
  });

  it("treats both date bounds as inclusive", async () => {
    expect(await ids({ from: "2020-06-30", to: "2020-06-30" })).toEqual(["2", "3"]);
    expect(await ids({ from: "2020-01-01", to: "2020-01-01" })).toEqual(["1"]);
  });

  it("limits Tallahassee to crashes inside city limits", async () => {
    expect(await ids({ geo: "tallahassee" })).toEqual(["1", "2"]);
  });

  it("filters severity and road users", async () => {
    expect(await ids({ severity: "fatal" })).toEqual(["2", "3"]);
    expect(await ids({ severity: "nonfatal" })).toEqual(["1", "4"]);
    expect(await ids({ user: "pedestrian" })).toEqual(["2"]);
  });

  it("counts fatal crashes, and leaves fatalities unknown", async () => {
    const { totals } = await source.queryCrashes(all);
    expect(totals).toEqual({ crashes: 4, fatalCrashes: 2, fatalities: null, pedestrian: 1, bicyclist: 1 });
  });
});
