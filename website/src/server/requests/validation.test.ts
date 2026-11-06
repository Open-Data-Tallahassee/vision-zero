import { describe, expect, it } from "vitest";
import { cityRequestSchema, dataRequestSchema, deleteAfter, parseForm } from "./validation";

const form = (o: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(o)) f.set(k, v);
  return f;
};

describe("city requests", () => {
  it("accepts a city with no email", () => {
    const r = parseForm(cityRequestSchema, form({ city: "Gainesville", email: "", terms: "on", privacy: "on" }));
    expect(r).toMatchObject({ ok: true, data: { city: "Gainesville", email: undefined } });
  });

  it("requires both policy checkboxes", () => {
    const r = parseForm(cityRequestSchema, form({ city: "Gainesville" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["privacy", "terms"]);
  });

  it("rejects a filled honeypot and a bad email", () => {
    const r = parseForm(cityRequestSchema, form({ city: "Ocala", email: "nope", terms: "on", privacy: "on", website: "spam" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "website"]);
  });
});

describe("data requests", () => {
  const valid = { geography: "Leon County", dateFrom: "2020-01-01", dateTo: "2020-12-31", description: "Pedestrian crashes near schools", email: "a@example.org", terms: "on", privacy: "on" };

  it("accepts a complete request", () => {
    expect(parseForm(dataRequestSchema, form(valid)).ok).toBe(true);
  });

  it("rejects reversed dates and a missing email", () => {
    const r = parseForm(dataRequestSchema, form({ ...valid, dateFrom: "2021-01-01", email: "" }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["dateTo", "email"]);
  });
});

it("schedules deletion 12 months after submission", () => {
  expect(deleteAfter(new Date("2026-11-06T10:00:00Z")).toISOString()).toBe("2027-11-06T10:00:00.000Z");
});
