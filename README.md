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

## Methodology for Generating GeoJSON Features from Crash Data

This process involves transforming grouped traffic crash data into GeoJSON features, where each feature represents a unique crash event with its location and associated attributes. The methodology ensures that spatial and descriptive information is accurately captured for visualization and analysis.

1.  Data Preparation

    Each crash is grouped by its unique report_number. Within each group, individual records provide details about participants involved, such as crash type, injury severity, and the total number of vehicles and people.

    - Spatial Information: The latitude and longitude from the first record in the group are used to define the crash's geographical location.

    - Temporal Information: Crash year and the exact date/time are also extracted from the first record to establish a timeline.

    Crashes without valid latitude or longitude are excluded to ensure spatial data accuracy.

2.  Crash Type Classification

    Crash types are determined by analyzing participant-level details:

    - Each participant is classified as "MOTOR VEHICLE," "PEDESTRIAN," or "BICYCLIST" based on their role and non_motorist_description_code.

    - The crash's overall classification is derived from the set of participant types:
      - If any participant is a pedestrian, the crash is classified as "Pedestrian."
      - If any participant is a bicyclist, the crash is classified as "Bicyclist."
      - Otherwise, the crash is categorized as "Motor Vehicle."

3.  Determining Fatality

    A crash is flagged as fatal if at least one participant has an injury severity indicating a fatality. This is determined by checking the injury severity values across all participants.

4.  Aggregating Participant Data

    To provide a concise summary of the crash, total counts for vehicles and people involved are directly retrieved from the data:

    - total_number_of_vehicles: Represents the number of vehicles involved in the crash.
    - total_number_of_persons: Reflects the number of people involved.
      These totals are used to convey the scale of the incident.

5.  GeoJSON Feature Creation
    For each crash, a GeoJSON feature is generated with the following structure:

    - Geometry:
      - A Point object that specifies the crash's location using longitude and latitude coordinates.
    - Properties:
      - Temporal details, such as crash year and date/time.
      - Attributes, including whether the crash was fatal (is_fatal), its overall classification (crash_type), and a list of all crash types involved (crash_types).
      - Aggregate counts of vehicles and people involved.

### Query

```
-- Combine driver, passenger, and non-motorist tables
WITH combined_roles AS (
    SELECT
        report_number,
        vehicle_number,
        person_number,
        injury_severity,
        0 AS non_motorist_description_code, -- Placeholder for non_motorist data
        'D' AS role
    FROM non_redacted_driver

    UNION ALL

    SELECT
        report_number,
        vehicle_number,
        person_number,
        injury_severity,
        0 AS non_motorist_description_code, -- Placeholder for non_motorist data
        'P' AS role
    FROM non_redacted_passenger

    UNION ALL

    SELECT
        report_number,
        NULL AS vehicle_number, -- non_motorist does not have vehicle_number
        person_number,
        injury_severity,
        non_motorist_description_code,
        'N' AS role
    FROM non_redacted_non_motorist
)

-- Join the combined table with the main query
SELECT
    e.report_number,
    e.crash_year,
    e.crash_date_time,
    e.total_number_of_vehicles,
    e.total_number_of_persons,
    e.latitude,
    e.longitude,
    cr.vehicle_number,
    cr.person_number,
    cr.injury_severity,
    cr.non_motorist_description_code,
    cr.role
FROM
    "2021_q2".non_redacted_event e
JOIN
    combined_roles cr
ON
    e.report_number = cr.report_number
WHERE
    e.county_code = 13;
```

### Purpose

The methodology captures both spatial and descriptive aspects of traffic crash data, transforming raw participant-level information into a cohesive and standardized format. This GeoJSON structure is ideal for use in geographic visualizations, enabling insights into crash patterns, severity, and types across different locations and timeframes.

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
