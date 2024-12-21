const fetchCrashDataPage = async (offset: number): Promise<any> => {
  const baseUrl = `https://services8.arcgis.com/QWMg3JYJpicIkfeO/arcgis/rest/services/leon_people_2019_q2/FeatureServer/0/query`;
  const token = process.env.NEXT_PUBLIC_ARCGIS_TOKEN;
  const pageSize = 2000; // Number of features per page

  const queryUrl = `${baseUrl}?where=1%3D1&outFields=*&f=geojson&resultOffset=${offset}&resultRecordCount=${pageSize}&token=${token}`;

  const response = await fetch(queryUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  return response.json();
};

const fetchAllCrashData = async (): Promise<GeoJSON.FeatureCollection> => {
  let allFeatures: GeoJSON.Feature[] = [];
  let offset = 0;
  let hasMoreData = true;

  while (hasMoreData) {
    const data = await fetchCrashDataPage(offset);

    if (data.features) {
      allFeatures = allFeatures.concat(data.features);
    }

    // Check exceededTransferLimit in data.properties
    hasMoreData = data.properties?.exceededTransferLimit || false;

    // Increment the offset for the next page
    offset += data.features.length;

    console.log(
      `Fetched ${data.features.length} features, total: ${allFeatures.length}`
    );
  }

  return {
    type: "FeatureCollection",
    features: allFeatures,
  };
};

// Cache the fetched data for one day (24 hours)
import { unstable_cache } from "next/cache";

export const getCachedCrashData = unstable_cache(
  fetchAllCrashData,
  ["crashData"],
  { revalidate: 60 * 60 * 24 } // Revalidate every 24 hours
);
