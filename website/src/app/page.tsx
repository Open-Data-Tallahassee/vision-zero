import Image from "next/image";
import Link from "next/link";
import MonthlyBars from "@/components/overview/MonthlyBars";
import JsonLd from "@/components/site/JsonLd";
import PhotoCredit from "@/components/site/PhotoCredit";
import { LEON_PATH, LEON_VIEWBOX, TALLAHASSEE_PATH } from "@/content/leon-outline";
import { formatCoverage, formatCount } from "@/lib/format";
import { getCoverage, queryCrashes, summarizeByMonth } from "@/server/crashes";

export const metadata = {
  alternates: { canonical: "/" },
};

const photo = {
  woodward: { src: "/images/woodward-crosswalk.jpg", alt: "Cars on Woodward Avenue approaching a pedestrian crossing at Florida State University", w: 1600, h: 1192 },
  centerville: { src: "/images/centerville-signal.jpg", alt: "Centerville Road curving toward a traffic signal, lined with oaks", w: 1600, h: 1200 },
  fourth: { src: "/images/fourth-avenue-crosswalk.jpg", alt: "A two-lane street with a traffic signal at Fourth Avenue near the Payne Community Center", w: 1600, h: 1053 },
  canopy: { src: "/images/miccosukee-canopy.jpg", alt: "Trailhead sign for the Miccosukee Canopy Road Greenway beside a tree-lined road", w: 1600, h: 1200 },
};

export default async function Home() {
  const coverage = await getCoverage();
  const range = { from: coverage.start, to: coverage.end, severity: "all", user: "all" } as const;
  const [city, county] = await Promise.all([queryCrashes({ ...range, geo: "tallahassee" }), queryCrashes({ ...range, geo: "leon" })]);
  const monthly = { tallahassee: summarizeByMonth(city), leon: summarizeByMonth(county) };
  const period = formatCoverage(coverage);

  return (
    <>
      <JsonLd />

      {/* Hero: a two-by-two board of tiles. */}
      <section aria-labelledby="title" className="grid gap-[var(--gap)] p-[var(--gap)] lg:h-[calc(100svh-60px-2*var(--gap))] lg:min-h-[640px] lg:grid-cols-2 lg:grid-rows-2">
        <div className="flex min-h-[46svh] flex-col justify-end bg-surface p-5 sm:min-h-[38svh] sm:p-6 lg:min-h-0">
          <h1 id="title" className="text-display">
            Vision Zero <span className="block">TLH</span>
          </h1>
          <p className="mt-6 max-w-[34ch] text-lead">A free map of traffic crashes in Tallahassee and Leon County, built by neighbors.</p>
          <Link href="/map" className="button mt-8 self-start sm:hidden">Explore the map</Link>
        </div>
        <div className="shutter relative aspect-[4/3] overflow-hidden bg-surface-2 lg:aspect-auto">
          <Image src={photo.woodward.src} alt={photo.woodward.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover grayscale contrast-[1.05]" />
          <PhotoCredit src={photo.woodward.src} />
        </div>
        <div className="drift relative hidden overflow-hidden bg-surface-2 lg:block">
          <Image src={photo.centerville.src} alt={photo.centerville.alt} fill sizes="50vw" className="object-cover grayscale contrast-[1.05]" />
          <PhotoCredit src={photo.centerville.src} />
        </div>
        <div className="grid grid-cols-2 gap-[var(--gap)]">
          <div className="flex min-h-[44vw] flex-col justify-between gap-6 sm:min-h-0 bg-ink p-5 text-ground sm:aspect-square lg:aspect-auto">
            <p className="text-[clamp(1.0625rem,0.9rem+0.8vw,1.5rem)] leading-snug">
              {formatCount(county.totals.crashes)} crashes were reported in Leon County from {period}.
            </p>
            <Link href="/map" className="self-start text-body text-ground underline decoration-2">
              Explore the map
            </Link>
          </div>
          <div className="flex min-h-[44vw] flex-col justify-between gap-6 sm:min-h-0 bg-accent p-5 text-accent-ink sm:aspect-square lg:aspect-auto">
            <p className="text-[clamp(1.0625rem,0.9rem+0.8vw,1.5rem)] leading-snug">
              {county.totals.fatalCrashes} of them killed at least one person. Vision Zero means no one.
            </p>
            <Link href="/map?geo=leon&severity=fatal" className="self-start text-body underline decoration-2">
              Show fatal crashes
            </Link>
          </div>
        </div>
      </section>

      <MonthlyBars monthly={monthly} />

      {/* Showcase: square plate and spare text. */}
      <section aria-labelledby="find" className="grid min-h-[88svh] gap-10 py-24 lg:grid-cols-2 lg:gap-0 lg:py-0">
        <div className="page-frame flex items-center lg:px-10">
          <div className="relative aspect-square w-full overflow-hidden bg-surface-2" data-rise>
            <Image src={photo.canopy.src} alt={photo.canopy.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover grayscale contrast-[1.05]" />
          <PhotoCredit src={photo.canopy.src} />
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="50" cy="50" r="43" fill="none" stroke="var(--accent)" strokeWidth="1.2" />
              <circle cx="50" cy="50" r="3" fill="var(--fatal)" />
            </svg>
          </div>
        </div>
        <div className="page-frame flex flex-col justify-between gap-12 lg:py-[12svh] lg:pl-0 lg:pr-[var(--margin)]">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-lead" data-rise aria-label="Jump to a road user">
            <li><Link href="/map?user=pedestrian" className="no-underline hover:underline">Pedestrians</Link></li>
            <li><Link href="/map?user=bicyclist" className="text-muted no-underline hover:text-ink hover:underline">Bicyclists</Link></li>
            <li><Link href="/map?user=motor_vehicle" className="text-muted no-underline hover:text-ink hover:underline">Drivers</Link></li>
          </ul>
          <div data-rise style={{ ["--rise-i" as string]: 1 }}>
            <h2 id="find" className="text-head">Find the crashes on your street</h2>
            <p className="mt-12 max-w-[38ch]">
              Every crash with a location is a point on the map. Filter by date, by who was involved, and by whether someone died. Every view has its own link, so you can send exactly what you found to a neighbor or a city commissioner.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-[var(--gap)] sm:grid-cols-2" data-rise style={{ ["--rise-i" as string]: 2 }}>
            <Link href="/map" className="button min-h-[72px] justify-start">Open the crash map</Link>
            <Link href="/data#reading-the-map" className="button-quiet min-h-[72px] justify-start">How to read the map</Link>
          </div>
        </div>
      </section>

      {/* Statement tiles. */}
      <section aria-labelledby="goal" className="p-[var(--gap)] pt-0">
        <div className="grid grid-cols-2 gap-[var(--gap)] lg:grid-cols-12 lg:grid-rows-[38svh_38svh]">
          <div className="col-span-2 flex min-h-[46svh] items-end bg-oak p-5 md:min-h-[30svh] text-oak-ink lg:col-span-8 lg:row-span-2 lg:min-h-0">
            <h2 id="goal" className="text-[clamp(3.5rem,9vw,8.25rem)] uppercase leading-[0.86] tracking-[-0.03em]" data-rise>
              Zero is
              <br />
              the goal
            </h2>
          </div>
          <div className="flex aspect-square flex-col justify-end overflow-hidden bg-accent p-5 text-accent-ink lg:col-span-4 lg:aspect-auto">
            <p className="text-[clamp(3.5rem,9vw,8.25rem)] leading-[0.86] tracking-[-0.03em] tabular-nums">{county.totals.pedestrian}</p>
            <p className="mt-3 text-body">crashes involved a person on foot</p>
          </div>
          <div className="relative aspect-square overflow-hidden bg-surface-2 lg:col-span-4 lg:aspect-auto">
            <Image src={photo.fourth.src} alt={photo.fourth.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover grayscale contrast-[1.05]" />
          <PhotoCredit src={photo.fourth.src} />
          </div>
        </div>
        <div className="grid lg:grid-cols-12">
          <div className="px-5 py-14 lg:col-span-6 lg:col-start-7 lg:px-10 lg:py-20">
            <p className="text-[clamp(1.125rem,0.95rem+0.6vw,1.5rem)] leading-[1.35]" data-rise>
              Vision Zero is the idea that no one should die or be seriously hurt getting around their city. Cities that adopt it treat each death as a design failure, not bad luck: a crossing too far from the bus stop, a road built for speed through a neighborhood. Fixing those starts with seeing where crashes happen. Florida records every reported crash, but the records are hard for most people to read. This site puts {formatCount(county.totals.crashes)} of them on one map, explains what the numbers can and can&rsquo;t tell you, and stays free for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Closing call: three photographs, then a field. */}
      <section aria-labelledby="your-city">
        <div className="grid grid-cols-2 lg:grid-cols-3">
          {[photo.centerville, photo.canopy, photo.woodward].map((p, i) => (
            <div key={p.src} className={`relative overflow-hidden bg-surface-2 ${i === 0 ? "col-span-2 aspect-[4/3] lg:col-span-1 lg:aspect-auto" : "aspect-square lg:aspect-auto"} lg:h-[40svh]`}>
              <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover grayscale contrast-[1.05]" style={{ objectPosition: i === 1 ? "30% 60%" : "50% 55%" }} />
              <PhotoCredit src={p.src} />
            </div>
          ))}
        </div>
        <div className="page-frame grid min-h-[44svh] items-center bg-accent py-16 text-accent-ink lg:grid-cols-12">
          <div className="lg:col-span-7" data-rise>
            <h2 id="your-city" className="text-[clamp(1.375rem,1rem+1vw,1.875rem)] leading-snug">Live elsewhere in Florida?</h2>
            <p className="mt-3 text-[clamp(1.25rem,1rem+0.8vw,1.625rem)] leading-snug">
              Crash records exist for every county.{" "}
              <Link href="/cities/request" className="underline decoration-4 underline-offset-[6px]">
                Ask for a map of your city
              </Link>{" "}
              and we&rsquo;ll see what it would take.
            </p>
            <p className="mt-8 max-w-[52ch]">Requests are free and don&rsquo;t need an account. Tallahassee comes first; after that we look at local need, available data and who can help.</p>
          </div>
        </div>
      </section>

      {/* About: wide photo, colour tile, facts. */}
      <section aria-labelledby="about-data" className="page-frame py-[clamp(6rem,12vw,10rem)]">
        <h2 id="about-data" className="text-[clamp(2.25rem,4vw,3.75rem)] leading-none" data-rise>
          What the map covers
        </h2>
        <p className="mt-6 max-w-[56ch] text-lead" data-rise style={{ ["--rise-i" as string]: 1 }}>
          Crash reports from {period}, placed inside Leon County or Tallahassee city limits. Newer records cost money to obtain; donations go to buying them first.
        </p>
        <div className="mt-[72px] grid gap-4 lg:grid-cols-12">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface-2 lg:col-span-8 lg:aspect-[16/10]">
            <Image src={photo.fourth.src} alt={photo.fourth.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover grayscale contrast-[1.05]" style={{ objectPosition: "50% 70%" }} />
          <PhotoCredit src={photo.fourth.src} />
            <p className="absolute right-0 top-0 hidden w-[320px] bg-ground p-5 text-body lg:block">
              Locations come from the officer&rsquo;s report. A crash with no usable location is counted in the totals on the data page, never guessed onto the map.
            </p>
          </div>
          <p className="text-body lg:hidden">
            Locations come from the officer&rsquo;s report. A crash with no usable location is counted in the totals on the data page, never guessed onto the map.
          </p>
          <div className="lg:col-span-4">
            <div className="flex aspect-[3/2] items-center justify-center bg-oak p-6 lg:aspect-auto lg:h-[60%]">
              <svg viewBox={LEON_VIEWBOX} className="h-full max-h-[260px] w-full" role="img" aria-label="Outline of Leon County with Tallahassee city limits shaded">
                <path d={LEON_PATH} fill="var(--field-2-step-2)" />
                <path d={TALLAHASSEE_PATH} fill="var(--accent)" />
              </svg>
            </div>
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <dt className="text-small text-muted">Period</dt>
                <dd className="text-body">{period}</dd>
              </div>
              <div>
                <dt className="text-small text-muted">Crashes on the map</dt>
                <dd className="text-body tabular-nums">{formatCount(county.totals.crashes)}</dd>
              </div>
              <div>
                <dt className="text-small text-muted">Source</dt>
                <dd className="text-body">Florida DHSMV</dd>
              </div>
              <div>
                <dt className="text-small text-muted">Next update</dt>
                <dd className="text-body">
                  <Link href="/support" className="text-link">When funded</Link>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
