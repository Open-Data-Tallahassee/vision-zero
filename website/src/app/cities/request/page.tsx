import type { Metadata } from "next";
import ClosedNotice from "@/components/forms/ClosedNotice";
import RequestForm from "@/components/forms/RequestForm";
import TextPage from "@/components/site/TextPage";
import { submitCityRequest } from "@/server/requests/actions";
import { requestsOpen } from "@/server/requests/availability";

export const metadata: Metadata = {
  title: "Request a crash map for your Florida city",
  description: "Ask Open Tallahassee to make a free crash map for your Florida city or county. No payment, no account.",
  alternates: { canonical: "/cities/request" },
};

export default function CityRequestPage() {
  return (
    <TextPage
      photo={2}
      title="Request a Florida city"
      lead={<p>Want a map like this for where you live? Tell us the city or county. It&rsquo;s free, and paying doesn&rsquo;t move a request up the list.</p>}
    >
      <h2>What happens with a request</h2>
      <ul>
        <li>We read new requests once a month.</li>
        <li>Tallahassee and Leon County come first. After that we weigh local need, whether the crash records can be obtained, and whether someone local can help.</li>
        <li>There&rsquo;s no promised date. If you leave an email, we&rsquo;ll only use it to follow up about your city.</li>
        <li>We publish how many requests each city has had, never who sent them.</li>
      </ul>
      <p>This is for a new map. If you need data from the existing Tallahassee map, <a href="/data/request">request data</a> instead.</p>
      {requestsOpen.city() ? (
        <RequestForm
          action={submitCityRequest}
          submitLabel="Send city request"
          fields={[
            { name: "city", label: "Florida city or county", required: true, autoComplete: "address-level2" },
            { name: "email", label: "Email", type: "email", autoComplete: "email", hint: "Only if you'd like to hear back." },
            { name: "message", label: "Anything we should know?", type: "textarea", hint: "Why it matters to you, or how you could help." },
          ]}
          received={
            <>
              <h2 className="text-lead">Your city request was received</h2>
              <p className="mt-3">We review requests monthly and can&rsquo;t promise a date. If you gave an email, we&rsquo;ll write when there&rsquo;s news.</p>
              <p className="mt-3"><a href="/map" className="underline">Explore the Tallahassee map</a></p>
            </>
          }
        />
      ) : (
        <ClosedNotice what="city requests" />
      )}
    </TextPage>
  );
}
