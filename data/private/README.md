# Private data

Files in this folder are ignored by git and never published. They hold source records with personal details, such as age, sex or home ZIP code, that could identify someone hurt in a crash when combined with the crash's time and place.

| File | What it is | Why it is private |
| --- | --- | --- |
| `leon-people-2019-q2.csv` | FLHSMV person records for Leon County, April to June 2019, one row per person | Has `home_zip`, `age` and `sex` |

The public, de-identified versions are in `data/public/`. Keep originals here when you receive new data, and build public files from them with `npm run data:build` in `website/`.

## `original/`

A full copy of `data/` (all files, notebooks and the code dictionaries) and of `website/scripts/build-crash-data.mjs`, taken on 2026-11-06 before the Phase 2 data work changed anything. It keeps the original folder layout, including `quarterly-tranches/leon-people-2019-q2.csv`. Nothing in it is published.
