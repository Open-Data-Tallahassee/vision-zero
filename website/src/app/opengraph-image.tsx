import { ImageResponse } from "next/og";
import { formatCount, formatCoverage } from "@/lib/format";
import { getCoverage, queryCrashes } from "@/server/crashes";

export const alt = "Vision Zero TLH: a free map of traffic crashes in Tallahassee and Leon County";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const coverage = await getCoverage();
  const { totals } = await queryCrashes({ geo: "leon", from: coverage.start, to: coverage.end, severity: "all", user: "all" });
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#ffffff", padding: 16, gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1.3, background: "#f1f2ee", padding: 48 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#1d221f" }}>{"Tallahassee & Leon County"}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 118, lineHeight: 0.92, letterSpacing: -5, color: "#1d221f" }}>Vision</div>
            <div style={{ display: "flex", fontSize: 118, lineHeight: 0.92, letterSpacing: -5, color: "#1d221f" }}>Zero</div>
            <div style={{ display: "flex", fontSize: 118, lineHeight: 0.92, letterSpacing: -5, color: "#1d221f" }}>TLH</div>
            <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#1d221f" }}>A free crash map built by neighbors.</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1, background: "#1f3a2b", color: "#ffffff", padding: 40 }}>
            <div style={{ display: "flex", fontSize: 96, lineHeight: 1 }}>{formatCount(totals.crashes)}</div>
            <div style={{ display: "flex", fontSize: 28, marginTop: 8 }}>{`crashes, ${formatCoverage(coverage)}`}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flex: 1, background: "#cfe4bd", color: "#1d221f", padding: 40 }}>
            <div style={{ display: "flex", fontSize: 96, lineHeight: 1 }}>{totals.fatalCrashes}</div>
            <div style={{ display: "flex", fontSize: 28, marginTop: 8 }}>fatal crashes</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
