import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/site/TextPage";
import { POLICY_VERSIONS } from "@/server/policies/versions";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using the free Vision Zero TLH crash map.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const v = POLICY_VERSIONS.terms;
  return (
    <TextPage photo={6} title="Terms of Service" lead={<p>Version {v.version}. {v.effective ? `Effective ${v.effective}.` : "Draft: this text hasn't been approved by the publisher yet."}</p>}>
      <h2>A free community resource</h2>
      <p>This site is run by volunteers with Open Tallahassee. It&rsquo;s free to use and isn&rsquo;t an official government source.</p>

      <h2>About the data</h2>
      <p>
        The map shows reported crashes from Florida Department of Highway Safety and Motor Vehicles records for a limited period. It may be incomplete and isn&rsquo;t a measure of how risky a road is. Read <Link href="/data">Understand the data</Link> before relying on it.
      </p>

      <h2>Using the site</h2>
      <ul>
        <li>Use it lawfully, and don&rsquo;t try to disrupt it or scrape it. The <Link href="/data#downloads">downloads</Link> have the same data.</li>
        <li>The downloads are published under CC BY 4.0: you can reuse them for anything if you credit the source as the data page describes. For anything they don&rsquo;t cover, <Link href="/data/request">request it</Link>.</li>
      </ul>

      <h2>Requests</h2>
      <ul>
        <li>A city request asks for a new map somewhere else in Florida. A data request asks for data from this map. Both are free.</li>
        <li>Neither guarantees a reply date or delivery.</li>
      </ul>

      <h2>Donations</h2>
      <p>Donations are voluntary support for the project. They don&rsquo;t buy access, priority, or anything else.</p>

      <h2>Changes</h2>
      <p>We&rsquo;ll change the version and date above when these terms change.</p>
    </TextPage>
  );
}
