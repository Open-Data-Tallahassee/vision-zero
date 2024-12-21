import { updateLayerFilters } from "@/utils/mapConfig";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_TOKEN || "";

const Map = ({
  crashData,
  crashSeverityOption,
  crashTypeOption,
  crashFromDate,
  crashToDate,
}: {
  crashData: any;
  crashSeverityOption: string;
  crashTypeOption: string;
  crashFromDate?: Date;
  crashToDate?: Date;
}) => {
  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const lat = 30.4543;
  const lng = -84.2875;
  const initZoom = 11.53;

  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once

    const initMap = () => {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current || "",
        style: "mapbox://styles/benji-develops/cm4rnea8l00cm01r07kbv2iwa",
        center: [lng, lat],
        minZoom: 10,
        zoom: initZoom,
      });

      mapRef.current.on("load", () => {
        if (mapRef.current) {
          // Add ArcGIS Feature Layer as a GeoJSON source
          // const crashData = await getCachedCrashData();

          mapRef.current.addSource("crashData", {
            type: "geojson",
            data: crashData,
          });

          mapRef.current.addLayer({
            id: "crashPoints",
            type: "circle",
            source: "crashData",
            paint: {
              "circle-radius": 6,
              "circle-color": [
                "match",
                ["get", "crash_type"],
                "Pedestrian",
                "#C4291D", // Red for Pedestrian
                "Bicyclist",
                "#F5AE3D", // Yellow for Bicyclist
                "#3C90E2", // Blue for Others
              ],
              "circle-opacity": 0.6,
            },
          });

          // Add popups on click for crash points
          mapRef.current.on("click", "crashPoints", (e) => {
            const features = mapRef.current?.queryRenderedFeatures(e.point, {
              layers: ["crashPoints"],
            });
            const feature = features && features[0];
            if (feature) {
              const coordinates = (feature.geometry as any).coordinates.slice();
              const report_number = feature.properties.report_number;
              const crash_year = feature.properties.crash_year;
              // Convert timestamp to date and time
              const crash_date_time = new Date(
                feature.properties.crash_date_time
              ).toLocaleString();

              const vehicle_number = feature.properties.vehicles_involved;
              const person_number = feature.properties.people_involved;

              // Create HTML content for the popup
              const popupContent = `
                        <strong>Report Number:</strong> ${report_number}<br/>
                        <strong>Year:</strong> ${crash_year}<br/>
                        <strong>Date & Time:</strong> ${crash_date_time}<br/>
                        <strong>Vehicles Involved:</strong> ${vehicle_number}<br/>
                        <strong>People Involved:</strong> ${person_number}<br/>
                      `;

              new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(popupContent)
                .addTo(mapRef.current!);
            }
          });

          // Change the cursor to a pointer when over the points
          mapRef.current.on("mouseenter", "crashPoints", () => {
            mapRef.current?.getCanvas().style.setProperty("cursor", "pointer");
          });

          mapRef.current.on("mouseleave", "crashPoints", () => {
            mapRef.current?.getCanvas().style.setProperty("cursor", "");
          });
        }
      });
    };
    initMap();
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      updateLayerFilters(
        mapRef.current,
        "crashPoints",
        crashSeverityOption,
        crashTypeOption,
        crashFromDate,
        crashToDate
      );
    }
  }, [crashSeverityOption, crashTypeOption, crashFromDate, crashToDate]);

  return (
    <div
      ref={mapContainer}
      className="map-container h-[calc(100vh_-_140px)] w-full relative"
    />
  );
};

export default Map;
