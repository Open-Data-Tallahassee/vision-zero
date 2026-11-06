import Image from "next/image";
import Link from "next/link";
import PhotoCredit, { creditFor } from "@/components/site/PhotoCredit";
import { SITE } from "@/config/site";

export const metadata = { title: "Page not found" };

const PHOTO = creditFor("/images/miccosukee-canopy.jpg");

const LINKS = [
  { href: "/map", label: "Explore the crash map" },
  { href: "/data", label: "Understand the data" },
  { href: "/cities/request", label: "Request a Florida city" },
  { href: "/support", label: "Support the work" },
];

// A board of four tiles like the overview. On a phone: the message and the main action first.
// Rows are plain 1fr (auto minimum) so a tall message grows its row instead of spilling under the next tile.
export default function NotFound() {
  return (
    <section aria-labelledby="not-found" className="grid gap-[var(--gap)] p-[var(--gap)] md:min-h-[max(640px,calc(100svh-60px-2*var(--gap)))] md:grid-cols-2 md:grid-rows-[1fr_1fr]">
      <div className="flex min-h-[52svh] flex-col justify-between bg-surface p-5 sm:p-6 md:order-2 md:min-h-0">
        <p aria-hidden="true" className="text-display tabular-nums">
          404
        </p>
        <div data-rise>
          <h1 id="not-found" className="text-[clamp(2rem,1.2rem+3.4vw,3.75rem)] leading-[1.02] tracking-[-0.02em]">
            This page isn&rsquo;t on the map.
          </h1>
          <p className="mt-4 max-w-[36ch] text-lead">The link may be old, or the address mistyped. Nothing is wrong with your connection.</p>
          <Link href="/map" className="button mt-6">
            Explore the map
          </Link>
        </div>
      </div>

      <div className="shutter relative aspect-[4/3] overflow-hidden bg-surface-2 md:order-1 md:aspect-auto">
        <Image src={PHOTO.src} alt={PHOTO.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover grayscale contrast-[1.05]" />
        <PhotoCredit src={PHOTO.src} />
      </div>

      <nav aria-label="Where to next" data-rise className="on-dark flex flex-col justify-end bg-oak p-5 text-oak-ink sm:p-6 md:order-3">
        <ul className="space-y-1 text-[clamp(1.5rem,1.1rem+1.6vw,2.25rem)] leading-tight">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-oak-ink no-underline hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-h-[28svh] flex-col justify-between gap-6 bg-accent p-5 text-accent-ink sm:p-6 md:order-4 md:min-h-0">
        <p className="text-[clamp(1.0625rem,0.9rem+0.8vw,1.5rem)] leading-snug">
          Followed a link from somewhere and ended up here? Tell us, so we can fix it.
        </p>
        <a href={`${SITE.repo}/issues/new`} className="self-start text-body underline decoration-2">
          Report a broken link
        </a>
      </div>
    </section>
  );
}
