"use client";

import {
  convertToGeoJSON,
  CrashData,
  GeoJSONFeatureCollection,
} from "@/utils/csvToGeoJSON";
import { getLeonCountyCrashData } from "@/utils/fetchCrashData";
import { endOfDay, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import CrashDate from "./CrashDate";
import CrashSeverity from "./CrashSeverity";
import CrashType from "./CrashType";
import Map from "./Map";

const CrashMap = () => {
  const [visibleData, setVisibleData] =
    useState<GeoJSONFeatureCollection | null>(null);
  const [crashTypeOption, setCrashTypeOption] = useState<
    "ALL" | "MOTOR VEHICLE" | "PEDESTRIAN" | "BICYCLIST"
  >("ALL");
  const [crashSeverityOption, setCrashSeverityOption] = useState<
    "FATAL" | "INJURY"
  >("INJURY");
  const [crashFromDate, setCrashFromDate] = useState<Date>(new Date(2019, 3)); // June 1, 2019
  const [crashToDate, setCrashToDate] = useState<Date>(new Date(2019, 5, 30));
  const [crashData, setCrashData] = useState<CrashData[] | null>(null);

  // const crashData = getLeonCountyCrashData();

  // Fetch and convert data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getLeonCountyCrashData();
      if (data) {
        setCrashData(data);
      } else {
        console.log("Failed to load crash data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Flatten the data into GeoJSON
    if (crashData) {
      const geojson = convertToGeoJSON(crashData);
      setVisibleData(geojson);
    }
  }, [crashData]);

  // Update the map source data based on the filter
  useEffect(() => {
    if (crashData) {
      const geojson = convertToGeoJSON(crashData);
      let filteredFeatures = geojson.features;

      if (crashSeverityOption === "FATAL") {
        filteredFeatures = geojson.features.filter(
          (feature) => feature.properties.is_fatal
        );
      } else if (crashSeverityOption === "INJURY") {
        filteredFeatures = geojson.features.filter(
          (feature) => !feature.properties.is_fatal
        );
      }

      // Filter by Crash Type
      if (crashTypeOption !== "ALL") {
        filteredFeatures = filteredFeatures.filter((feature) =>
          feature.properties.crash_types.includes(crashTypeOption)
        );
      }

      // Filter by Date Range
      if (crashFromDate || crashToDate) {
        const start = crashFromDate
          ? startOfDay(crashFromDate)
          : new Date(-8640000000000000); // Minimum Date
        const end = crashToDate
          ? endOfDay(crashToDate)
          : new Date(8640000000000000); // Maximum Date

        filteredFeatures = filteredFeatures.filter((feature) => {
          const crashDate = new Date(feature.properties.crash_date_time);
          return crashDate >= start && crashDate <= end;
        });
      }

      const filteredGeoJSON: GeoJSONFeatureCollection = {
        type: "FeatureCollection",
        features: filteredFeatures,
      };

      setVisibleData(filteredGeoJSON);
    }
  }, [
    crashSeverityOption,
    crashTypeOption,
    crashData,
    crashFromDate,
    crashToDate,
  ]);

  if (!crashData) {
    return <pre>Loading...</pre>;
  }

  return (
    <div className="flex flex-col md:flex-row ">
      <div className="col-lg-4 py-3 px-4">
        <div className="text-xl font-bold py-3">FILTER CRASHES</div>
        <div className="w-full space-y-2">
          <CrashType
            selectedOption={crashTypeOption}
            handleOptionClick={(option: string) =>
              setCrashTypeOption(
                option as "ALL" | "MOTOR VEHICLE" | "PEDESTRIAN" | "BICYCLIST"
              )
            }
          />
          <CrashSeverity
            selectedOption={crashSeverityOption}
            handleOptionClick={(option: string) =>
              setCrashSeverityOption(option as "INJURY" | "FATAL")
            }
          />
          <CrashDate
            toDate={crashToDate}
            fromDate={crashFromDate}
            handleToDateChange={setCrashToDate}
            handleFromDateChange={setCrashFromDate}
          />
        </div>
        <div className="py-3 text-lg italic">
          Data updated as of:{" "}
          {new Date(2023, 5).toLocaleDateString(undefined, {
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        <div className="text-lg italic">
          <ul className="">
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#C4291D] mr-2"></span>
              Pedestrian crash
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#F5AE3D] mr-2"></span>
              Bicyclist crash
            </li>
            <li className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-[#3C90E2] mr-2"></span>
              Motor vehicle crash
            </li>
          </ul>
        </div>
      </div>
      <div className="w-full h-full px-12 pb-4 md:p-0 md:pb-0">
        {visibleData && <Map data={visibleData} />}
      </div>
    </div>
  );
};

export default CrashMap;
