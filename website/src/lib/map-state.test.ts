import { describe, expect, it } from "vitest";
import { defaultMapState, parseMapState, safeReturnTo, serializeMapState } from "./map-state";

const bounds = { start: "2020-01-01", end: "2021-06-30" };
const parse = (qs: string) => parseMapState(new URLSearchParams(qs), bounds);

describe("parseMapState", () => {
  it("uses defaults for an empty query", () => {
    expect(parse("")).toEqual(defaultMapState(bounds));
  });

  it("reads valid values", () => {
    expect(parse("geo=leon&from=2020-03-01&to=2020-03-31&severity=fatal&user=pedestrian&v=-84.28,30.45,12&crash=123")).toEqual({
      geo: "leon",
      from: "2020-03-01",
      to: "2020-03-31",
      severity: "fatal",
      user: "pedestrian",
      view: { lng: -84.28, lat: 30.45, z: 12 },
      crash: "123",
    });
  });

  it("falls back on invalid values instead of throwing", () => {
    const s = parse("geo=miami&from=2020-02-31&to=nope&severity=injury&user=x&v=a,b,c&crash=<script>");
    expect(s).toEqual(defaultMapState(bounds));
  });

  it("clamps dates to coverage and swaps reversed ranges", () => {
    expect(parse("from=2010-01-01&to=2030-01-01")).toMatchObject({ from: "2020-01-01", to: "2021-06-30" });
    expect(parse("from=2021-02-01&to=2020-05-01")).toMatchObject({ from: "2020-05-01", to: "2021-02-01" });
  });
});

describe("serializeMapState", () => {
  it("round-trips", () => {
    const s = parse("geo=leon&from=2020-03-01&severity=nonfatal&user=bicyclist&v=-84.2800,30.4500,12.00&crash=9");
    expect(parse(serializeMapState(s, bounds))).toEqual(s);
  });

  it("omits defaults", () => {
    expect(serializeMapState(defaultMapState(bounds), bounds)).toBe("");
  });
});

describe("safeReturnTo", () => {
  it.each([
    ["/map", "/map"],
    ["/map?severity=fatal", "/map?severity=fatal"],
  ])("keeps %s", (raw, expected) => expect(safeReturnTo(raw)).toBe(expected));

  it.each([null, "", "https://evil.example", "//evil.example", "/mapper", "/data", "/map\\@evil", "javascript:alert(1)"])(
    "rejects %s",
    (raw) => expect(safeReturnTo(raw)).toBe("/map"),
  );
});
