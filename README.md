### Project Status:

- Currently cleaning data and visualizing a sample dataset

### What questions can we answer with this data?:

- Where are the most dangerous intersections?
- What is the most dangerous time to travel on Thomasville Rd?
- Does daylight savings impact crash frequency?

## Methodology for Data Combination and Joining Tables

This query is designed to merge data from multiple tables related to traffic incidents and consolidate it into a single, comprehensive dataset for Leon County (where `county_code = 13`). The process is broken down into the following steps:

1. Data Combination:

   - Data from three different tables (`non_redacted_driver`, `non_redacted_passenger`, and `non_redacted_non_motorist`) is combined into a unified dataset using a `UNION ALL` operation.
   - A new column, `role`, is added to distinguish the type of participant in the incident:
     - `'D'` for drivers from `non_redacted_driver`.
     - `'P'` for passengers from `non_redacted_passenger`.
     - `'N'` for non-motorists from `non_redacted_non_motorist`.

   * For consistency:
     - The `non_motorist_description_code` is set to `0` as a placeholder for driver and passenger data, as it is only applicable to non-motorists.
     - The `vehicle_number` is set to `NULL` for non-motorists since this data is not relevant to them.

2. Joining with Incident Data:

   - The combined roles data is joined with the `non_redacted_event` table using the `report_number` as the key.
   - This step ensures that each role (driver, passenger, or non-motorist) is linked to its corresponding traffic incident.

3. Filtering for Leon County:

   - The query specifically filters incidents that occurred in **Leon County** by applying the condition `county_code = 13`.

4. Final Output:

   - The resulting dataset includes key incident details (`crash_year`, `crash_date_time`, `latitude`, `longitude`, etc.) along with participant-specific details such as `vehicle_number`, `person_number`, `injury_severity`, and `role`.
   - The `non_motorist_description_code` is included where applicable.

### Purpose

This query allows analysts to examine detailed information about traffic incidents in **Leon County** by combining role-specific data with incident-level details. It is particularly useful for understanding the involvement and impact on different types of participants (drivers, passengers, and non-motorists) in traffic events.

## Resources

### data sources

| Data Source                                                                                                                       | Description                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Florida Department of Highway Safety and Motor Vehicles (FLHSMV)](https://www.flhsmv.gov/traffic-crash-reports/crash-dashboard/) | The official repository for crash reports and maintains the crash reports for 10 years. To access it, send an email to CrashPRR@FLHSMV.gov specifying the non-redacted data for the desired year(s) and/or quarter. Raw crash data is in an Excel format. The data is on a disc; with one year per disc and quarterly discs for the current year, 2021. Each disc is $6.00 |

### existing maps

- [NHTSA Data products](https://cdan.nhtsa.gov/), emphasizing fatalities
- [city-data.com](https://www.city-data.com/accidents/acc-Tallahassee-Florida.html) - amalgamation of data, perhaps from NHTSA, also emphasizing fatalities
- [Boston Vision Zero Map](https://apps.boston.gov/vision-zero/), fatalities in Boston
- [Signal Four Analytics](http://signal4analytics.com), fatalities across Florida using FLHSMV data

### other Florida initiatives

- [Orlando](https://www.orlando.gov/Initiatives/Vision-Zero)
- [Fort Lauderdale](https://www.fortlauderdale.gov/home/showdocument?id=12497) (PDF)
- [Hillsborough](https://planhillsborough.org/vision-zero/)
- [Sarasota] (https://sarasotainmotion.com)
