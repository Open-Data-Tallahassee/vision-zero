import { startOfDay, endOfDay } from "date-fns";
// import type { ExpressionSpecification } from "@mapbox/mapbox-gl-style-spec";

/**
 * Generates Mapbox filters based on the user's filtering options.
 */
export const getMapboxFilters = (
  crashSeverityOption: string,
  crashTypeOption: string,
  crashFromDate?: Date,
  crashToDate?: Date
): mapboxgl.ExpressionSpecification => {
  const filters: mapboxgl.ExpressionSpecification = ["all"];

  // Crash Severity Filter
  if (crashSeverityOption === "FATAL") {
    filters.push(["==", ["get", "is_fatal"], 1]);
  } else if (crashSeverityOption === "INJURY") {
    filters.push(["==", ["get", "is_fatal"], 0]);
  }

  // Crash Type Filter
  if (crashTypeOption !== "ALL") {
    filters.push(["in", crashTypeOption, ["get", "crash_types"]]);
  }

  // Date Range Filter
  if (crashFromDate || crashToDate) {
    const start = crashFromDate
      ? startOfDay(crashFromDate).getTime()
      : -8640000000000000;
    const end = crashToDate
      ? endOfDay(crashToDate).getTime()
      : 8640000000000000;

    filters.push([
      "all",
      [">=", ["to-number", ["get", "crash_date_time"]], start],
      ["<=", ["to-number", ["get", "crash_date_time"]], end],
    ]);
  }

  return filters;
};

/**
 * Updates the filter for a specified layer.
 */
export const updateLayerFilters = (
  map: mapboxgl.Map,
  layerId: string,
  crashSeverityOption: string,
  crashTypeOption: string,
  crashFromDate?: Date,
  crashToDate?: Date
) => {
  if (map.getLayer(layerId)) {
    const newFilters = getMapboxFilters(
      crashSeverityOption,
      crashTypeOption,
      crashFromDate,
      crashToDate
    );
    map.setFilter(layerId, newFilters);
  }
};
