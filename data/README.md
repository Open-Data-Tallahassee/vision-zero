# Source
This data is derived from the [Florida Department of Highway Safety and Motor Vehicles (FLHSMV)](https://www.flhsmv.gov/traffic-crash-reports/crash-dashboard/) repository for crash reports for the years 2010-2021.

# Folders
- `public/`: the published downloads (crashes and people, Leon County and Tallahassee) with their field guide and CC BY 4.0 license. The site is built from these files. Start here if you want to use the data.
- `docs/`: the inventory (`INVENTORY.md`), the coverage report and the FLHSMV code dictionaries.
- `private/`: ignored by git and never published. It holds the raw source files, the notebooks and a backup of the original files. `npm run data:prepare` in `website/` turns them into `public/`.
