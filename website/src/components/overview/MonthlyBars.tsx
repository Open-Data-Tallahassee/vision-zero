"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { GEOGRAPHY_LABELS, type Geography } from "@/lib/map-state";
import type { MonthlyByGeography } from "@/server/crashes";

type Measure = "crashes" | "fatalCrashes";

const MEASURES: Record<Measure, { label: string }> = {
  crashes: { label: "All crashes" },
  fatalCrashes: { label: "Fatal crashes" },
};

const monthName = (m: string, style: "short" | "long" = "short") =>
  new Date(`${m}-15T12:00:00Z`).toLocaleDateString("en-US", { month: style, year: "numeric", timeZone: "UTC" });

const fmt = (n: number) => n.toLocaleString("en-US");

function Toggle<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Record<T, string>; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex gap-[var(--gap)]">
      {(Object.keys(options) as T[]).map((key) => (
        <button
          key={key}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={`min-h-11 px-4 text-body transition-colors ${value === key ? "bg-accent text-accent-ink" : "bg-oak-1 text-oak-ink hover:bg-oak-2"}`}
        >
          {options[key]}
        </button>
      ))}
    </div>
  );
}

export default function MonthlyBars({ monthly }: { monthly: MonthlyByGeography }) {
  const [geo, setGeo] = useState<Geography>("tallahassee");
  const [measure, setMeasure] = useState<Measure>("fatalCrashes");
  const [active, setActive] = useState<string | null>(null);

  const months = monthly[geo];
  const values = months.map((m) => m[measure]);
  const total = values.reduce((a, b) => a + b, 0);
  const max = Math.max(...values, 1);
  // The bar the page is about: the worst month for the chosen measure.
  const peak = months[values.indexOf(Math.max(...values))].month;
  const labelled = new Set([peak, months[0].month, months[months.length - 1].month]);

  const quarters = useMemo(() => {
    const q = new Map<string, number>();
    for (const m of months) {
      const key = `${m.month.slice(0, 4)} Q${Math.ceil(Number(m.month.slice(5)) / 3)}`;
      q.set(key, (q.get(key) ?? 0) + m[measure]);
    }
    return [...q];
  }, [months, measure]);
  const qMax = Math.max(...quarters.map(([, v]) => v), 1);
  const qPeak = quarters.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  const shown = active ? months.find((m) => m.month === active) : null;
  const mapHref = `/map?${new URLSearchParams({ ...(geo === "leon" ? { geo } : {}), ...(measure === "fatalCrashes" ? { severity: "fatal" } : {}) })}`;

  return (
    <section aria-labelledby="by-month" className="relative mt-[var(--gap)] flex flex-col bg-oak text-oak-ink lg:min-h-[90svh]" data-ui>
      <div className="page-frame flex flex-wrap items-start justify-between gap-8 pt-14">
        <div data-rise>
          <p className="text-[clamp(5.5rem,10vw,10.5rem)] leading-[0.9] tracking-[-0.04em] tabular-nums" aria-live="polite">
            {fmt(total)}
          </p>
          <h2 id="by-month" className="mt-3 text-[clamp(1.375rem,1rem+1vw,1.75rem)] leading-tight">
            {MEASURES[measure].label.toLowerCase()} in {geo === "leon" ? "Leon County" : "Tallahassee"}
          </h2>
          <p className="mt-1 text-body">January 2020 to June 2021, by month</p>
        </div>
        <div className="flex flex-col gap-[var(--gap)]" data-rise style={{ ["--rise-i" as string]: 1 }}>
          <Toggle<Geography> label="Area" value={geo} options={{ tallahassee: "Tallahassee", leon: GEOGRAPHY_LABELS.leon }} onChange={setGeo} />
          <Toggle<Measure> label="Measure" value={measure} options={{ crashes: MEASURES.crashes.label, fatalCrashes: MEASURES.fatalCrashes.label }} onChange={setMeasure} />
          <p className="min-h-[1.5em] text-body" aria-live="polite">
            {shown ? `${monthName(shown.month, "long")}: ${fmt(shown[measure])} ${measure === "crashes" ? "crashes" : "fatal crashes"}` : (
              <Link href={mapHref} className="text-oak-ink underline decoration-2">
                See these on the map
              </Link>
            )}
          </p>
        </div>
      </div>

      {/* Desktop and tablet: one bar per month standing on the bottom edge. */}
      <ol className="mt-auto hidden h-[44vh] grid-cols-[repeat(18,minmax(0,1fr))] lg:h-[58vh] items-end gap-[var(--gap)] pt-10 md:grid" aria-label={`${MEASURES[measure].label} by month`}>
        {months.map((m) => {
          const v = m[measure];
          const isPeak = m.month === peak;
          return (
            <li
              key={m.month}
              tabIndex={0}
              aria-label={`${monthName(m.month, "long")}: ${fmt(v)}`}
              onMouseEnter={() => setActive(m.month)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(m.month)}
              onBlur={() => setActive(null)}
              className="group relative flex h-full flex-col justify-end outline-offset-[-3px]"
            >
              <span className={`mb-2 text-center text-[clamp(1.125rem,1.6vw,1.75rem)] tabular-nums transition-opacity ${labelled.has(m.month) || active === m.month ? "opacity-100" : "opacity-0"}`} aria-hidden="true">
                {fmt(v)}
              </span>
              <span
                className={`block w-full transition-[height,background-color] duration-500 ease-out ${isPeak ? "bg-accent" : active === m.month ? "bg-oak-3" : "bg-oak-2"}`}
                style={{ height: `${v === 0 ? 0.6 : (v / max) * 88}%` }}
              />
              <span className="absolute -bottom-0 left-0 right-0 translate-y-full pt-2 text-center text-small" aria-hidden="true">
                {m.month.endsWith("-01") ? m.month.slice(0, 4) : ""}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="hidden h-12 md:block" />

      {/* Phone: quarters as rows growing from the left edge. */}
      <ol className="mt-10 space-y-[6px] pb-10 md:hidden" aria-label={`${MEASURES[measure].label} by quarter`}>
        {quarters.map(([q, v]) => (
          <li key={q} className="flex items-center gap-3 pr-[var(--margin)]">
            <span
              className={`flex h-9 items-center justify-end pr-2 text-[17px] tabular-nums transition-[width] duration-500 ${q === qPeak ? "bg-accent text-accent-ink" : "bg-oak-2"}`}
              style={{ width: `max(3.5rem, ${(v / qMax) * 78}%)` }}
            >
              {fmt(v)}
            </span>
            <span className="shrink-0 text-small">{q}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
