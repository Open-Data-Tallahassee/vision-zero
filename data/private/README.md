# Private data

Files in this folder are ignored by git and never published. They hold source records with personal details, such as age, sex or home ZIP code, that could identify someone hurt in a crash when combined with the crash's time and place.

| File | What it is | Why it is private |
| --- | --- | --- |
| `leon-people-2019-q2.csv` | FLHSMV person records for Leon County, April to June 2019, one row per person | Has `home_zip`, `age` and `sex` |

The public, de-identified versions are in `data/public/`. Keep originals here when you receive new data, and build public files from them with `npm run data:build` in `website/`.

## `original/`

A full copy of `data/` (all files, notebooks and the code dictionaries) and of `website/scripts/build-crash-data.mjs`, taken on 2026-11-06 before the Phase 2 data work changed anything. It keeps the original folder layout, including `quarterly-tranches/leon-people-2019-q2.csv`. Nothing in it is published.

On 2026-11-06 the files the site doesn't use were deleted from `data/` (see `docs/INVENTORY.md` › Removed from the public repo). `original/` is the only local copy of them.

## `sources/` and `notebooks/`

Since 2026-11-06 the repo holds only published data, so every raw input lives here instead:

- **`sources/leon-county-crashes/`:** the crash map file and the 2020 and 2021 person files.
- **`sources/clean/`:** the 2018 to 2021 street-name file.
- **`sources/boundaries/`:** the Census boundaries.
- **`notebooks/`:** the notebooks that built them.

`website/scripts/prepare-data.mjs` reads `sources/`. Back this folder up somewhere else, because git doesn't keep it.
