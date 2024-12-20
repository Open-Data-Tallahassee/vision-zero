"use client";

import { useState } from "react";
import CrashDate from "./CrashDate";
import CrashSeverity from "./CrashSeverity";
import CrashType from "./CrashType";
import Map from "./Map";

const CrashMap = () => {
  const [crashTypeOption, setCrashTypeOption] = useState<
    "ALL" | "MOTOR VEHICLE" | "PEDESTRIAN" | "BICYCLIST"
  >("ALL");
  const [crashSeverityOption, setCrashSeverityOption] = useState<
    "FATAL" | "INJURY"
  >("INJURY");
  const [crashFromDate, setCrashFromDate] = useState<Date>(new Date(2019, 3)); // June 1, 2019
  const [crashToDate, setCrashToDate] = useState<Date>(new Date(2019, 5, 30));

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
        <Map
          crashSeverityOption={crashSeverityOption}
          crashTypeOption={crashTypeOption}
          crashFromDate={crashFromDate}
          crashToDate={crashToDate}
        />
      </div>
    </div>
  );
};

export default CrashMap;
