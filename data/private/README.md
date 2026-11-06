# Private data

Files in this folder are ignored by git and never published. They hold source records with personal details, such as age, sex or home ZIP code, that could identify someone hurt in a crash when combined with the crash's time and place.

| File | What it is | Why it is private |
| --- | --- | --- |
| `leon-people-2019-q2.csv` | FLHSMV person records for Leon County, April to June 2019, one row per person | Has `home_zip`, `age` and `sex` |

The public, de-identified versions are in `data/public/`. Keep originals here when you receive new data, and build public files from them with `npm run data:build` in `website/`.
