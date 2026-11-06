# Operations

How to run the parts of the site that need a person. Nothing here is automated yet.

## Refreshing crash data

1. Add the new source file under `data/` and point `SOURCE` (and `WINDOW`, if the period changed) in `website/scripts/build-crash-data.mjs` at it.
2. From `website/`, run `npm run data:build`. It rewrites three things:
   - the server dataset;
   - the public downloads in `data/public/`, with a copy in `website/public/downloads/`;
   - `data/docs/COVERAGE-REPORT.md`.

   If new files have person records, point `PEOPLE` at them too. Keep any original with age, sex or home ZIP in `data/private/`, which git ignores.
3. Read the report's excluded-record counts, quarterly table and Reconciliation section. Investigate anything that jumped, and any fatal crash without a person killed. Update the row counts in `data/public/README.md` and `data/docs/INVENTORY.md`.
4. Run `npm test` and `npm run build`, then open a PR. The Netlify deploy preview is the place to check the map.

## Turning on a request pathway

All three conditions must hold, or the page shows "This form isn't open yet":

1. `ENABLE_CITY_REQUESTS=true` or `ENABLE_DATA_REQUESTS=true` in Netlify's Production environment variables.
2. `DATABASE_URL` set for Production (Neon `production` branch, pooled URL), with migrations applied (`npm run db:deploy` against the direct URL).
3. Approved policies: set `effective` dates for both entries in `website/src/server/policies/versions.ts` after the publisher approves the text.

The request pages are rendered at build time, so redeploy after changing a flag.

## Monthly review

1. Read new requests in the Neon console (tables `CityRequest`, `DataRequest`) and set `status`.
2. Run the retention purge from `website/` with the production `DATABASE_URL` in `.env.local`:

   ```bash
   npm run retention:purge
   ```

   It prints how many requests were deleted and the city-interest counts for the deleted city requests. Copy those counts into the quarterly update before they're gone.
3. Honor any deletion request sent to the privacy contact by deleting the row directly.

## Donations

Set `DONATION_URL` (https only) in Netlify to show the donate button on `/support`. Point the provider's return URL at `https://visionzero.opentlh.com/support/return`. That page never claims a payment succeeded; the provider's receipt is the confirmation.

## Photographs

Add the file to `website/public/images/`, add its author, licence and links to `website/src/content/photo-credits.json`, and show it with `<PhotoCredit src=... />` inside a `relative` container. Only use images whose licence allows reuse with credit.

## Dark mode and the map

Dark mode is automatic (system setting) and togglable in the header, and the map follows it.

- **How:** the Mapbox style (`benji-develops/cm4rnea8l00cm01r07kbv2iwa`) imports Mapbox Standard as `basemap` and adds its own red road, label and background layers. `styleBasemap` in `CrashMapView.tsx` changes it at load and on each theme change:
  - It sets Standard's config to the `monochrome` theme and the `day` or `night` light preset, and turns on road labels.
  - It hides the style's own layers, except the city-limit fill, which takes the `--accent` colour.
- **Editing the style in Mapbox Studio:** changes to the Standard import's config are overridden by this code. Change them in `styleBasemap` instead. Any new top-level layer is hidden unless its id is added to the skip list there.
- **Dot colours:** they come from `--fatal-dot`, `--pedestrian`, `--bicyclist` and `--vehicle`, plus `--map-ink` and `--map-paper` for the rings.
  - Dark mode overrides all six with lighter values, so they stay at about 3:1 or better against the night basemap.
  - The legend uses the same tokens.
  - The data layers set `*-emissive-strength: 1` so Standard's lighting doesn't darken them.
