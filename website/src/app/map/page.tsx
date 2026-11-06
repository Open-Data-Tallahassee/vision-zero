import type { Metadata } from "next";
import Explorer from "@/components/explorer/Explorer";
import { parseMapState } from "@/lib/map-state";
import { getCoverage, queryCrashes } from "@/server/crashes";

export const metadata: Metadata = {
  title: "Tallahassee crash map",
  description: "Explore reported traffic crashes in Tallahassee and Leon County on a map. Filter by date, fatal crashes, pedestrians and bicyclists, and share the view.",
  // Every filtered view points search engines at the one map page.
  alternates: { canonical: "/map" },
};

export default async function MapPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams;
  const params = new URLSearchParams(Object.entries(raw).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));
  const coverage = await getCoverage();
  const initial = parseMapState(params, coverage);
  const { totals } = await queryCrashes(initial);
  return <Explorer initial={initial} coverage={coverage} initialTotals={totals} />;
}
