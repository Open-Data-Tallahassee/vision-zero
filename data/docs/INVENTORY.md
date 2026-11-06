# Data inventory

Every data file in `data/`, as of 2026-11-06 (checklist item 2.1), after removing the files the site doesn't use. Row counts don't include the header. "Severity" means a per-person injury severity field.

The site no longer uses an ArcGIS layer: the map is built from the files below by `website/scripts/build-crash-data.mjs`.

## Used by the site

| File | Level | Period | Rows | Unique reports | Key fields | Severity | Person fields |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `leon-county-crashes/map/leon-county-crashes.geojson` | Crash | 2014 to 2021-06-30 (substantial from 2020-01-01) | 12,743 | 12,743 | report number, date and time, `is_fatal`, crash types (pedestrian, bicyclist, motor vehicle), vehicles, people, point | Fatal flag only | No |
| `leon-county-crashes/2020/processed/2020_202412251425.csv` | Person | 2014-03-03 to 2020-12-31 (substantial in 2020) | 20,241 | 8,547 | report number, date and time, vehicles, people, lat/long, vehicle number, person number, injury severity, non-motorist type, role | Yes | Role and non-motorist type only |
| `leon-county-crashes/2021-q1-and-q2/processed/2021-q2_202412251115.csv` | Person | 2016-10-07 to 2021-06-30 (substantial in 2021 Q1 and Q2) | 10,561 | 4,360 | same as the 2020 file | Yes | Role and non-motorist type only |
| `clean/all-2018to2021.csv` | Crash | 2018-01-01 to 2021-06-30 | 32,616 | 32,429 | report number, date and time, first harmful event code, vehicles, people, lat/long, street, street number, cross street | No | No |
| `boundaries/leon-county-2021.geojson` | Boundary | January 1, 2021 vintage | 1 | | U.S. Census TIGERweb, Leon County (GEOID 12073) | | |
| `boundaries/tallahassee-city-2021.geojson` | Boundary | January 1, 2021 vintage | 1 | | U.S. Census TIGERweb, Tallahassee city (GEOID 1270600) | | |

The two person files overlap: 81 person rows appear in both, identically, and the build counts them once.

## Removed from the public repo (2026-11-06)

These files weren't used by the site, so they were deleted from `data/`. Copies are kept locally in the git-ignored `data/private/original/`, and earlier commits still have them.

| File | Level | Period | Rows | What it was |
| --- | --- | --- | --- | --- |
| `clean/all-2018to2021.geojson` | Crash | 2018 to 2021-06-30 | 32,616 | GeoJSON copy of the clean CSV, which is kept. |
| `leon-county-crashes/2020/processed/leon-county-2020.geojson` (and `.zip`) | Crash | 2020 | 8,492 | An earlier cut of the map file for 2020 only. |
| `leon-county-crashes/2021-q1-and-q2/processed/leon-county-2021-to-2021-q2.geojson` | Crash | 2021 Q1 and Q2 | 4,291 | An earlier cut of the map file for 2021. |
| `quarterly-tranches/leon-events-2019-q2.csv` (and `.geojson`) | Crash | 2019 Q2 | 3,118 | Full event fields for one quarter, plus three links to news stories. |
| `quarterly-tranches/processed/leon-people-2019-q2.csv` and `.geojson` | Person / crash | 2019 Q2 | 7,639 / 2,790 | Person records without age, sex or ZIP, and a crash summary built from them. |
| `scripts/leon-people-2019-q2.ipynb`, `scripts/csv-to-geojson.ipynb` | Notebook | | | Built the 2019 files above. |
| `private/leon-people-2019-q2.csv` (git-ignored, never deleted) | Person | 2019 Q2 | 7,639 | Raw person file with home ZIP, age and sex. |

## Notebooks kept

`scripts/leon-county-crashes.ipynb` and `scripts/leon-people-2021-q2.ipynb` record how the map file and the person files were built from raw FLHSMV exports, which aren't in the repo. `scripts/clean.ipynb` built `clean/all-2018to2021.csv`; some of its inputs are only in `data/private/original/`.

## Code dictionaries

- `docs/events-code-dictionary.md`: crash (event) fields and codes.
- `docs/person-code-dictionary.md`: person fields and codes, including injury severity, role and non-motorist type.
- `docs/codes/*.csv`: the same codes as small lookup tables.

The injury severity codes the site uses are:

| Code | Meaning | Used as |
| --- | --- | --- |
| 1 | None | uninjured |
| 2 | Possible | possible injury |
| 3 | Non-incapacitating | minor injury |
| 4 | Incapacitating | serious injury |
| 5 | Fatal (within 30 days) | killed |
| 6 | Non-traffic fatality | not counted as killed |

The dictionaries were transcribed from the crash data dictionary on a CD that FLHSMV supplied with its crash report data. The tables in `docs/codes/` come from the same source.

## What the files can and can't support

- **2020-01-01 to 2021-06-30:** reconciled at both crash and person level. Every fatal crash has a person killed in the person records and vice versa (39 crashes, 43 people). Every crash's person rows add up to its "people involved". Every crash has a street name. These are the dates on the map and in the downloads.
- **2018 and 2019:** crash-level records with street names exist in `clean/`, but completeness is unverified. 2018 quarters are low, at about 1,900 to 2,300 crashes. The clean file's 2019 Q2 has 2,822 crashes, but the separate 2019 Q2 event file (now only in the private backup) has 3,112. There is no injury severity for 2018–2019 in the public repo.
- **After June 30, 2021:** no records. See `docs/COVERAGE-REPORT.md` › Missing periods to request.
