"use client";

import type { Map as MapboxMap, GeoJSONSource, LngLatBoundsLike, MapMouseEvent } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import type { View } from "@/lib/map-state";
import type { CrashFeature } from "@/server/crashes/types";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_REACT_APP_MAPBOX_TOKEN || "";
const STYLE = "mapbox://styles/benji-develops/cm4rnea8l00cm01r07kbv2iwa";
export const TALLAHASSEE_VIEW: View = { lng: -84.2807, lat: 30.4383, z: 11.5 };
// Rough Leon County bounds: what the map fits to when someone chooses the county.
export const LEON_BOUNDS: [[number, number], [number, number]] = [[-84.75, 30.25], [-84.03, 30.72]];
export type MapTarget = { view: View } | { bounds: LngLatBoundsLike };

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const toGeoJson = (features: CrashFeature[]): GeoJSON.FeatureCollection => ({
  type: "FeatureCollection",
  features: features.map((c) => ({
    type: "Feature",
    id: Number(c.id),
    geometry: { type: "Point", coordinates: [c.lng, c.lat] },
    properties: {
      id: c.id,
      fatal: c.severity === "fatal",
      user: c.roadUsers.includes("pedestrian") ? "pedestrian" : c.roadUsers.includes("bicyclist") ? "bicyclist" : "motor_vehicle",
    },
  })),
});

interface Props {
  features: CrashFeature[];
  view?: View;
  /** Where to open when there is no saved view. */
  startBounds?: LngLatBoundsLike;
  /** Changing this object moves the map to its view or bounds. */
  target?: MapTarget;
  selected?: string;
  /** The lower part of the map is covered (the phone detail sheet), so keep the selected crash above it. */
  coverBottom?: boolean;
  onSelect: (id: string) => void;
  onMove: (view: View) => void;
  onError: (message: string) => void;
}

export default function CrashMapView({ features, view, startBounds, target, selected, coverBottom, onSelect, onMove, onError }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const ready = useRef(false);
  const latest = useRef({ features, selected, onSelect, onMove, onError });
  useEffect(() => {
    latest.current = { features, selected, onSelect, onMove, onError };
  });

  // Create the map once; remove it on unmount.
  useEffect(() => {
    let cancelled = false;
    let map: MapboxMap | null = null;
    let resizeObserver: ResizeObserver | null = null;
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !container.current) return;
      if (!TOKEN) {
        latest.current.onError("The map can't load because no Mapbox token is configured. The list view still works.");
        return;
      }
      mapboxgl.accessToken = TOKEN;
      const start = view ?? TALLAHASSEE_VIEW;
      map = new mapboxgl.Map({
        container: container.current,
        style: STYLE,
        center: [start.lng, start.lat],
        zoom: start.z,
        ...(!view && startBounds ? { bounds: startBounds, fitBoundsOptions: { padding: 24 } } : {}),
        minZoom: 8,
        attributionControl: true,
        cooperativeGestures: false,
      });
      mapRef.current = map;
      // The panel's size settles after layout (and changes with Map/List and filters), so keep the canvas in step.
      resizeObserver = new ResizeObserver(() => map?.resize());
      resizeObserver.observe(container.current);
      map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
      map.on("error", (e) => {
        if (!ready.current) latest.current.onError(`The map couldn't load (${e.error?.message ?? "unknown error"}). The list view still works.`);
      });
      map.on("load", () => {
        if (!map) return;
        ready.current = true;
        map.addSource("crashes", { type: "geojson", data: toGeoJson(latest.current.features) });
        map.addLayer({
          id: "crashes",
          type: "circle",
          source: "crashes",
          // Fatal crashes draw last, on top of everything else.
          layout: { "circle-sort-key": ["case", ["get", "fatal"], 1, 0] },
          paint: {
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 9, ["case", ["get", "fatal"], 5, 2], 14, ["case", ["get", "fatal"], 10, 6]],
            "circle-color": ["case", ["get", "fatal"], css("--fatal-dot"), ["match", ["get", "user"], "pedestrian", css("--pedestrian"), "bicyclist", css("--bicyclist"), css("--vehicle")]],
            // 0.85 keeps nonfatal dots near 3:1 against the basemap; smaller dots at low zoom stop them merging.
            "circle-opacity": ["case", ["get", "fatal"], 0.95, 0.85],
            "circle-stroke-color": ["case", ["boolean", ["feature-state", "selected"], false], css("--map-ink"), "#ffffff"],
            "circle-stroke-width": ["case", ["boolean", ["feature-state", "selected"], false], 3, ["case", ["get", "fatal"], 1.5, 0]],
          },
        });
        map.on("click", "crashes", (e: MapMouseEvent & { features?: GeoJSON.Feature[] }) => {
          const id = e.features?.[0]?.properties?.id;
          if (id) latest.current.onSelect(String(id));
        });
        map.on("mouseenter", "crashes", () => map?.getCanvas().style.setProperty("cursor", "pointer"));
        map.on("mouseleave", "crashes", () => map?.getCanvas().style.setProperty("cursor", ""));
        if (latest.current.selected) map.setFeatureState({ source: "crashes", id: Number(latest.current.selected) }, { selected: true });
      });
      map.on("moveend", () => {
        if (!map) return;
        const c = map.getCenter();
        latest.current.onMove({ lng: c.lng, lat: c.lat, z: map.getZoom() });
      });
    })();
    return () => {
      cancelled = true;
      ready.current = false;
      resizeObserver?.disconnect();
      map?.remove();
      mapRef.current = null;
    };
    // The map is created once; later prop changes are applied by the effects below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready.current) return;
    (map.getSource("crashes") as GeoJSONSource | undefined)?.setData(toGeoJson(features));
  }, [features]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready.current) return;
    map.removeFeatureState({ source: "crashes" });
    if (!selected) return;
    map.setFeatureState({ source: "crashes", id: Number(selected) }, { selected: true });
    const crash = features.find((c) => c.id === selected);
    if (!crash) return;
    const height = map.getContainer().clientHeight;
    if (coverBottom) {
      if (map.project([crash.lng, crash.lat]).y > height * 0.35) map.easeTo({ center: [crash.lng, crash.lat], offset: [0, -height * 0.25] });
    } else if (!map.getBounds()?.contains([crash.lng, crash.lat])) map.easeTo({ center: [crash.lng, crash.lat] });
  }, [selected, features, coverBottom]);

  useEffect(() => {
    if (!target) return;
    if ("bounds" in target) mapRef.current?.fitBounds(target.bounds, { padding: 24 });
    else mapRef.current?.flyTo({ center: [target.view.lng, target.view.lat], zoom: target.view.z });
  }, [target]);

  // Inline position: mapbox-gl.css sets `.mapboxgl-map { position: relative }`, which can win over the class
  // depending on stylesheet order and collapse the map to 0px tall.
  return <div ref={container} style={{ position: "absolute", inset: 0 }} role="region" aria-label="Crash map. Use the list view for a keyboard-accessible version of the same crashes." />;
}

