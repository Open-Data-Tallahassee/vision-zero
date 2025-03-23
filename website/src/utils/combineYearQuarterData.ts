// combineYearQuarterData.ts
"use server";
import { getCachedCrashData } from "./fetchMapData";

/**
 * Fetch and combine crash data for multiple (year, quarter) combos.
 */
async function combineMultipleYearQuarterData(): Promise<GeoJSON.FeatureCollection> {
  // 1. List out all (year, quarter) combos you want to fetch.
  const yearQuarterPairs = [
    { year: "2020", quarter: "1" },
    { year: "2020", quarter: "2" },
    { year: "2020", quarter: "3" },
    { year: "2020", quarter: "4" },
    { year: "2021", quarter: "1" },
    { year: "2021", quarter: "2" },
  ];

  // 2. Accumulate features from all calls here.
  let combinedFeatures: GeoJSON.Feature[] = [];

  // 3. Loop through each year-quarter pair, fetch the data, and combine it.
  for (const { year, quarter } of yearQuarterPairs) {
    const data = await getCachedCrashData(year, quarter);
    combinedFeatures = [...combinedFeatures, ...data.features];
  }

  // 4. Create a single combined FeatureCollection.
  const combinedData: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: combinedFeatures,
  };

  return combinedData;
}

// Example usage:
(async () => {
  try {
    const mergedData = await combineMultipleYearQuarterData();
    console.log(`Combined feature count: ${mergedData.features.length}`);
    // Do something with mergedData, e.g. store it, analyze it, etc.
  } catch (error) {
    console.error(`Error merging multiple year-quarter data: ${error}`);
  }
})();

export default combineMultipleYearQuarterData;
