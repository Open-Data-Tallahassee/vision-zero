import type { Metadata } from "next";
import TextPage from "@/components/site/TextPage";
import { POLICY_VERSIONS } from "@/server/policies/versions";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What information Vision Zero TLH and its service providers handle when you visit.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const v = POLICY_VERSIONS.privacy;
  return (
    <TextPage photo={3} title="Privacy Policy" lead={<p>Version {v.version}. {v.effective ? `Effective ${v.effective}.` : "Draft: this text hasn't been approved by the publisher yet."}</p>}>
      <h2>Who runs this site</h2>
      <p>Vision Zero TLH is published by volunteers with <a href="https://www.opentlh.com/">Open Tallahassee</a>. A privacy contact will be listed here before any form opens.</p>

      <h2>When you browse</h2>
      <ul>
        <li>The site doesn&rsquo;t set cookies, and we haven&rsquo;t added analytics or advertising trackers.</li>
        <li>Our host, Netlify, receives standard request information such as your IP address and browser, as every web host does, and keeps server logs under its own policy.</li>
        <li>The map is drawn by Mapbox. Your browser asks Mapbox for map tiles for the area you view, and Mapbox&rsquo;s library may send usage information to Mapbox under Mapbox&rsquo;s privacy policy.</li>
        <li>Your map filters live in the page address so you can share them. They aren&rsquo;t sent to us beyond loading the matching crashes.</li>
      </ul>

      <h2>When you send a request</h2>
      <p>Request forms aren&rsquo;t open yet. When they are:</p>
      <ul>
        <li>City requests collect a city or county, and optionally an email and a message. Data requests collect the area, dates, what you need and a reply email; what you&rsquo;ll use it for is optional.</li>
        <li>We record which version of these policies you accepted and when.</li>
        <li>Requests are private. We publish only the number of requests per city.</li>
        <li>We review requests monthly and delete contact details and messages after 12 months, unless you&rsquo;ve agreed we can keep them while we work together. You can ask us to delete them sooner.</li>
      </ul>

      <h2>Donations</h2>
      <p>Donations aren&rsquo;t open yet. When they are, the payment provider handles payment details under its own policy; we don&rsquo;t see your card.</p>

      <h2>Crash records</h2>
      <p>The map shows crash-level details only: date, time, location, whether it was fatal, who was involved and how many vehicles and people. It never shows names or other information about individual people.</p>

      <h2>Changes</h2>
      <p>We&rsquo;ll change the version and date above when this policy changes.</p>
    </TextPage>
  );
}
