interface MapProps {
  data: GeoJSONFeatureCollection;
}

import { GeoJSONFeatureCollection } from "@/utils/csvToGeoJSON";
import mapboxgl, { GeoJSONSource } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_TOKEN || "";

const Map = (props: MapProps) => {
  const mapContainer = useRef(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const lat = 30.4543;
  const lng = -84.2875;
  const initZoom = 11.53;

  useEffect(() => {
    if (mapRef.current) return; // initialize map only once
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current || "",
      style: "mapbox://styles/benji-develops/cm4rnea8l00cm01r07kbv2iwa",
      center: [lng, lat],
      minZoom: 10,
      zoom: initZoom,
    });

    // Add navigation controls
    mapRef.current.addControl(new mapboxgl.NavigationControl());

    mapRef.current.on("load", () => {
      if (mapRef.current) {
        // Add GeoJSON source
        mapRef.current.addSource("crashData", {
          type: "geojson",
          data: props.data,
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
            const report_number = feature.id;
            const crash_year = feature.properties.crash_year;
            const crash_date_time = feature.properties.crash_date_time;
            const vehicle_number = feature.properties.vehicles_involved;
            const person_number = feature.properties.people_involved;

            // Create HTML content for the popup
            let popupContent = `
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

    // Cleanup on unmount
    // return () => {
    //   if (mapRef.current) mapRef.current.remove();
    // };
  }, [props.data]);

  // Listen for data prop changes and update the GeoJSON source
  useEffect(() => {
    if (mapRef.current && mapRef.current.getSource("crashData")) {
      const source = mapRef.current.getSource("crashData") as GeoJSONSource;
      source.setData(props.data);
    }
  }, [props.data]);

  return (
    <div className="w-full h-full">
      {/* <div className="bg-[rgba(35, 55, 75, 0.9)]">
        Longitude: {lng} | Latitude: {lat} | Zoom: {initZoom}
      </div> */}
      <div
        ref={mapContainer}
        className="map-container h-[calc(100vh_-_140px)] w-full relative"
        // className={`map-container h-[calc(100vh_-_${180}px)] w-full relative`}
      />
    </div>
  );
};

export default Map;
