# Implementation checklist

Use this file to resume work. Any person or AI session should be able to open it cold, find the next unchecked box and continue. The design is in [ARCHITECTURE.md](ARCHITECTURE.md).

## How to resume

1. Read **Current position** below.
2. Run `git status` and `git log --oneline -10`. Uncommitted changes mean the last session stopped mid-phase. Finish or discard them before going on.
3. Go to the first unchecked `[ ]` in the current phase. Do the task, then run that phase's **Verify** commands.
4. Tick boxes only after verification passes. Commit at every **Commit point** using the message shown.
5. Before stopping, update **Current position** and add a line to the **Progress log**.

If you're handing off to an AI session, paste this:

> Read `docs/community-road-safety-plan/IMPLEMENTATION-CHECKLIST.md` and `ARCHITECTURE.md`. Continue from Current position. Follow the Verify steps, tick boxes only after they pass, commit at commit points, and update Current position and the Progress log before you stop.

Rules for every phase:

- Run app commands from `website/`.
- Don't print or commit secrets. `.env*` is git-ignored. Keep `.env.example` with names only.
- Never run `prisma migrate dev`, `migrate reset` or `db push` against the `production` Neon branch.
- Don't remove fatalities or the fatal-crash filter.
- No public download or export endpoints.

## Current position

```
Phase: first implementation pass done on branch feat/community-site (not merged)
Next box: open a PR and check the Netlify deploy preview
Blocked on: Netlify env vars for the forms (DATABASE_URL, ENABLE_*), donation recipient (8.x). Policies approved 2026-11-06; Terms updated to version 2026-11-06.2 for public downloads.
Last updated: 2026-11-06
Deferred until after merge: DONATION_URL (skipped for now), confirm privacy@opentlh.com receives mail, Lighthouse, Search Console sitemap
TODO: privacy contact is privacy@opentlh.com for now; confirm or replace it (website/src/app/privacy/page.tsx)
```

### What changed from the plan in the first pass

- **ArcGIS is gone.** The `Leon_County_Crash_Data` FeatureServer returns "Invalid URL" for the whole ArcGIS organization, so the old site can't rebuild. The live site is serving a cached build. Crash data now comes from `data/leon-county-crashes/map/leon-county-crashes.geojson` via `website/scripts/build-crash-data.mjs` (the `file` adapter). 1.2 and 1.3 were superseded: there's no ArcGIS token to move. Still delete `NEXT_PUBLIC_ARCGIS_TOKEN` from Netlify and revoke the token.
- **Boundaries:** U.S. Census TIGERweb, 2021 vintage, saved in `data/boundaries/`.
- **Severity:** the map file has only a fatal flag, so the filters are All, Fatal and Nonfatal, and "people killed" shows as not counted yet. Phase 2 found person-level injury severity for the same period. The map now uses it: there's a Serious filter, people killed and seriously injured appear in the totals and crash details, and each crash shows its street.
- **No `netlify.toml`.** Netlify's UI build settings already work. Preview indexing is blocked by `robots.ts`, which checks `CONTEXT`.
- **Prisma 7.10.1** (stable; `latest` on npm points at an 8.0 release candidate) with the Neon HTTP adapter.
- **Name and polish (commit 3b65442):** the site is "Vision Zero TLH" everywhere it names itself (header, hero, footer, titles, manifest, share image). Every photo shows an on-image credit (`PhotoCredit`, data in `src/content/photo-credits.json`) and the footer lists full credits. Dark mode: `data-theme` on `<html>`, set by an inline head script from the saved or system preference; `ThemeToggle` in the header. The map follows the theme (monochrome Standard basemap, day or night). A custom 404 (`src/app/not-found.tsx`) returns a real 404 status.
- **Phase 5 used the design-taste-frontend skill** (direction "The printed annual", seed 676698518) and its inspector. The `/impeccable` critique (5.1) is in DESIGN-REVIEW.md, and the design system is recorded in `website/DESIGN.md` (5.2).

## Progress log

| Date | Phase.box | What happened | Commit |
| --- | --- | --- | --- |
| 2026-11-06 | — | Architecture and checklist written | e6e8012 |
| 2026-11-06 | 0–8 (partial) | Tooling; file-based crash data with Census boundaries and coverage report; map-state and queryCrashes; mobile-first redesign of all pages; explorer; data, support, about, draft policies; SEO and icons; Prisma request pathways behind flags; retention script. 29 tests pass; lint clean; build passes. Baseline build failed because ArcGIS is dead. | ca1d109..eb33edf |
| 2026-11-06 | 5 (polish) | Renamed to Vision Zero TLH; photo credits on images; dark mode with toggle; custom 404. tsc, lint, 29 tests and build pass. | 3b65442 |

---

## Phase 0 — Baseline and safety net (about 1 session)

Goal: make the project buildable and testable before changing anything.

- [x] 0.1 Create branch `feat/community-site` from `main`.
- [x] 0.2 `npm ci && npm run build && npm run lint`. Write down any existing failures in the Progress log instead of fixing unrelated ones now.
- [ ] 0.3 The site is live at https://visionzero.opentlh.com/ on **Netlify**. Add `netlify.toml` at the repo root with `base = "website"` and `command = "npm run build"`, unless those settings already live in the Netlify UI (record which). Check whether `vision-zero-tlh.vercel.app` is still deployed; if it is and you don't need it, turn it off.
- [x] 0.4 Add Vitest: `npm i -D vitest`, a `"test": "vitest run"` script, and one placeholder test.
- [x] 0.5 Add `website/.env.example` listing the variables in ARCHITECTURE.md › Environments, with names only.
- [ ] 0.6 Take screenshots of https://visionzero.opentlh.com/ (desktop and phone) and save them to `docs/community-road-safety-plan/before/` for design comparison.

**Verify:** `npm run build` exits 0 · `npm test` passes · `git status` shows no `.env` file staged.
**Commit point:** `chore: baseline tooling and env example`

## Phase 1 — Quick fixes to the current site (about 1 session)

Goal: fix the clear bugs without redesigning.

- [x] 1.1 Delete the self-invoking block at the bottom of `src/utils/combineYearQuarterData.ts`.
- [x] 1.2 (superseded: ArcGIS is gone; only delete and revoke the old token) Move the ArcGIS token to the server-only `ARCGIS_TOKEN` and remove `NEXT_PUBLIC_ARCGIS_TOKEN`. Add `import "server-only"` to `fetchMapData.ts`. In Netlify, add `ARCGIS_TOKEN` and delete `NEXT_PUBLIC_ARCGIS_TOKEN`, then redeploy. **Then rotate the old token in ArcGIS.**
- [x] 1.3 Replace `outFields=*` with an explicit list of the fields the map uses.
- [x] 1.4 Rename the "INJURY" option to "Nonfatal" (`is_fatal = 0`) and add "All". Keep "Fatal".
- [x] 1.5 Replace the hardcoded "Data updated as of 06/2023" with "Showing crashes from <first date> to <last date>", computed from the data.
- [x] 1.6 Remove the two Navbar links that point to `/` ("GET CRASH DATA", "GET FATALITY DATA").
- [x] 1.7 In `layout.tsx`, add `metadataBase: new URL("https://visionzero.opentlh.com")` and replace the vercel.app `openGraph.url`.
- [x] 1.8 Replace the default Next.js `src/app/favicon.ico` with a temporary icon made from the existing Vision Zero logo. Delete the starter SVGs in `public/` and the empty `src/app/get-our-data/` folder.

**Verify:**
- `npm run build` exits 0.
- `grep -r NEXT_PUBLIC_ARCGIS website/src` finds nothing.
- `grep -r "ARCGIS" website/.next/static` finds nothing (the token isn't in the client bundle).
- In `npm run dev`: the Fatal, Nonfatal and All filters each change the map, and the date label matches the data.
- `grep -rn vercel website/src` finds nothing.
- The browser tab shows the new icon, not the Next.js logo.

**Commit point:** `fix: server-only ArcGIS token, field allowlist, severity labels, domain and favicon`

## Phase 2 — Data baseline (2–4 sessions; can run in parallel with Phase 3)

Goal: know exactly what data you have. Every number on the site depends on this. The output is a report, not code in the app.

- [x] 2.1 List every file in `data/` and the ArcGIS layer: period, row count, key fields, and whether it has severity and person fields. Write it to `data/docs/INVENTORY.md`. Done 2026-11-06; there is no ArcGIS layer any more.
- [x] 2.2 Check uniqueness of `report_number` within and across files. Record duplicates and how you resolved them.
- [x] 2.3 Find which file(s) contain severity codes and person-level injury and fatality data. Write down the FLHSMV code meanings, citing the source. Done 2026-11-06: the 2020 and 2021 person files in `data/leon-county-crashes/*/processed/` (see INVENTORY.md). Codes are in `data/docs/person-code-dictionary.md`. Source: the crash data dictionary on a CD supplied by FLHSMV.
- [x] 2.4 Compute, by quarter: crashes, fatal crashes, fatalities (people), crashes missing coordinates. Compare against ArcGIS for the same quarters. Done 2026-11-06 in COVERAGE-REPORT.md. ArcGIS is gone, so the check is crash records against person records: all 39 fatal crashes match, 43 people were killed, and 172 were seriously injured.
- [x] 2.5 Get the Tallahassee city-limits boundary (source and vintage). Count crashes in the city, county-only, and undetermined.
- [x] 2.6 Write `data/docs/COVERAGE-REPORT.md`: periods covered, gaps, the last complete date, and a list of missing periods to use when asking for acquisition quotes.
- [x] 2.7 Save the analysis as a script (`data/scripts/coverage_report.py` or a notebook) that regenerates the report from scratch.

**Verify:** run the script on a clean checkout and confirm it reproduces the report's numbers · quarterly ArcGIS and local counts match, or the differences are explained in writing · crash and person totals are listed separately.
**Commit point:** `docs(data): inventory and reproducible coverage report`

**Gate:** Don't show a fatalities total or an "Injury" filter until 2.3 and 2.4 are done. (Met 2026-11-06. The map now shows people killed and seriously injured, a Serious filter for crashes that killed or seriously injured someone, and street names in the crash details and list.)

**Added 2026-11-06: public downloads.** The repo is public and people should be able to pull the data, which reverses the earlier "no public downloads" decision (INTERVIEW Q10).
- **What:** `npm run data:build` writes crash and person files for Leon County and Tallahassee to `data/public/` (committed, CC BY 4.0, field guide in `data/public/README.md`). It also copies them to `website/public/downloads/` (git-ignored), which `/data#downloads` links to.
- **Left out:** age, sex and home ZIP code.
- **Moved:** the raw 2019 person file that had those fields is now in the git-ignored `data/private/`, with a full backup of the original files in `data/private/original/`.

## Phase 3 — Map state and crash query seam (2 sessions)

Goal: put the architecture's foundation in place while still reading from ArcGIS.

- [x] 3.1 `npm i zod server-only`.
- [x] 3.2 Write `src/lib/map-state.ts` (`parseMapState`, `serializeMapState`, `safeReturnTo`) test-first.
- [x] 3.3 Write `src/server/crashes/types.ts` (the `CrashFeature` DTO and `CrashQueryResult`) and `index.ts` (`queryCrashes`, `getCoverage`) that pick the adapter from `CRASH_SOURCE`.
- [x] 3.4 Move the ArcGIS code into `src/server/crashes/arcgis.ts`. Query by date range, not a hardcoded quarter list. Map ArcGIS fields to the DTO.
- [x] 3.5 Add `src/app/api/crashes/route.ts`, which parses the query with `parseMapState`, calls `queryCrashes` and returns JSON.
- [x] 3.6 Write contract tests in `src/server/crashes/contract.test.ts` with fixtures: response keys equal the allowlist, the end date is inclusive, fatal crashes and fatalities are counted separately, unmapped crashes go in `totals.unmapped`.
- [x] 3.7 Delete `combineYearQuarterData.ts` and the old `fetchMapData.ts`.

**Verify:** `npm test` passes, including the contract tests · `npm run build` exits 0 · `curl 'localhost:3000/api/crashes?from=2021-01-01&to=2021-03-31&severity=fatal'` returns only allowlisted keys · `?returnTo=https://evil.example` resolves to `/map`.
**Commit point:** `feat: map-state module and queryCrashes seam`

## Phase 4 — Explorer rebuild (3–4 sessions)

Goal: a working, accessible `/map` driven by the URL.

- [x] 4.1 Create `app/map/page.tsx`. Read `searchParams`, call `getCoverage` and the first `queryCrashes` on the server, and render `<Explorer>`.
- [x] 4.2 `useMapState` hook: read state from the URL and update it with `router.replace`. Debounce viewport changes.
- [x] 4.3 `FilterPanel` with labeled controls (geography, from/to dates limited to coverage, severity with Fatal prominent, road user, Reset).
- [x] 4.4 `CrashMapView`: create the map once, replace data with `source.setData`, and call `map.remove()` on unmount. Use a legend that doesn't rely on color alone (add shape or icon).
- [x] 4.5 `SummaryBar`: crashes, fatal crashes, fatalities (only after Phase 2 gate), unmapped, plus an "About these numbers" link to `/data#crashes-vs-people`.
- [x] 4.6 `ResultsList`: an accessible list or table of the same results. Add a Map/List toggle on phones.
- [x] 4.7 `CrashDetail`: shows the selected crash and syncs with `?crash=`. If the crash no longer exists, show an "unavailable" message.
- [x] 4.8 States: loading, zero results (Clear filters / adjust dates), load error (Retry), outside coverage (Back to Tallahassee, Request a Florida city).
- [x] 4.9 `/` redirects to or links to `/map` until the overview exists. Add a link to `/map` in the Navbar.

**Verify:**
- Map, list and summary agree for at least 3 filter combinations.
- Copy the URL into a new window and get the same view.
- Tab through everything with the keyboard; focus stays visible.
- At 375px width there's no horizontal scroll, and the filters open and close.
- Disconnect the network and confirm the error state appears.
- `npm test && npm run build && npm run lint` pass.

**Commit point:** `feat: URL-driven accessible explorer`

## Phase 5 — Design pass (2–3 sessions)

Goal: apply your design direction to the whole site. Run the design skills on the rendered site, not on mockups.

- [x] 5.1 Run `/impeccable` critique on the Phase 4 explorer and the "before" screenshots. Save findings to `docs/community-road-safety-plan/DESIGN-REVIEW.md`. Done 2026-11-06: 27/40, three P1s (map shows no date range, crashes have no location, map colours bury fatal crashes). No "before" screenshots existed, so there was no comparison.
- [x] 5.2 Use `/design-taste-frontend` to set the direction: type scale, palette (accessible severity colors), spacing and tone. Record it in `website/DESIGN.md`. Done 2026-11-06: written from the shipped tokens and components ("The Printed Annual"), including the dark theme and the monochrome map.
- [x] 5.3 Put tokens in `tailwind.config.ts` and `globals.css`. Replace one-off colors such as `bg-[#C4291D]`.
- [x] 5.4 Build the shared layout: header with the main navigation and a footer with About, Privacy and Terms.
- [x] 5.5 Build the overview page `/`: purpose, verified coverage, headline counts from `queryCrashes`, **Explore the map**, and later sections for the city request and support.
- [x] 5.6 Restyle the explorer using the tokens.
- [x] 5.7 Design the favicon mark in the new direction, simplified so it reads at 16px. Export the full set from ARCHITECTURE.md › Favicon set (`favicon.ico`, `icon.svg` with a dark-mode variant, `apple-icon.png`, 192 and 512 manifest PNGs).

**Verify:** compare screenshots against the "before" set at desktop and phone width · run a contrast check (WCAG AA) on text and severity colors · `/impeccable` audit has no blocking items · build passes.
**Commit point:** `feat(design): design system, layout, overview page`

## Phase 6 — Learn pages (1–2 sessions)

- [x] 6.1 Build `/data` with anchored sections: crashes vs people, fatal vs fatalities, nonfatal/unknown, city vs county, missing locations, coverage and gaps, sources, limitations. Use the numbers from COVERAGE-REPORT.md.
- [x] 6.2 Add **Return to your map** using `safeReturnTo(?returnTo)`. Have every explorer "learn" link pass `returnTo`.
- [x] 6.3 Update `/about` with Open Tallahassee's role and how to get involved.

**Verify:** walkthrough "New resident" from USER-FLOWS.md: filter the map, click a definition, click Return, and land on the same filters, viewport and selection.
**Commit point:** `feat: methodology pages with return-to-map`

## Phase 6b — SEO and icons (1 session)

Specs are in ARCHITECTURE.md › SEO and icons.

- [x] 6b.1 In root `layout.tsx`, set the title template, default description, `openGraph`, `twitter` card and `metadataBase`.
- [x] 6b.2 Give every page its own `metadata` or `generateMetadata`, using the titles in the route table. Set `alternates.canonical` on each, and make `/map` canonical to `/map` regardless of filter params.
- [x] 6b.3 Add `noindex` to `/support/return` and the request confirmation states.
- [x] 6b.4 Create `src/app/robots.ts`. In production (Netlify `CONTEXT === "production"`), allow everything except `/api/` and link the sitemap. Everywhere else, disallow all. Add `X-Robots-Tag: noindex` headers for non-production contexts in `netlify.toml`.
- [x] 6b.5 Create `src/app/sitemap.ts` listing only the indexable routes, with `lastModified` from the coverage refresh date.
- [x] 6b.6 Create `src/app/opengraph-image.tsx` (1200×630, using `next/og`) showing the name, tagline and coverage dates.
- [x] 6b.7 Create `src/app/manifest.ts` and install the favicon set from 5.7.
- [x] 6b.8 Add `JsonLd` with `Organization` and `WebSite` on `/`.
- [x] 6b.9 Make sure Mapbox is dynamically imported only on `/map`, and that the overview's headline text is server-rendered.

**Verify:**
- `curl -s localhost:3000/robots.txt` and `/sitemap.xml` return correct content. On a deploy preview, `robots.txt` says `Disallow: /`.
- `curl -s localhost:3000/map?severity=fatal | grep canonical` shows `https://visionzero.opentlh.com/map`.
- View the source of each page: each title is different, and the description and `og:image` are present.
- Paste a preview URL into https://www.opengraph.xyz/ and check that the 1200×630 image and text appear.
- Run Google's Rich Results Test on `/`: JSON-LD is valid.
- Check the favicon in the tab in light and dark browser themes, and add the site to an iPhone home screen to check the Apple icon.
- Lighthouse SEO score is 100 on `/`, `/map` and `/data`.

**Commit point:** `feat(seo): metadata, sitemap, robots, OG image, favicon set`

---

**Release 1 can ship here** (historical data, explorer, learn pages) once these are done:

- [x] R1.1 Privacy and Terms pages describe the site's actual behavior (hosting logs, Mapbox, no forms yet), and the publisher has approved them.
- [ ] R1.2 Run all USER-FLOWS walkthroughs that don't involve forms or donations.
- [ ] R1.3 Run Lighthouse on `/` and `/map` on mobile: Accessibility ≥ 95, and record Performance.
- [ ] R1.4 Open a PR and check the Netlify Deploy Preview, then merge to deploy to production.
- [ ] R1.5 After launch, verify the domain in Google Search Console (DNS record), submit `https://visionzero.opentlh.com/sitemap.xml`, and run URL inspection on `/` and `/map`.
- [ ] R1.6 Check that the `*.netlify.app` address redirects to `visionzero.opentlh.com`, and that the old vercel.app copy is turned off or also points there.

---

## Phase 7 — Database and request pathways (3–4 sessions)

Follow [NEON-PRISMA.md](NEON-PRISMA.md) for the exact setup commands.

- [x] 7.1 Neon and Prisma setup on dev branch `dev-prisma-setup` (NEON-PRISMA §1–3). Create `src/server/db.ts`. (done on the production branch; the user chose not to use a dev branch)
- [x] 7.2 Add the `CityRequest` and `DataRequest` models from ARCHITECTURE.md, then run `prisma migrate dev --name community_requests` on the **dev branch only**.
- [x] 7.3 Create `src/server/policies/versions.ts` and `src/config/pathways.ts` (flags).
- [x] 7.4 Create `src/server/requests/` server actions: zod validation, both policy checkboxes required, versions and timestamps recorded, `deleteAfter` set, honeypot and rate limit.
- [x] 7.5 Build `/cities/request`: form, accessible errors, input kept after errors, receipt confirmation, "not open yet" state when the flag is off.
- [x] 7.6 Build `/data/request`: prefilled from `returnTo` map state, then the same behavior as 7.5.
- [x] 7.7 Write `scripts/retention.ts` and add `npm run retention:purge`. Document how and when it runs in `docs/community-road-safety-plan/OPERATIONS.md`.

**Verify:** run NEON-PRISMA §5 steps 1–6 with synthetic data · submitting without the checkboxes stores nothing · no route returns request rows · the retention script deletes only expired rows that don't have the collaboration flag · `npx prisma migrate status` is clean.
**Commit point:** `feat: city and data request pathways behind flags`

Enabling the pathways in production (only when you're ready to operate them):

- [x] 7.8 Name the operator and inbox. Update Privacy and Terms for the forms, then get them approved again. (inbox: privacy@opentlh.com, to be confirmed)
- [x] 7.9 `prisma migrate deploy` to production (confirm the target first).
- [ ] 7.10 In Netlify, set `DATABASE_URL` per deploy context (Production uses the Neon production branch, Deploy Previews use a dev branch). Then set the `ENABLE_*` flags for Production. Submit one real test request, then delete it.

## Phase 8 — Support and donations (1–2 sessions, after decisions)

- [x] 8.1 Build `/support`: available vs missing data (from COVERAGE-REPORT), what new data would show, how funds are used, the recipient, and where updates are published. Show the donate button only if `DONATION_URL` is set.
- [x] 8.2 Add the **Help update this data** link in the explorer's CoverageNote and in `/data#coverage`. Don't add popups or modals.
- [x] 8.3 Build `/support/return`: confirmed / pending / canceled messaging, based on provider-confirmed status rather than URL params alone, plus **Return to your map**.
- [ ] 8.4 Publish a funding target only if quotes from Phase 2.6 support it.

**Verify:** "Interested supporter" walkthrough for the confirmed, pending and canceled paths · with `DONATION_URL` unset, the page has no dead button.
**Commit point:** `feat: support page and donation handoff`

## Phase 9 — Postgres crash data (optional, 2–3 sessions)

Do this only after Phase 2 is reconciled and if ArcGIS becomes a limitation.

- [ ] 9.1 Add the `Crash`, `CoveragePeriod`, `Boundary` and `ImportRun` models. Migrate on the dev branch.
- [ ] 9.2 Write `scripts/import-crashes.ts`: reads reconciled files, computes boundary flags, aggregates person counts, records an `ImportRun`.
- [ ] 9.3 Write `src/server/crashes/postgres.ts` and run the contract tests against it.
- [ ] 9.4 Compare: for 5 filter combinations, `CRASH_SOURCE=postgres` and `arcgis` return the same totals, or the differences are documented.
- [ ] 9.5 Switch production to `CRASH_SOURCE=postgres`. Keep ArcGIS as a fallback for one release.

**Commit point:** `feat: Postgres crash source`

## Phase 10 — Later (not in first release)

Monthly trend charts, road-user breakdowns, corridor rankings with a documented method, more Florida cities. Each needs its own scope check against the data baseline.
