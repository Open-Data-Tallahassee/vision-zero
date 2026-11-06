import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/site/TextPage";
import { formatCount, formatCoverage, formatDate } from "@/lib/format";
import { safeReturnTo } from "@/lib/map-state";
import { getCoverage, queryCrashes } from "@/server/crashes";

export const metadata: Metadata = {
  title: "Understanding Tallahassee crash data",
  description: "Where the crash records come from, what fatal crashes mean, how Tallahassee city limits and Leon County are counted, and what the data can't show yet.",
  alternates: { canonical: "/data" },
};

export default async function DataPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  const { returnTo } = await searchParams;
  const coverage = await getCoverage();
  const all = { from: coverage.start, to: coverage.end, severity: "all", user: "all" } as const;
  const [county, city] = await Promise.all([queryCrashes({ ...all, geo: "leon" }), queryCrashes({ ...all, geo: "tallahassee" })]);
  const ex = coverage.excluded;

  return (
    <TextPage
      photo={3}
      title="Understand the data"
      lead={<p>What&rsquo;s on the map, where it comes from, and what it can&rsquo;t tell you yet.</p>}
      returnTo={returnTo ? safeReturnTo(returnTo) : undefined}
      aside={
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="space-y-1.5 text-body">
            <li><a href="#reading-the-map" className="text-link">Reading the map</a></li>
            <li><a href="#crashes-vs-people" className="text-link">Crashes and people</a></li>
            <li><a href="#fatal" className="text-link">Fatal and nonfatal</a></li>
            <li><a href="#city-vs-county" className="text-link">City and county</a></li>
            <li><a href="#missing-locations" className="text-link">Missing locations</a></li>
            <li><a href="#coverage" className="text-link">Coverage and gaps</a></li>
            <li><a href="#limitations" className="text-link">Limitations</a></li>
            <li><a href="#downloads" className="text-link">Downloads</a></li>
            <li><a href="#request" className="text-link">Requesting data</a></li>
          </ul>
        </nav>
      }
    >
      <h2 id="reading-the-map">Reading the map</h2>
      <p>
        Each dot is one reported crash, placed where the officer&rsquo;s report located it. Red dots with a white ring are fatal crashes. Other colors show who was involved: orange for a pedestrian, gold for a bicyclist, blue when only motor vehicles were involved. A crash involving both a pedestrian and a bicyclist is shown as a pedestrian crash.
      </p>
      <p>
        More dots in one place means more reported crashes there, not necessarily a more dangerous place. Busy roads carry more traffic, so they collect more crashes. The map doesn&rsquo;t adjust for how many people travel each road.
      </p>

      <h2 id="crashes-vs-people">Crashes and people</h2>
      <p>
        A crash is one event. It can involve several vehicles and several people. The map counts crashes. &ldquo;People involved&rdquo; on a crash counts everyone in it, including people who weren&rsquo;t hurt.
      </p>
      <p>
        The map doesn&rsquo;t show the number of people killed yet; one crash that killed two people is still one dot. The person-level records have now been checked against the crashes, and the <a href="#downloads">downloads</a> include a count of people killed and injured on every crash, plus one row for each person.
      </p>

      <h2 id="fatal">Fatal and nonfatal</h2>
      <p>
        A <strong>fatal crash</strong> is one in which at least one person died. A <strong>nonfatal crash</strong> is every other reported crash, whether or not someone was hurt. The map doesn&rsquo;t separate serious injuries from minor ones yet. The <a href="#downloads">downloads</a> include each person&rsquo;s injury severity as the officer recorded it.
      </p>
      <p>
        From {formatCoverage(coverage)}, Leon County had {county.totals.fatalCrashes} fatal crashes; {city.totals.fatalCrashes} of them were inside Tallahassee city limits.
      </p>

      <h2 id="city-vs-county">City and county</h2>
      <p>
        The map starts in Tallahassee city limits. Switch to Leon County to include crashes outside the city. Of {formatCount(county.totals.crashes)} crashes in Leon County, {formatCount(city.totals.crashes)} were inside city limits.
      </p>
      <p>Boundaries come from the U.S. Census Bureau (TIGER, January 1, 2021). City limits change over time; the 2021 boundary is applied to every crash.</p>

      <h2 id="missing-locations">Missing locations</h2>
      <p>
        A crash is only placed on the map when its coordinates fall inside Leon County. {ex.missingLocation === 0 ? "Every record in the current data has coordinates." : `${formatCount(ex.missingLocation)} records have no coordinates.`}{" "}
        {ex.outsideCounty} {ex.outsideCounty === 1 ? "record has coordinates" : "records have coordinates"} outside Leon County and {ex.outsideCounty === 1 ? "is" : "are"} left out rather than guessed into place.
      </p>

      <h2 id="coverage">Coverage and gaps</h2>
      <p>
        The map covers crashes from {formatDate(coverage.start)} to {formatDate(coverage.end)}. The source files also held {formatCount(ex.outsideWindow)} scattered records from earlier years. Those are left out so earlier years don&rsquo;t look covered when they aren&rsquo;t.
      </p>
      <p>
        Nothing after {formatDate(coverage.end)} has been collected. Newer records have to be bought, and buying them is the first use of any donation. <Link href="/support">Help update this data</Link>.
      </p>

      <h2 id="limitations">Limitations</h2>
      <ul>
        <li>These are reported crashes. Crashes nobody reported to police aren&rsquo;t included.</li>
        <li>Whether every month is complete hasn&rsquo;t been checked against state totals. Spring 2020 is noticeably lower, which matches reduced travel early in the pandemic.</li>
        <li>Crash counts are not risk. A road with more traffic will usually have more crashes.</li>
        <li>This is a community project, not an official government source.</li>
      </ul>

      <h2 id="sources">Sources</h2>
      <p>
        Crash records: Florida Department of Highway Safety and Motor Vehicles (FLHSMV). Boundaries: U.S. Census Bureau. The code that prepares the data is <a href="https://github.com/Open-Data-Tallahassee/vision-zero">public on GitHub</a>.
      </p>

      <h2 id="downloads">Downloads</h2>
      <p>
        The data behind the map is free to download, for Leon County or only inside Tallahassee city limits. It covers {formatCoverage(coverage)}.
      </p>
      <ul>
        <li>
          <strong className="font-medium">Crashes</strong>, one row per crash: date, time, location, street and cross street, whether it was fatal, who was involved, and counts of people killed and injured.{" "}
          Leon County: <a href="/downloads/leon-county-crashes.csv" download>CSV</a>, <a href="/downloads/leon-county-crashes.geojson" download>GeoJSON</a>. Tallahassee: <a href="/downloads/tallahassee-crashes.csv" download>CSV</a>, <a href="/downloads/tallahassee-crashes.geojson" download>GeoJSON</a>.
        </li>
        <li>
          <strong className="font-medium">People</strong>, one row per person on a crash report: role (driver, passenger or not in a vehicle) and injury severity, linked to the crash by report number.{" "}
          <a href="/downloads/leon-county-people.csv" download>Leon County CSV</a>, <a href="/downloads/tallahassee-people.csv" download>Tallahassee CSV</a>.
        </li>
      </ul>
      <p>
        The people files leave out age, sex and home ZIP code. With a crash&rsquo;s exact time and place, those could identify someone who was hurt. The records never include names.
      </p>
      <p>
        Every field is explained in the <a href="https://github.com/Open-Data-Tallahassee/vision-zero/tree/main/data/public">data guide on GitHub</a>, which also has the same files. They&rsquo;re published under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>: use them for anything, and credit &ldquo;Vision Zero TLH (Open Tallahassee), from Florida Department of Highway Safety and Motor Vehicles crash records&rdquo;.
      </p>

      <h2 id="request">Requesting data</h2>
      <p>
        If the downloads don&rsquo;t cover what you need, <Link href="/data/request">request it</Link>. Requests are free and reviewed by a person. We share crash-level details and totals, never names, contact details or records that could identify individual people.
      </p>
    </TextPage>
  );
}
