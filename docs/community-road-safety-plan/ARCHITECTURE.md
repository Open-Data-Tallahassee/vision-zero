# Architecture

Status: proposed target architecture for the approved plan. Nothing here is implemented yet. Work through it with [IMPLEMENTATION-CHECKLIST.md](IMPLEMENTATION-CHECKLIST.md). Product decisions live in [README.md](README.md), journeys in [USER-FLOWS.md](USER-FLOWS.md), database setup in [NEON-PRISMA.md](NEON-PRISMA.md), and policy rules in [POLICY-REQUIREMENTS.md](POLICY-REQUIREMENTS.md).

## Where the code stands today

These facts come from reading the source. They explain why the architecture changes what it does.

| Area | Today | Problem |
| --- | --- | --- |
| Data source | `website/src/utils/fetchMapData.ts` queries the ArcGIS `Leon_County_Crash_Data` FeatureServer with `outFields=*` | Every field reaches the browser. The approved rule allows only permitted crash-level fields and aggregate injury counts. |
| Secrets | ArcGIS token read from `NEXT_PUBLIC_ARCGIS_TOKEN` | The `NEXT_PUBLIC_` prefix means Next.js may bundle it into client code. It also appears in request URLs. |
| Data loading | `website/src/app/page.tsx` loads all of 2020 Q1–2021 Q2 and passes the whole GeoJSON as props to a client component | Large payload. No server-side filtering. The date range is hardcoded. |
| Side effect | `combineYearQuarterData.ts` calls itself at import time | Fetches again whenever the module loads. |
| Severity | `mapConfig.ts` treats "INJURY" as `is_fatal = 0` | A nonfatal crash is not necessarily an injury crash. |
| State | Filters live in `useState` inside `CrashMap.tsx` | Filters can't be shared as links and are lost when the visitor leaves the map. |
| Labels | "Data updated as of 06/2023" and May–June 2021 default dates are hardcoded | They don't reflect actual coverage. |
| Navigation | "GET CRASH DATA" and "GET FATALITY DATA" link to `/` | The links are dead. Downloads are out of scope anyway. |
| Hosting | Live at https://visionzero.opentlh.com/, deployed to Netlify (`@netlify/plugin-nextjs` installed) | No problem. An old `vision-zero-tlh.vercel.app` copy may still exist; retire it if it's unused. |
| SEO | `layout.tsx` sets one title and description. `openGraph.url` points to `vision-zero-tlh.vercel.app`, and the 500×500 S3 logo is the share image. There's no `metadataBase`, canonical URL, `robots.ts` or `sitemap.ts`. | Shared links and search results point at the wrong domain. Every page has the same title, and the map content isn't readable by crawlers. |
| Favicon | `src/app/favicon.ico` is the default create-next-app icon (25,931 bytes). `public/` still holds the starter SVGs (`vercel.svg`, `next.svg` and others), and `src/app/get-our-data/` is an empty folder. | Browser tabs show the Next.js logo. There's no Apple touch icon or web manifest. |
| Local data | `data/clean/all-2018to2021.*` (no severity fields), `data/leon-county-crashes/` (2020, 2021 Q1–Q2), notebooks in `data/scripts/` | Coverage, severity and person counts come from different files that haven't been reconciled. |

## Target system

```
  data/ (raw FLHSMV files, notebooks)             ArcGIS FeatureServer (interim)
            │                                              │
            ▼                                              │
  scripts/import  ──writes──▶  Neon Postgres  ◀──Prisma──┐ │
  (reproducible,               crash, coverage_period,   │ │
   logs import_run)            boundary, import_run,     │ │
                               city_request,             │ │
                               data_request              │ │
                                                         │ ▼
                          website/src/server/  (server-only modules)
                          ├─ crashes/   queryCrashes(filters) → { features, totals, coverage }
                          ├─ requests/  createCityRequest / createDataRequest
                          ├─ policies/  current Terms + Privacy versions
                          └─ db.ts      Prisma client (PrismaNeon adapter)
                                         │
             ┌───────────────────────────┼─────────────────────────────┐
             ▼                           ▼                             ▼
   Server components               Route handler                 Server actions
   (overview, data pages)          GET /api/crashes?…            (request forms)
                                   allowlisted fields only
                                         │
                                         ▼
                        Client: Explorer (Mapbox GL + results list)
                        state = URL search params (lib/map-state)
```

### Principles

1. **Everything goes through `queryCrashes`.** It is the only place that knows where crash data comes from. Pages and components never call ArcGIS or Prisma directly. The source can then switch from ArcGIS to Postgres without touching the UI.
2. **Field allowlist at the server boundary.** `queryCrashes` returns a fixed DTO, and every other field is dropped. The allowlist lives in one file and is reviewed before launch.
3. **The URL is the map state.** Geography, dates, severity, road user, viewport and selected crash are search params. One module parses, validates and serializes them. Return links and shared links use it too.
4. **Private data stays on the server.** Request records, emails and consent records are written by server actions and never read by a public endpoint.
5. **The app takes no payments.** Donations link out to an external provider. A return page shows status only when the provider has confirmed it.
6. **Each pathway can be switched off.** City requests, data requests and donations each have a flag. When a flag is off, the page says the pathway isn't open yet and doesn't show a form.

## Modules

### `src/lib/map-state.ts` (shared, no server imports)

```ts
type Geography = "tallahassee" | "leon";
type Severity = "all" | "fatal" | "nonfatal";   // "injury" only after severity codes are validated
type RoadUser = "all" | "pedestrian" | "bicyclist" | "motor_vehicle";

interface MapState {
  geo: Geography;
  from: string;           // YYYY-MM-DD, clamped to coverage
  to: string;
  severity: Severity;
  user: RoadUser;
  view?: { lng: number; lat: number; z: number };
  crash?: string;         // permitted public crash id
}

parseMapState(params: URLSearchParams, coverage: Coverage): MapState  // invalid → defaults, never throws
serializeMapState(state: MapState): string
safeReturnTo(raw: string | null): string  // same-origin /map?… only, else "/map"
```

### `src/server/crashes/` (server-only)

```ts
interface CrashFeature {   // the public DTO; nothing else leaves the server
  id: string;
  date: string;            // local date/time
  severity: "fatal" | "nonfatal" | "unknown";
  roadUsers: RoadUser[];
  fatalities: number | null;   // people killed, after person counts are validated
  injuries: number | null;     // aggregate count only
  street?: string; crossStreet?: string;
  lng: number; lat: number;
}

interface CrashQueryResult {
  features: CrashFeature[];        // mapped crashes inside the geography
  totals: { crashes: number; fatalCrashes: number; fatalities: number | null; unmapped: number };
  coverage: Coverage;              // periods available, known gaps, refresh date, boundary source
}

queryCrashes(filters: MapState): Promise<CrashQueryResult>
getCoverage(): Promise<Coverage>
```

Two adapters sit behind it: `arcgis.ts` (interim, token server-side, explicit `outFields`) and `postgres.ts` (after the import is reconciled). A single env variable, `CRASH_SOURCE=arcgis|postgres`, picks one. Both adapters have to pass the same contract tests.

### `src/server/requests/` and `src/server/policies/`

- `createCityRequest(input)` and `createDataRequest(input)` validate with zod. They require both policy checkboxes, record `termsVersion`, `privacyVersion` and `acceptedAt`, set `deleteAfter = submittedAt + 12 months`, and return `{ ok, errors }`. A honeypot field and a per-IP rate limit block spam.
- `policies/versions.ts` exports the current Terms and Privacy version strings. Policy pages import and display the same constants.
- `scripts/retention.ts` (`npm run retention:purge`) deletes expired contact fields, free text and acceptance records. It keeps records with `ongoingCollaboration = true` and leaves anonymous city counts.

### Feature flags

`src/config/pathways.ts` reads `ENABLE_CITY_REQUESTS`, `ENABLE_DATA_REQUESTS` and `DONATION_URL` (no URL means donations are off). These are server-side env variables.

## Data model (Prisma, proposed)

```prisma
model Crash {
  id            String   @id            // report_number or a derived public id
  occurredAt    DateTime
  severity      Severity                // FATAL | NONFATAL | UNKNOWN
  roadUsers     RoadUser[]
  fatalities    Int?
  injuries      Int?
  street        String?
  crossStreet   String?
  lng           Float?
  lat           Float?
  inCityLimits  Boolean?                // null = could not be determined
  inLeonCounty  Boolean
  importRunId   String
  @@index([occurredAt])
  @@index([inCityLimits, occurredAt])
}

model CoveragePeriod { id String @id @default(cuid()) start DateTime end DateTime complete Boolean note String? importRunId String }
model Boundary       { id String @id name String source String vintage String geojson Json }
model ImportRun      { id String @id @default(cuid()) startedAt DateTime sourceFiles Json counts Json notes String? }

model CityRequest {
  id String @id @default(cuid())
  city String
  email String?
  message String?
  ongoingCollaboration Boolean @default(false)
  status RequestStatus @default(NEW)
  termsVersion String
  privacyVersion String
  acceptedAt DateTime
  submittedAt DateTime @default(now())
  deleteAfter DateTime
}

model DataRequest {
  id String @id @default(cuid())
  geography String
  dateFrom DateTime
  dateTo DateTime
  description String
  email String
  intendedUse String?
  ongoingCollaboration Boolean @default(false)
  status RequestStatus @default(NEW)
  termsVersion String
  privacyVersion String
  acceptedAt DateTime
  submittedAt DateTime @default(now())
  deleteAfter DateTime
}
```

Raw person-level records never go into this database. The import step reduces them to the `fatalities` and `injuries` counts on each crash. Use PostGIS only if point-in-boundary checks become too slow in the import script. For roughly 40k crashes, computing the boundary flags at import time is enough.

## Routes

| Route | Type | Purpose |
| --- | --- | --- |
| `/` | Server component | Overview: purpose, verified coverage, headline counts, **Explore the map** |
| `/map` | Server shell + client explorer | Map, list, filters, totals, coverage panel; state in URL |
| `/api/crashes` | Route handler | `queryCrashes` for client-side filter changes; cache headers per coverage refresh |
| `/data` | Server component | Methodology, with anchors `#crashes-vs-people`, `#fatal`, `#coverage`, `#missing-locations`, `#limitations` |
| `/data/request` | Server action form | Data request, prefilled from `?returnTo=` map state |
| `/cities/request` | Server action form | Florida city request |
| `/support` | Server component | Missing data, funding use, recipient, donate link if enabled |
| `/support/return` | Server component | Confirmed / pending / canceled donation messaging and **Return to your map** |
| `/about`, `/privacy`, `/terms` | Static | Footer pages; policy pages show version and effective date |

Delete the old Navbar download links. The main navigation is **Explore the map · Understand the data · Request a Florida city · Support the work**.

## Explorer component structure

```
app/map/page.tsx (server: getCoverage, initial queryCrashes from searchParams)
└─ Explorer (client)
   ├─ useMapState()  ← reads/writes URL via router.replace, debounced
   ├─ FilterPanel    (geo, dates, severity with Fatal prominent, road user, Reset)
   ├─ SummaryBar     (crashes, fatal crashes, fatalities, unmapped; "About these numbers")
   ├─ CrashMapView   (Mapbox; one source, data replaced with setData; cleanup on unmount)
   ├─ ResultsList    (accessible list/table, same data as map; Map/List toggle on phones)
   ├─ CrashDetail    (selected crash; links to definitions)
   └─ CoverageNote   (periods, gaps, outside-coverage state, city-request + support links)
```

Loading, empty, error and outside-coverage states each get their own component and wording.

## SEO and icons

People will search for things like "Tallahassee traffic crashes", "Leon County fatal crashes" and "Vision Zero Tallahassee". The map is drawn by client-side JavaScript, so it contributes no searchable text. Search ranking will come from server-rendered text on the overview and `/data` pages.

### Metadata (Next.js Metadata API)

- **Root `layout.tsx`:**
  - Set `metadataBase: new URL("https://visionzero.opentlh.com")`.
  - Use the title template `"%s · Vision Zero Tallahassee"`, with "Vision Zero Tallahassee" as the default title.
  - Set a default description, `openGraph` (`siteName`, `locale: "en_US"`) and `twitter: { card: "summary_large_image" }`.
  - Remove the hardcoded vercel.app URL.
- **Each page** exports its own `metadata` or `generateMetadata` with a specific title, a description of about 150 characters, and `alternates.canonical`.

| Route | Title | Index? |
| --- | --- | --- |
| `/` | Vision Zero Tallahassee: traffic crash map and data | yes |
| `/map` | Tallahassee crash map | yes; canonical `/map` without filter params |
| `/data` | Understanding Tallahassee crash data | yes |
| `/cities/request` | Request a crash map for your Florida city | yes |
| `/data/request` | Request crash data | yes |
| `/support` | Support updated crash data | yes |
| `/about`, `/privacy`, `/terms` | as named | yes |
| `/support/return`, request confirmation states | — | `noindex` |

- **Filtered map URLs** can produce endless variations, so every `/map?…` page uses `/map` as its canonical URL. The shared link still opens the right view.
- **Deploy previews must not be indexed.** In `robots.ts`, disallow everything unless Netlify's `CONTEXT` is `production`. Also add `X-Robots-Tag: noindex` for non-production contexts in `netlify.toml`.
- **Numbers in descriptions** (for example "crashes 2020–2021") come from `getCoverage()`, so they stay accurate after data updates.

### Files

| File | Purpose |
| --- | --- |
| `src/app/robots.ts` | Allow everything in production, point to the sitemap, disallow `/api/`. Disallow everything elsewhere. |
| `src/app/sitemap.ts` | Static indexable routes only, with `lastModified` from the coverage refresh date for `/`, `/map` and `/data`. |
| `src/app/opengraph-image.tsx` | 1200×630 share image built with `next/og`: name, tagline, coverage dates. Pages can override it; for example, `/map` can show the map view. |
| `src/app/manifest.ts` | Name, short name, `theme_color` and `background_color` from the design tokens, plus 192 and 512 icons. |
| `src/components/JsonLd.tsx` | JSON-LD `Organization` (Open Tallahassee) and `WebSite` on `/`. Don't use `Dataset` markup with a `distribution`, because there are no public downloads. |

### Favicon set

Design one simple mark in the Phase 5 direction. The current logo is too detailed to read at 16px, so it may need a simplified version.

| File (in `src/app/`) | Spec |
| --- | --- |
| `favicon.ico` | 16, 32 and 48px, for older browsers and search results |
| `icon.svg` | Scalable mark. It can include `@media (prefers-color-scheme: dark)` so it stays visible on dark tabs. |
| `apple-icon.png` | 180×180, solid background, no transparency |
| `icon-192.png`, `icon-512.png` | Manifest icons. Make the 512 maskable, with the mark inside the center 80%. |

Next.js generates the `<link>` tags from these file names, so no manual `<head>` tags are needed. Delete the starter SVGs in `public/` and the empty `get-our-data/` folder.

### Performance (affects ranking)

- Load Mapbox GL only on `/map`, using a dynamic import inside the explorer, so the overview stays light.
- Load fonts with `next/font` (already used).
- Put real text and the headline counts first on the overview so they're the largest element on screen (LCP).
- Give every image a width and height.

Hosting is Netlify, served at https://visionzero.opentlh.com/. Set variables in the Netlify site settings (Site configuration › Environment variables), scoped by deploy context: Production gets the Neon `production` branch, and Deploy Previews get a Neon dev branch so preview forms never write to production. Server actions and route handlers run as Netlify Functions, so Prisma must use the `PrismaNeon` adapter with the pooled URL. `netlify.toml` should set the build base to `website/`. Monthly retention can run as a Netlify Scheduled Function or by hand. Choose one in Phase 7.7.

| Variable | Scope | Notes |
| --- | --- | --- |
| `DATABASE_URL` | server | Neon pooled connection |
| `DATABASE_URL_UNPOOLED` | server/CLI | Migrations only |
| `ARCGIS_TOKEN` | server | Replaces `NEXT_PUBLIC_ARCGIS_TOKEN`. Rotate the old token after the switch. |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | public | Mapbox tokens are meant to be public. In the Mapbox dashboard, restrict this one to `visionzero.opentlh.com`, Netlify deploy-preview URLs and `localhost`. Rename from `NEXT_PUBLIC_REACT_APP_MAPBOX_TOKEN`. |
| `CRASH_SOURCE` | server | `arcgis` or `postgres` |
| `ENABLE_CITY_REQUESTS`, `ENABLE_DATA_REQUESTS` | server | Pathway flags |
| `DONATION_URL` | server | Provider link. Leaving it unset turns donations off. |

Keep `website/.env.example` with names only.

## Testing

- **Unit (Vitest):** `map-state` parse/serialize round-trips, invalid params, `safeReturnTo` rejecting off-site URLs; severity mapping; request validation.
- **Contract:** one test suite run against both crash adapters with fixture data: field allowlist, date boundaries (inclusive end day), fatal vs fatalities, unmapped counted separately.
- **Integration:** request server actions against a Neon dev branch; retention script on synthetic expired rows.
- **End-to-end (Playwright):** the seven walkthroughs in USER-FLOWS.md, at phone width and keyboard-only.
- **Payload check:** a test asserts that the `/api/crashes` response keys equal the allowlist.

## Open decisions that block specific steps

| Decision | Blocks |
| --- | --- |
| Whether to retire the old Vercel deployment | Nothing; housekeeping |
| Authoritative city-limits boundary file and vintage | Tallahassee default view |
| Which file holds validated severity and person counts | "Injury" filter, fatalities total |
| Donation recipient and provider | `/support` donate button |
| Request operator and inbox | Turning on request flags |
| Policy publisher and contact | `/privacy`, `/terms` publication |
| Final logo mark for the favicon | Favicon set (a placeholder icon can ship in Phase 1) |
| Who owns Google Search Console for the domain | Sitemap submission, indexing checks |
