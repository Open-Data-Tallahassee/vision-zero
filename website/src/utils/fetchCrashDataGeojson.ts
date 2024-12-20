// utils/fetchCrashDataGeojson.ts

/**
 * Fetches Leon County crash data from the specified GeoJSON file.
 *
 * @returns {Promise<any | null>} The full GeoJSON object if the fetch is successful, or `null` if there is an error.
 * @throws {Error} If the network request fails or the response is not OK.
 */
export const getLeonCountyCrashDataGeoJSON = async (): Promise<any | null> => {
  const geojsonURL =
    "https://raw.githubusercontent.com/Open-Data-Tallahassee/vision-zero/refs/heads/41-first-map/data/quarterly-tranches/processed/leon-people-2019-q2.geojson";

  try {
    // Fetch the GeoJSON data from the URL
    const response = await fetch(geojsonURL);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    // Parse and return the GeoJSON data
    const geojsonData = await response.json();
    return geojsonData;
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error);
    return null;
  }
};
