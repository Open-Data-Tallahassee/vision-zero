// Builds the site's crash dataset from the published files in ../data/public, and copies those files into the
// site so they can be downloaded. It reads nothing else: what the site shows is exactly what people can download.
// Run with `npm run data:build`. It also runs automatically before dev, build and test.
// To change the published files themselves, run `npm run data:prepare` (prepare-data.mjs) on your own machine.
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, "..", "..", "data", "public");
const OUT = join(here, "..", "src", "server", "crashes", "generated", "crashes.json");
const SITE_DOWNLOADS = join(here, "..", "public", "downloads");

// The published CSV is written by prepare-data.mjs: no field holds a comma, quote or line break except street
// names, which are quoted. This reads that shape.
function readCsv(file) {
  const [header, ...lines] = readFileSync(file, "utf8").trimEnd().split("\n");
  const keys = header.split(",");
  return lines.map((line) => {
    const values = [];
    for (let i = 0; i < line.length; ) {
      if (line[i] === '"') {
        let v = "";
        for (i++; i < line.length; i++) {
          if (line[i] === '"' && line[i + 1] === '"') (v += '"'), i++;
          else if (line[i] === '"') break;
          else v += line[i];
        }
        values.push(v);
        i += 2;
      } else {
        const end = line.indexOf(",", i);
        values.push(line.slice(i, end === -1 ? undefined : end));
        i = end === -1 ? line.length + 1 : end + 1;
      }
    }
    if (line.endsWith(",")) values.push("");
    return Object.fromEntries(keys.map((k, n) => [k, values[n] ?? ""]));
  });
}

// Street names in title case for reading; the downloads keep them as recorded.
const KEEP_UPPER = new Set(["NE", "NW", "SE", "SW", "US", "SR", "CR", "FL", "MM", "EB", "WB", "NB", "SB", "II", "III"]);
const titleCase = (s) => s.replace(/[A-Z][A-Z']+/g, (w) => (KEEP_UPPER.has(w) ? w : w[0] + w.slice(1).toLowerCase()));
const INJURY = { fatal: "fatal", incapacitating: "serious", non_incapacitating: "minor", possible: "possible", none: "none", unknown: "unknown", "": "unknown" };

const coverage = JSON.parse(readFileSync(join(PUBLIC, "coverage.json"), "utf8"));
const crashes = readCsv(join(PUBLIC, "leon-county-crashes.csv")).map((r) => ({
  id: r.report_number,
  date: r.date,
  time: r.time,
  severity: r.fatal === "true" ? "fatal" : "nonfatal",
  roadUsers: [
    r.bicyclist_involved === "true" && "bicyclist",
    r.motor_vehicle_involved === "true" && "motor_vehicle",
    r.pedestrian_involved === "true" && "pedestrian",
  ].filter(Boolean),
  vehicles: Number(r.vehicles),
  people: Number(r.people),
  killed: Number(r.killed) || 0,
  seriousInjuries: Number(r.incapacitating_injuries) || 0,
  injury: INJURY[r.most_severe_injury],
  street: titleCase(r.street),
  crossStreet: titleCase(r.cross_street),
  lng: Number(r.longitude),
  lat: Number(r.latitude),
  inCity: r.in_tallahassee === "true",
}));

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify({ coverage, crashes }));
mkdirSync(SITE_DOWNLOADS, { recursive: true });
cpSync(PUBLIC, SITE_DOWNLOADS, { recursive: true });

console.log(`crash data: ${crashes.length} crashes from data/public, ${crashes.reduce((n, c) => n + c.killed, 0)} killed`);
