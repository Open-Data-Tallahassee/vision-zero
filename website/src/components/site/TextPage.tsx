import Image from "next/image";
import Link from "next/link";
import credits from "@/content/photo-credits.json";
import PhotoCredit from "./PhotoCredit";

// A text page from the printed-report direction. On a phone: a short photo band, the title, then the text.
// From lg up, the photo and side notes fill the left 42% and the text hangs from the axis.
export default function TextPage({
  title,
  lead,
  returnTo,
  aside,
  photo = 0,
  children,
}: {
  title: string;
  lead?: React.ReactNode;
  returnTo?: string;
  aside?: React.ReactNode;
  /** Which of the site's photographs to show. */
  photo?: number;
  children: React.ReactNode;
}) {
  const p = credits[photo % credits.length];
  return (
    <article className="pb-[clamp(5rem,10vw,9rem)]">
      <div className="grid gap-[var(--gap)] lg:grid-cols-[42%_minmax(0,1fr)] lg:gap-0">
        <div className="lg:p-[var(--gap)] lg:pr-12">
          {/* The photo and side notes stick together; the photo gives up height so the notes always fit on screen. */}
          <div className="lg:sticky lg:top-[var(--gap)] lg:flex lg:max-h-[calc(100svh-2*var(--gap))] lg:flex-col">
            <div className={`relative mx-[var(--gap)] mt-[var(--gap)] h-[22svh] overflow-hidden bg-surface-2 lg:mx-0 lg:mt-0 lg:h-auto ${aside ? "lg:min-h-[12rem] lg:flex-1" : "lg:aspect-[4/5]"}`}>
              <Image src={p.src} alt={p.alt} fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover grayscale contrast-[1.05]" />
              <PhotoCredit src={p.src} />
            </div>
            {aside && <div className="mt-6 hidden shrink-0 pl-5 lg:block">{aside}</div>}
          </div>
        </div>
        <div className="page-frame pt-8 lg:pl-0 lg:pt-[clamp(3rem,7vw,6rem)]">
          {returnTo && (
            <Link href={returnTo} className="button-quiet mb-8">
              Return to your map
            </Link>
          )}
          <h1 className="text-head" data-rise>{title}</h1>
          {lead && (
            <div className="mt-6 max-w-[56ch] text-lead" data-rise style={{ ["--rise-i" as string]: 1 }}>
              {lead}
            </div>
          )}
          <div className="prose-page mt-4">{children}</div>
        </div>
      </div>
    </article>
  );
}
