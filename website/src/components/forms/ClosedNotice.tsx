import Link from "next/link";

export default function ClosedNotice({ what }: { what: string }) {
  return (
    <div className="mt-10 max-w-[44rem] bg-surface p-6">
      <h2 className="text-lead">This form isn&rsquo;t open yet</h2>
      <p className="mt-3">
        We&rsquo;ll start accepting {what} once a volunteer is lined up to read them and our privacy policy has been approved. Until then, nothing typed here would reach anyone, so there&rsquo;s no form.
      </p>
      <p className="mt-3">
        You can follow progress on <a href="https://github.com/Open-Data-Tallahassee/vision-zero" className="text-link">GitHub</a> or <Link href="/map" className="text-link">keep exploring the map</Link>.
      </p>
    </div>
  );
}
