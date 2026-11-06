# Source
This data is derived from the [Florida Department of Highway Safety and Motor Vehicles (FLHSMV)](https://www.flhsmv.gov/traffic-crash-reports/crash-dashboard/) repository for crash reports for the years 2010-2021.

# Folders
- `public/`: the published downloads (crashes and people, Leon County and Tallahassee) with their field guide and CC BY 4.0 license. Start here if you want to use the data.
- `docs/`: the inventory of every file (`INVENTORY.md`), the coverage report and the FLHSMV code dictionaries.
- `private/`: ignored by git. Source files with personal details, and a backup of the original files.
- `leon-county-crashes/`, `clean/` and `boundaries/`: the source files the build reads, and `scripts/`: notebooks that made them. See `docs/INVENTORY.md`.

