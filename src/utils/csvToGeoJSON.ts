// utils/csvToGeoJSON.ts

export interface CrashData {
  report_number: string;
  crash_year: number;
  role: string;
  injury_severity: number;
  non_motorist_description_code?: number;
  crash_date_time: string;
  latitude: number;
  longitude: number;
}

export interface CrashDetail {
  role: string;
  injury_severity: number;
  non_motorist_description_code?: number;
}

export interface GeoJSONFeature {
  type: "Feature";
  id: string;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    report_number: string;
    crash_year: number;
    crash_date_time: string;
    details: CrashDetail[];
    is_fatal: boolean; // property for filtering
    crash_types: string[];
    crash_type: "Pedestrian" | "Bicyclist" | "Motor Vehicle"; // New property
  };
}

export interface GeoJSONFeatureCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// utils/csvToGeoJSON.ts (continued)

export const convertToGeoJSON = (
  data: CrashData[]
): GeoJSONFeatureCollection => {
  // Create a map to group data by report_number
  const crashMap: Map<string, CrashData[]> = new Map();

  data.forEach((item) => {
    if (!crashMap.has(item.report_number)) {
      crashMap.set(item.report_number, []);
    }
    crashMap.get(item.report_number)!.push(item);
  });

  // Convert the map to GeoJSON features
  const features: GeoJSONFeature[] = Array.from(crashMap.entries()).map(
    ([report_number, crashItems]) => {
      const firstItem = crashItems[0]; // Assuming crash_year and crash_date_time are same for all items
      const details: CrashDetail[] = crashItems.map((item) => ({
        role: item.role,
        injury_severity: item.injury_severity,
        non_motorist_description_code: item.non_motorist_description_code,
      }));

      const is_fatal = crashItems.some((item) => item.injury_severity === 5);

      // Determine crash types based on non_motorist_description_code
      const crashTypeMap: { [key: number]: string } = {
        0: "MOTOR VEHICLE",
        1: "PEDESTRIAN",
        3: "BICYCLIST",
      };

      const crash_types = Array.from(
        new Set(
          crashItems
            .map(
              (item: CrashData) =>
                crashTypeMap[item.non_motorist_description_code]
            )
            .filter((type) => type !== undefined)
        )
      );

      // Determine crash_type based on crash_types
      let crash_type: "Pedestrian" | "Bicyclist" | "Motor Vehicle" =
        "Motor Vehicle";

      if (crash_types.includes("PEDESTRIAN")) {
        crash_type = "Pedestrian";
      } else if (crash_types.includes("BICYCLIST")) {
        crash_type = "Bicyclist";
      }

      return {
        type: "Feature",
        id: report_number, // Assigning 'id' as string
        geometry: {
          type: "Point",
          coordinates: [firstItem.longitude, firstItem.latitude],
        },
        properties: {
          report_number: report_number,
          crash_year: firstItem.crash_year,
          crash_date_time: firstItem.crash_date_time,
          details: details, // Assigned as an array
          is_fatal: is_fatal, // Set based on injury_severity
          crash_types: crash_types, // Array of crash types
          crash_type: crash_type, // New property
        },
      };
    }
  );

  return {
    type: "FeatureCollection",
    features,
  };
};
