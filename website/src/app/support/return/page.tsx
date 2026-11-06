import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/site/TextPage";

export const metadata: Metadata = {
  title: "Thanks for visiting",
  robots: { index: false, follow: false },
};

// The payment provider sends people back here. A return link alone doesn't prove a payment, so this page
// never says a donation succeeded; confirmation comes from the provider's own receipt.
export default function SupportReturnPage() {
  return (
    <TextPage photo={7} title="Back from the donation page">
      <p>If you completed a donation, your payment provider will send a receipt by email. That receipt is the confirmation. Thank you.</p>
      <p>If you canceled, that&rsquo;s fine. Nothing on this site changes either way.</p>
      <p className="!mt-8 flex flex-wrap gap-[var(--gap)]">
        <Link href="/map" className="button">Return to the map</Link>
        <Link href="/data" className="button-quiet">Understand the data</Link>
      </p>
    </TextPage>
  );
}
