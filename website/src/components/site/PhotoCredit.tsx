import credits from "@/content/photo-credits.json";

export type PhotoSrc = (typeof credits)[number]["src"];

export const creditFor = (src: string) => {
  const c = credits.find((x) => x.src === src);
  if (!c) throw new Error(`No credit recorded for ${src}`);
  return c;
};

/** A small credit on the photograph itself: the author links to the source page, the licence to its terms. */
export default function PhotoCredit({ src, side = "left" }: { src: string; side?: "left" | "right" }) {
  const c = creditFor(src);
  return (
    <p className={`absolute bottom-0 ${side === "left" ? "left-0" : "right-0"} z-10 max-w-full bg-ground px-5 py-1 text-small`}>
      Photo:{" "}
      <a href={c.page} className="underline" title={c.title}>
        {c.creator}
      </a>
      ,{" "}
      <a href={c.licenseUrl} className="underline">
        {c.license}
      </a>
    </p>
  );
}
