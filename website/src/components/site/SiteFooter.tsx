import Link from "next/link";
import credits from "@/content/photo-credits.json";
import { SITE } from "@/config/site";

const COLUMNS = [
  {
    title: "Explore",
    links: [
      { href: "/map", label: "Crash map" },
      { href: "/data", label: "Understand the data" },
      { href: "/data/request", label: "Request data" },
    ],
  },
  {
    title: "Take part",
    links: [
      { href: "/cities/request", label: "Request a Florida city" },
      { href: "/support", label: "Support the work" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Policies",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="on-dark mt-[var(--gap)] overflow-hidden bg-oak text-oak-ink">
      <p
        aria-hidden="true"
        className="page-frame -mb-[0.12em] whitespace-nowrap pt-24 text-[clamp(2.25rem,10.2vw,10.5rem)] leading-[0.9] tracking-[-0.05em]"
      >
        Vision Zero TLH
      </p>
      <div className="page-frame grid gap-12 pb-10 pt-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="sr-only">{SITE.name}</h2>
          <ul className="space-y-2 text-[clamp(1.625rem,1.2rem+1.4vw,2.25rem)] leading-tight">
            <li>Tallahassee &amp; Leon County</li>
            <li>
              <a href={SITE.publisher.url} className="text-accent no-underline hover:underline">
                Open Tallahassee
              </a>
            </li>
            <li>
              <a href={SITE.repo} className="text-accent no-underline hover:underline">
                Source on GitHub
              </a>
            </li>
          </ul>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-body text-accent">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-body text-oak-ink no-underline hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="page-frame flex flex-col gap-3 pb-8 pt-12 text-small sm:flex-row sm:justify-between">
        <p className="max-w-[80ch]">
          Free for everyone. Not a government website. Crash records: Florida Department of Highway Safety and Motor Vehicles.
          Photographs:{" "}
          {credits.map((c, i) => (
            <span key={c.src}>
              <a href={c.page} className="underline">
                {c.title}
              </a>{" "}
              by {c.creator}, <a href={c.licenseUrl} className="underline">{c.license}</a>
              {i < credits.length - 1 ? "; " : "."}
            </span>
          ))}
        </p>
        <a href="#top" className="shrink-0 underline">
          Back to top
        </a>
      </div>
    </footer>
  );
}
