import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/site/TextPage";
import { pathways } from "@/config/pathways";
import { formatDate } from "@/lib/format";
import { getCoverage } from "@/server/crashes";

export const metadata: Metadata = {
  title: "Support updated crash data",
  description: "The Tallahassee crash map stops in mid-2021. Voluntary donations go first to buying newer crash records. The map stays free either way.",
  alternates: { canonical: "/support" },
};

export default async function SupportPage() {
  const coverage = await getCoverage();
  return (
    <TextPage
      photo={0}
      title="Support the work"
      lead={<p>The map is free and will stay free. Donations are optional and help bring the data up to date.</p>}
    >
      <h2>What&rsquo;s missing</h2>
      <p>
        The map has crashes from {formatDate(coverage.start)} to {formatDate(coverage.end)}. Everything since then is missing, including the person-level records that count people killed and separate serious injuries from minor ones.
      </p>

      <h2>What newer records would show</h2>
      <ul>
        <li>Whether crashes on the roads you use have gone up or down since 2021.</li>
        <li>How many people were killed, not only how many crashes were fatal.</li>
        <li>Where serious injuries happen, which is where most safety work starts.</li>
      </ul>

      <h2>Where money goes</h2>
      <p>Buying missing crash records comes first. Anything left goes toward keeping the site running, then carries forward to the next data purchase. We&rsquo;ll publish income, spending and progress every quarter.</p>
      <p>We&rsquo;ll only show a funding target once we have real quotes for the data.</p>

      <h2>Who receives donations</h2>
      {pathways.donationUrl ? (
        <>
          <p>Donations go to {""}<a href="https://www.opentlh.com/">Open Tallahassee</a> through our payment provider, whose own terms apply to the payment.</p>
          <p className="!mt-8 flex flex-wrap gap-[var(--gap)]">
            <a href={pathways.donationUrl} className="button">Donate to support the work</a>
            <Link href="/map" className="button-quiet">Keep exploring without donating</Link>
          </p>
        </>
      ) : (
        <p>
          Donations aren&rsquo;t open yet. We&rsquo;re still setting up who receives them and how they&rsquo;re reported, and we won&rsquo;t take money before that&rsquo;s clear. Meanwhile, you can help by sharing the map or <Link href="/cities/request">telling us about your city</Link>.
        </p>
      )}
      <p>A donation never buys access, priority for a city, or anything else on this site.</p>
    </TextPage>
  );
}
