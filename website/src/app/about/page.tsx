import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/site/TextPage";

export const metadata: Metadata = {
  title: "About",
  description: "Vision Zero TLH is a free community crash map made by Open Tallahassee volunteers.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <TextPage photo={2} title="About this site" lead={<p>A free crash map made by neighbors, for neighbors.</p>}>
      <p>
        <a href="https://www.opentlh.com/">Open Tallahassee</a> is an open journalism project run by residents who want to keep their neighbors informed and connected, without the political drama.
      </p>
      <p>It started at a Tallahassee coffee shop, where a few of us talked about making a public map of traffic crashes. This is that map.</p>

      <h2>What we&rsquo;re trying to do</h2>
      <p>Make crash records easy for anyone to read, explain them honestly, and keep them free. We&rsquo;re not a government agency, and this isn&rsquo;t an official source.</p>

      <h2>How to take part</h2>
      <ul>
        <li><Link href="/map">Explore the map</Link> and share what you find with your neighbors.</li>
        <li><Link href="/cities/request">Ask for a map of your Florida city</Link>.</li>
        <li><Link href="/support">Support updated data</Link>.</li>
        <li>The code is open. Help on <a href="https://github.com/Open-Data-Tallahassee/vision-zero">GitHub</a>.</li>
      </ul>
    </TextPage>
  );
}
