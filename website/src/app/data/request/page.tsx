import type { Metadata } from "next";
import Link from "next/link";
import ClosedNotice from "@/components/forms/ClosedNotice";
import RequestForm from "@/components/forms/RequestForm";
import TextPage from "@/components/site/TextPage";
import { GEOGRAPHY_LABELS, SEVERITY_LABELS, ROAD_USER_LABELS, parseMapState, safeReturnTo } from "@/lib/map-state";
import { getCoverage } from "@/server/crashes";
import { submitDataRequest } from "@/server/requests/actions";
import { requestsOpen } from "@/server/requests/availability";

export const metadata: Metadata = {
  title: "Request crash data",
  description: "Request Tallahassee and Leon County crash data for research or advocacy. Free, reviewed by a person, no account needed.",
  alternates: { canonical: "/data/request" },
};

export default async function DataRequestPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  const back = returnTo ? safeReturnTo(returnTo) : undefined;
  const coverage = await getCoverage();
  const selection = back ? parseMapState(new URLSearchParams(back.split("?")[1] ?? ""), coverage) : undefined;

  return (
    <TextPage
      photo={1}
      title="Request crash data"
      returnTo={back}
      lead={<p>Most data is free to <Link href="/data#downloads">download</Link>. If you need something the downloads don&rsquo;t cover, ask here. Requests are free and a person reads each one.</p>}
    >
      <h2>What we can share</h2>
      <ul>
        <li>Crash-level details like those on the map, and totals such as injury counts.</li>
        <li>Never names, contact details or records about individual people.</li>
        <li>A reply means we&rsquo;ve received the request, not that it&rsquo;s approved. There&rsquo;s no guaranteed turnaround.</li>
      </ul>
      {selection && (
        <p>
          From your map: {GEOGRAPHY_LABELS[selection.geo]}, {SEVERITY_LABELS[selection.severity].toLowerCase()}, {ROAD_USER_LABELS[selection.user].toLowerCase()}. The fields below start from that selection; change anything you need.
        </p>
      )}
      {requestsOpen.data() ? (
        <RequestForm
          action={submitDataRequest}
          submitLabel="Send data request"
          fields={[
            { name: "geography", label: "City, county or area", required: true, defaultValue: selection ? GEOGRAPHY_LABELS[selection.geo] : "" },
            { name: "dateFrom", label: "From", type: "date", required: true, defaultValue: selection?.from ?? coverage.start },
            { name: "dateTo", label: "To", type: "date", required: true, defaultValue: selection?.to ?? coverage.end },
            { name: "description", label: "What information do you need?", type: "textarea", required: true },
            { name: "email", label: "Email for our reply", type: "email", required: true, autoComplete: "email" },
            { name: "intendedUse", label: "What will you use it for?", type: "textarea" },
          ]}
          received={
            <>
              <h2 className="text-lead">Your data request was received</h2>
              <p className="mt-3">A volunteer will review it. We&rsquo;ll reply by email; receiving it doesn&rsquo;t mean it&rsquo;s approved yet.</p>
              <p className="mt-3"><a href={back ?? "/map"} className="underline">Return to your map</a> · <a href="/data" className="underline">Understand the data</a></p>
            </>
          }
        />
      ) : (
        <ClosedNotice what="data requests" />
      )}
    </TextPage>
  );
}
