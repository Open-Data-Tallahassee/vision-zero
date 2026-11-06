# Vision Zero TLH crash data downloads

Reported traffic crashes in Leon County, Florida, from **January 1, 2020 to June 30, 2021**: the same records as the map at https://visionzero.opentlh.com/map. The files are also linked from https://visionzero.opentlh.com/data#downloads.

| File | Rows | What it is |
| --- | --- | --- |
| `leon-county-crashes.csv` / `.geojson` | 12,578 | Every crash in Leon County, one row per crash |
| `tallahassee-crashes.csv` / `.geojson` | 10,359 | The crashes inside Tallahassee city limits |
| `leon-county-people.csv` | 30,053 | One row per person on a Leon County crash report |
| `tallahassee-people.csv` | 25,035 | The people on Tallahassee city crashes |

`npm run data:build` in `website/` writes these files, so don't edit them by hand. `data/docs/COVERAGE-REPORT.md` has the totals by quarter, and explains how the files were checked against each other.

## License and credit

Published under [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). You can share and adapt them for any purpose, including commercial use, as long as you give credit. Suggested credit:

> Vision Zero TLH (Open Tallahassee), from Florida Department of Highway Safety and Motor Vehicles crash records.

The license covers this compilation: the cleaning, boundary flags, injury counts and file layout. The underlying crash records come from the Florida Department of Highway Safety and Motor Vehicles (FLHSMV). This is a community project, not an official government source.

## What's left out, and why

- **Age, sex and home ZIP code** are left out of the people files. Combined with a crash's exact time and place, they could identify someone who was hurt. The source records never include names.
- **Crashes outside the window.** 164 scattered records dated before 2020 are left out, so earlier years don't look covered when they aren't. Nothing after June 30, 2021 has been collected yet.
- **One crash** with coordinates outside Leon County is left out rather than guessed into place.

## Crash files

GeoJSON files have the same fields as the CSVs. Latitude and longitude become the point geometry (WGS 84, longitude first).

| Field | Meaning |
| --- | --- |
| `report_number` | FLHSMV crash report number. Links a crash to its rows in the people file. |
| `date`, `time` | Local date (YYYY-MM-DD) and 24-hour time (HH:MM) of the crash. `00:00` may mean the time wasn't recorded. |
| `in_tallahassee` | `true` if the crash location is inside Tallahassee city limits (U.S. Census boundary, January 1, 2021 vintage, applied to every year). |
| `latitude`, `longitude` | Crash location as recorded on the report, rounded to 5 decimal places (about 1 m). |
| `street` | The road the crash was on, as written on the report. Spelling and capitals vary. |
| `street_number` | Street address number, where the report gives one. |
| `cross_street` | The nearest intersecting road, where the report gives one (about 82% of crashes). |
| `fatal` | `true` if at least one person died within 30 days. |
| `pedestrian_involved`, `bicyclist_involved` | `true` if a pedestrian or bicyclist was involved. |
| `vehicles` | Number of vehicles involved. |
| `people` | Number of people involved, including people who weren't hurt. |
| `killed` | People who died within 30 days (FLHSMV injury severity 5). |
| `incapacitating_injuries` | People with incapacitating (serious) injuries (severity 4). |
| `non_incapacitating_injuries` | People with non-incapacitating injuries (severity 3). |
| `possible_injuries` | People with possible injuries (severity 2). |
| `uninjured` | People recorded as not injured (severity 1). |
| `injury_unknown` | People whose injury severity wasn't recorded. |
| `most_severe_injury` | The worst injury in the crash: `fatal`, `incapacitating`, `non_incapacitating`, `possible`, `none` or `unknown`. |

The injury counts add up to `people`, except for people recorded as a non-traffic fatality (severity 6), who aren't counted as killed. There are three such people in this period.

## People files

| Field | Meaning |
| --- | --- |
| `report_number` | The crash this person was in. |
| `person_number` | The person's number on that crash report. |
| `vehicle_number` | The vehicle the person was in. Blank for people not in a vehicle. |
| `role` | `driver`, `passenger` or `non_motorist` (someone not in a motor vehicle, such as a pedestrian or bicyclist). |
| `non_motorist_type` | For non-motorists: `pedestrian`, `other_pedestrian` (wheelchair, skater and similar), `bicyclist`, `other_cyclist`, `occupant_of_parked_vehicle`, `non_motor_transport_device` or `unknown`. |
| `injury_severity` | `fatal` (died within 30 days), `incapacitating`, `non_incapacitating`, `possible`, `none`, `non_traffic_fatality` or `unknown` (not recorded). |

The codes behind these values are listed in `data/docs/person-code-dictionary.md`.

## Using the data well

- **Crash counts are not risk.** Roads with more traffic usually have more crashes. Nothing here adjusts for traffic volume.
- **These are reported crashes only.** Crashes nobody reported to police aren't included.
- **Completeness.** Whether every quarter is complete hasn't been checked against state totals. Spring 2020 is lower, which matches reduced travel early in the pandemic.
