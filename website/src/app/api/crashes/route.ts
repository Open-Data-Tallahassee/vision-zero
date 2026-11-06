import { parseMapState } from "@/lib/map-state";
import { getCoverage, queryCrashes } from "@/server/crashes";

export async function GET(request: Request) {
  const coverage = await getCoverage();
  const { geo, from, to, severity, user } = parseMapState(new URL(request.url).searchParams, coverage);
  const result = await queryCrashes({ geo, from, to, severity, user });
  return Response.json(result, {
    // The dataset only changes on deploy, so let the CDN keep responses for a day.
    headers: { "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
