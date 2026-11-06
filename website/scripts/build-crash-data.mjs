// Builds the server-side crash dataset, the public downloads and the coverage report from files in ../data.
// Run with `npm run data:build`. It also runs automatically before dev, build and test.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..", "..");
const SOURCE = "data/leon-county-crashes/map/leon-county-crashes.geojson";
const PEOPLE = [
  "data/leon-county-crashes/2020/processed/2020_202412251425.csv",
  "data/leon-county-crashes/2021-q1-and-q2/processed/2021-q2_202412251115.csv",
];
const STREETS = "data/clean/all-2018to2021.csv";
const COUNTY = "data/boundaries/leon-county-2021.geojson";
const CITY = "data/boundaries/tallahassee-city-2021.geojson";
const OUT = join(here, "..", "src", "server", "crashes", "generated", "crashes.json");
const REPORT = join(repo, "data", "docs", "COVERAGE-REPORT.md");
// Public downloads: committed under data/public, and copied into the site at build time.
const PUBLIC = join(repo, "data", "public");
const SITE_DOWNLOADS = join(here, "..", "public", "downloads");

// Quarters with substantial records. Records dated outside this window are excluded from the map.
const WINDOW = { start: "2020-01-01", end: "2021-06-30" };

const readJson = (rel) => JSON.parse(readFileSync(join(repo, rel), "utf8"));

// A small RFC 4180 reader: quoted fields may hold commas, quotes ("") and line breaks.
function readCsv(rel) {
  const text = readFileSync(join(repo, rel), "utf8").replace(/^﻿/, "");
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') (field += '"'), i++;
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") row.push(field), (field = "");
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field), rows.push(row), (row = []), (field = "");
    } else field += ch;
  }
  if (field || row.length) row.push(field), rows.push(row);
  const [header, ...body] = rows.filter((r) => r.some((v) => v !== ""));
  const keys = header.map((h) => h.trim());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? "").trim()])));
}

const polygonsOf = (geojson) =>
  geojson.features.flatMap(({ geometry }) =>
    geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates,
  );

const inRing = ([x, y], ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};

// The first ring is the outer edge and any later rings are holes.
const inPolygons = (point, polygons) =>
  polygons.some(([outer, ...holes]) => inRing(point, outer) && !holes.some((h) => inRing(point, h)));

const county = polygonsOf(readJson(COUNTY));
const city = polygonsOf(readJson(CITY));
const source = readJson(SOURCE);

const ROAD_USERS = { "MOTOR VEHICLE": "motor_vehicle", PEDESTRIAN: "pedestrian", BICYCLIST: "bicyclist" };

const seen = new Set();
const crashes = [];
const excluded = { duplicate: 0, outsideWindow: 0, missingLocation: 0, outsideCounty: 0 };

for (const { properties: p, geometry } of source.features) {
  const id = String(p.report_number);
  if (seen.has(id)) {
    excluded.duplicate++;
    continue;
  }
  seen.add(id);

  const [date, time] = p.crash_date_time.split(" ");
  if (date < WINDOW.start || date > WINDOW.end) {
    excluded.outsideWindow++;
    continue;
  }

  const coords = geometry?.coordinates;
  const located = Array.isArray(coords) && Number.isFinite(coords[0]) && Number.isFinite(coords[1]);
  if (!located) {
    excluded.missingLocation++;
    continue;
  }
  if (!inPolygons(coords, county)) {
    excluded.outsideCounty++;
    continue;
  }

  crashes.push({
    id,
    date,
    time,
    severity: p.is_fatal ? "fatal" : "nonfatal",
    roadUsers: [...new Set(p.crash_types.map((t) => ROAD_USERS[t]).filter(Boolean))].sort(),
    vehicles: p.vehicles_involved,
    people: p.people_involved,
    lng: Math.round(coords[0] * 1e5) / 1e5,
    lat: Math.round(coords[1] * 1e5) / 1e5,
    inCity: inPolygons(coords, city),
  });
}

crashes.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time) || a.id.localeCompare(b.id));

const coverage = {
  start: WINDOW.start,
  end: WINDOW.end,
  source: "Florida Department of Highway Safety and Motor Vehicles (FLHSMV) crash records, Leon County",
  boundaries: "U.S. Census Bureau TIGERweb, January 1, 2021 vintage (Leon County GEOID 12073; Tallahassee city GEOID 1270600)",
  sourceRecords: source.features.length,
  excluded,
};

// People: one row per person on a crash report. Both source files overlap a little, so rows are keyed by
// report and person number. Only people on crashes kept above are used.
const kept = new Map(crashes.map((c) => [c.id, c]));
const INJURY = {
  1: "none",
  2: "possible",
  3: "non_incapacitating",
  4: "incapacitating",
  5: "fatal",
  6: "non_traffic_fatality",
};
const ROLE = { D: "driver", P: "passenger", N: "non_motorist" };
const NON_MOTORIST = {
  1: "pedestrian",
  2: "other_pedestrian",
  3: "bicyclist",
  4: "other_cyclist",
  5: "occupant_of_parked_vehicle",
  6: "non_motor_transport_device",
  7: "unknown",
};
const people = new Map();
let duplicatePeople = 0;
for (const file of PEOPLE) {
  for (const r of readCsv(file)) {
    if (!kept.has(r.report_number)) continue;
    const key = `${r.report_number}/${r.person_number}`;
    if (people.has(key)) {
      duplicatePeople++;
      continue;
    }
    people.set(key, {
      report_number: r.report_number,
      person_number: Number(r.person_number),
      vehicle_number: r.vehicle_number && r.vehicle_number !== "0" ? Number(r.vehicle_number) : "",
      role: ROLE[r.role] ?? "",
      non_motorist_type: NON_MOTORIST[r.non_motorist_description_code] ?? "",
      injury_severity: INJURY[r.injury_severity] ?? "unknown",
    });
  }
}
const personRows = [...people.values()].sort(
  (a, b) => a.report_number.localeCompare(b.report_number) || a.person_number - b.person_number,
);

// Injury counts per crash. "Killed" counts traffic deaths (code 5, within 30 days); code 6 is kept separate.
const INJURY_ORDER = ["fatal", "incapacitating", "non_incapacitating", "possible", "none"];
const injuries = new Map();
for (const p of personRows) {
  const t = injuries.get(p.report_number) ?? { fatal: 0, incapacitating: 0, non_incapacitating: 0, possible: 0, none: 0, unknown: 0, non_traffic_fatality: 0 };
  t[p.injury_severity]++;
  injuries.set(p.report_number, t);
}

// Street names come from the cleaned event file. Spacing is normalised; spelling is kept as recorded.
const tidy = (s) => (s ?? "").replace(/\s+/g, " ").trim();
const streets = new Map();
for (const r of readCsv(STREETS)) {
  if (streets.has(r.report_number)) continue;
  streets.set(r.report_number, {
    street: tidy(r.on_street_road_highway),
    number: tidy(r.street_address_number).replace(/\.0$/, ""),
    cross: tidy(r.from_intersection_of),
  });
}

const publicCrashes = crashes.map((c) => {
  const t = injuries.get(c.id);
  const s = streets.get(c.id);
  return {
    report_number: c.id,
    date: c.date,
    time: c.time,
    in_tallahassee: c.inCity,
    latitude: c.lat,
    longitude: c.lng,
    street: s?.street ?? "",
    street_number: s?.number ?? "",
    cross_street: s?.cross ?? "",
    fatal: c.severity === "fatal",
    pedestrian_involved: c.roadUsers.includes("pedestrian"),
    bicyclist_involved: c.roadUsers.includes("bicyclist"),
    vehicles: c.vehicles,
    people: c.people,
    killed: t?.fatal ?? "",
    incapacitating_injuries: t?.incapacitating ?? "",
    non_incapacitating_injuries: t?.non_incapacitating ?? "",
    possible_injuries: t?.possible ?? "",
    uninjured: t?.none ?? "",
    injury_unknown: t?.unknown ?? "",
    most_severe_injury: t ? (INJURY_ORDER.find((k) => t[k] > 0) ?? "unknown") : "",
  };
});
const inCity = new Set(crashes.filter((c) => c.inCity).map((c) => c.id));

// The site's copy: street names in title case for reading (the downloads keep them as recorded),
// and the most serious injury in the site's own words.
const KEEP_UPPER = new Set(["NE", "NW", "SE", "SW", "US", "SR", "CR", "FL", "MM", "EB", "WB", "NB", "SB", "II", "III"]);
const titleCase = (s) => s.replace(/[A-Z][A-Z']+/g, (w) => (KEEP_UPPER.has(w) ? w : w[0] + w.slice(1).toLowerCase()));
const SITE_INJURY = { fatal: "fatal", incapacitating: "serious", non_incapacitating: "minor", possible: "possible", none: "none", unknown: "unknown", "": "unknown" };
const siteCrashes = crashes.map((c, i) => {
  const p = publicCrashes[i];
  return {
    ...c,
    killed: p.killed || 0,
    seriousInjuries: p.incapacitating_injuries || 0,
    injury: SITE_INJURY[p.most_severe_injury],
    street: titleCase(p.street),
    crossStreet: titleCase(p.cross_street),
  };
});
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ coverage, crashes: siteCrashes }));

const csvCell = (v) => {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (rows) => [Object.keys(rows[0]).join(","), ...rows.map((r) => Object.values(r).map(csvCell).join(","))].join("\n") + "\n";
const toGeoJson = (rows) =>
  JSON.stringify({
    type: "FeatureCollection",
    features: rows.map(({ latitude, longitude, ...properties }) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [longitude, latitude] },
      properties,
    })),
  });

const cityCrashes = publicCrashes.filter((c) => c.in_tallahassee);
const downloads = {
  "leon-county-crashes.csv": toCsv(publicCrashes),
  "leon-county-crashes.geojson": toGeoJson(publicCrashes),
  "leon-county-people.csv": toCsv(personRows),
  "tallahassee-crashes.csv": toCsv(cityCrashes),
  "tallahassee-crashes.geojson": toGeoJson(cityCrashes),
  "tallahassee-people.csv": toCsv(personRows.filter((p) => inCity.has(p.report_number))),
};
mkdirSync(PUBLIC, { recursive: true });
for (const [name, body] of Object.entries(downloads)) writeFileSync(join(PUBLIC, name), body);
mkdirSync(SITE_DOWNLOADS, { recursive: true });
cpSync(PUBLIC, SITE_DOWNLOADS, { recursive: true });

// Coverage report
const quarterOf = (d) => `${d.slice(0, 4)} Q${Math.ceil(Number(d.slice(5, 7)) / 3)}`;
const rows = new Map();
for (const c of publicCrashes) {
  const q = quarterOf(c.date);
  const r = rows.get(q) ?? { county: 0, city: 0, fatal: 0, fatalCity: 0, killed: 0, killedCity: 0, serious: 0, ped: 0, bike: 0 };
  r.county++;
  if (c.in_tallahassee) r.city++;
  if (c.fatal) r.fatal++;
  if (c.fatal && c.in_tallahassee) r.fatalCity++;
  r.killed += c.killed || 0;
  if (c.in_tallahassee) r.killedCity += c.killed || 0;
  r.serious += c.incapacitating_injuries || 0;
  if (c.pedestrian_involved) r.ped++;
  if (c.bicyclist_involved) r.bike++;
  rows.set(q, r);
}
const sum = (k) => [...rows.values()].reduce((n, r) => n + r[k], 0);
const table = [...rows]
  .map(([q, r]) => `| ${q} | ${r.county} | ${r.city} | ${r.fatal} | ${r.fatalCity} | ${r.killed} | ${r.killedCity} | ${r.serious} | ${r.ped} | ${r.bike} |`)
  .join("\n");

const count = (pred) => publicCrashes.filter(pred).length;
const injuryTotals = Object.fromEntries(["fatal", ...INJURY_ORDER.slice(1), "unknown", "non_traffic_fatality"].map((k) => [k, personRows.filter((p) => p.injury_severity === k).length]));
const fatalAgree = count((c) => c.fatal && c.killed > 0);
const fatalFlagOnly = count((c) => c.fatal && !(c.killed > 0));
const killedNoFlag = count((c) => !c.fatal && c.killed > 0);
const noPeople = count((c) => c.killed === "");
const peopleMismatch = count((c) => c.killed !== "" && c.people !== Object.values(injuries.get(c.report_number)).reduce((a, b) => a + b, 0));
const noStreet = count((c) => !c.street);
const noCross = count((c) => !c.cross_street);

writeFileSync(
  REPORT,
  `# Coverage report

Generated by \`website/scripts/build-crash-data.mjs\`. Do not edit by hand. Rerun with \`npm run data:build\` from \`website/\`.

## Sources

- Crashes: \`${SOURCE}\` (${coverage.sourceRecords} records). ${coverage.source}.
- People: ${PEOPLE.map((f) => `\`${f}\``).join(" and ")}. One row per person on a crash report, with role and injury severity.
- Street names: \`${STREETS}\`.
- Boundaries: ${coverage.boundaries}. Files in \`data/boundaries/\`.
- Code meanings: \`data/docs/person-code-dictionary.md\` and \`data/docs/events-code-dictionary.md\`, transcribed from the crash data dictionary on a CD supplied by FLHSMV.

## Coverage window

${WINDOW.start} to ${WINDOW.end}. The source file has only scattered records before 2020, so earlier dates are excluded rather than shown as if those years were covered. Nothing after ${WINDOW.end} has been collected yet.

## Records excluded from the map and totals

| Reason | Records |
| --- | --- |
| Duplicate report number | ${excluded.duplicate} |
| Dated outside the coverage window | ${excluded.outsideWindow} |
| Missing coordinates | ${excluded.missingLocation} |
| Coordinates outside Leon County | ${excluded.outsideCounty} |

## Crashes and people by quarter

"Killed" counts people with injury severity 5 (died within 30 days). "Seriously injured" counts injury severity 4 (incapacitating).

| Quarter | Crashes (county) | Crashes (city) | Fatal crashes (county) | Fatal crashes (city) | Killed (county) | Killed (city) | Seriously injured (county) | Involving a pedestrian | Involving a bicyclist |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${table}
| **Total** | **${publicCrashes.length}** | **${sum("city")}** | **${sum("fatal")}** | **${sum("fatalCity")}** | **${sum("killed")}** | **${sum("killedCity")}** | **${sum("serious")}** | **${sum("ped")}** | **${sum("bike")}** |

## People by injury severity (Leon County)

| Injury severity (FLHSMV code) | People |
| --- | --- |
| Fatal, within 30 days (5) | ${injuryTotals.fatal} |
| Incapacitating (4) | ${injuryTotals.incapacitating} |
| Non-incapacitating (3) | ${injuryTotals.non_incapacitating} |
| Possible (2) | ${injuryTotals.possible} |
| None (1) | ${injuryTotals.none} |
| Not recorded | ${injuryTotals.unknown} |
| Non-traffic fatality (6), not counted as killed | ${injuryTotals.non_traffic_fatality} |
| **Total** | **${personRows.length}** |

## Reconciliation

- Fatal crashes that have at least one person killed in the person records: ${fatalAgree} of ${sum("fatal")}.
- Crashes flagged fatal with no person killed: ${fatalFlagOnly}. Crashes with a person killed but not flagged fatal: ${killedNoFlag}.
- Crashes with no person records: ${noPeople}. Crashes whose "people involved" count differs from their person rows: ${peopleMismatch}.
- Person rows found in both source files and counted once: ${duplicatePeople}.
- Crashes without a street name: ${noStreet}. Without a cross street: ${noCross}.

## What this data cannot show yet

- **Completeness.** Whether every quarter is complete hasn't been checked against FLHSMV totals. 2020 Q2 is noticeably lower, which is consistent with reduced travel in spring 2020 but hasn't been confirmed.
- **Injury severity before 2020.** Person-level records exist only for this window (and a separate April to June 2019 file that isn't used here).
- **City limits over time.** The 2021 city boundary is applied to all crashes.

## Public downloads

Written to \`data/public/\` and served from the site at \`/downloads/\`. See \`data/public/README.md\` for the fields and license.

## Missing periods to request

- 2021-07-01 to present (Leon County crash events, plus person-level records for fatalities and injury severity).
`,
);

console.log(
  `crash data: ${crashes.length} crashes, ${personRows.length} people, ${sum("killed")} killed; excluded ${JSON.stringify(excluded)}`,
);
