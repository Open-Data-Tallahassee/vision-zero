const fetchCrashDataPage = async (
  offset: number,
  crashYear: string,
  crashQuarter?: string
): Promise<any> => {
  const baseUrl = `https://services8.arcgis.com/QWMg3JYJpicIkfeO/arcgis/rest/services/Leon_County_Crash_Data/FeatureServer/0/query`;
  const token = process.env.NEXT_PUBLIC_ARCGIS_TOKEN;
  const pageSize = 2000; // Number of features per page

  // Build the WHERE clause dynamically
  // If both are provided, we do "crash_year=YYYY AND crash_quarter=Q"
  // If only one is provided, we filter on that alone; otherwise "1=1"
  let whereClause = "1=1"; // default (no filter)

  if (crashYear && crashQuarter) {
    whereClause = `crash_year=${crashYear} AND crash_quarter=${crashQuarter}`;
  } else if (crashYear) {
    whereClause = `crash_year=${crashYear}`;
  } else if (crashQuarter) {
    whereClause = `crash_quarter=${crashQuarter}`;
  }

  // URL-encode the WHERE clause
  const encodedWhere = encodeURIComponent(whereClause);

  // Construct the query URL
  const queryUrl = `${baseUrl}?where=${encodedWhere}&outFields=*&f=geojson&resultOffset=${offset}&resultRecordCount=${pageSize}&token=${token}`;

  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
};

const fetchAllCrashData = async (
  crashYear: string = "2020",
  crashQuarter: string = "3"
): Promise<GeoJSON.FeatureCollection> => {
  let allFeatures: GeoJSON.Feature[] = [];
  let offset = 0;
  let hasMoreData = true;

  while (hasMoreData) {
    const data = await fetchCrashDataPage(offset, crashYear, crashQuarter);

    if (data.features) {
      allFeatures = allFeatures.concat(data.features);
    }

    // Check exceededTransferLimit in data.properties
    hasMoreData = data.properties?.exceededTransferLimit || false;

    // Increment the offset for the next page
    offset += data.features.length;

    console.log(
      `crashYear ${crashYear} and crashQuarter ${crashQuarter}: Fetched ${data.features.length} features, total: ${allFeatures.length}`
    );
  }

  return {
    type: "FeatureCollection",
    features: allFeatures,
  };
};

// Cache the fetched data for one day (24 hours)
import { unstable_cache } from "next/cache";

export function getCachedCrashData(crashYear: string, crashQuarter: string) {
  return unstable_cache(
    () => fetchAllCrashData(crashYear, crashQuarter),
    // Include the year/quarter in the cache key so they don't collide
    ["crashData", crashYear, crashQuarter],
    { revalidate: 60 * 60 * 24 }
  )();
}
