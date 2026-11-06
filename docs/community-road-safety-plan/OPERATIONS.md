# Operations

How to run the parts of the site that need a person. Nothing here is automated yet.

## Refreshing crash data

1. Add the new source file under `data/` and point `SOURCE` (and `WINDOW`, if the period changed) in `website/scripts/build-crash-data.mjs` at it.
2. From `website/`, run `npm run data:build`. It rewrites the server dataset and `data/docs/COVERAGE-REPORT.md`.
3. Read the report's excluded-record counts and quarterly table. Investigate anything that jumped.
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

Dark mode is automatic (system setting) and togglable in the header. The map stays light in both themes. To make it follow the theme, create a dark Mapbox style and switch the style URL in `CrashMapView` when `data-theme` changes.
