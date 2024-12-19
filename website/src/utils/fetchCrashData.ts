// utils/fetchCrashData.ts

import Papa from "papaparse";
import { CrashData } from "./csvToGeoJSON";

/**
 * Fetches and parses Leon County crash data from a CSV URL.
 * @returns {Promise<CrashData[] | null>} A promise that resolves to an array of CrashData or null if an error occurs.
 */
export const getLeonCountyCrashData = async (): Promise<CrashData[] | null> => {
  const csvURL =
    "https://raw.githubusercontent.com/Open-Data-Tallahassee/vision-zero/41-first-map/crash-data/quarterly-tranches/processed/leon-people-2019-q2.csv";

  try {
    const response = await fetch(csvURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise<CrashData[] | null>((resolve) => {
      Papa.parse<CrashData>(csvText, {
        header: true,
        dynamicTyping: false, // We'll handle type conversions manually
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const parsedData: CrashData[] = results.data.map((d) => ({
              report_number: d.report_number, // Keep as string
              crash_year: d.crash_year ? Number(d.crash_year) : 0,
              role: d.role || "N/A",
              injury_severity: d.injury_severity
                ? Number(d.injury_severity)
                : 0,
              non_motorist_description_code:
                d.non_motorist_description_code != null
                  ? Number(d.non_motorist_description_code)
                  : undefined,

              crash_date_time: d.crash_date_time,
              latitude: d.latitude ? Number(d.latitude) : 0,
              longitude: d.longitude ? Number(d.longitude) : 0,
            }));

            resolve(parsedData);
          } catch (transformationError) {
            console.error(
              "Error transforming parsed CSV data:",
              transformationError
            );
            resolve(null);
          }
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error);
          resolve(null);
        },
      });
    });
  } catch (error) {
    console.error("Error fetching CSV data:", error);
    return null;
  }
};
