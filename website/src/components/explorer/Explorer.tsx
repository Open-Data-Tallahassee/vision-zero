"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { formatCount, formatDate } from "@/lib/format";
import {
  GEOGRAPHIES,
  GEOGRAPHY_LABELS,
  ROAD_USER_LABELS,
  ROAD_USERS,
  SEVERITIES,
  defaultMapState,
  isDefaultFilters,
  serializeMapState,
  type MapState,
  type View,
} from "@/lib/map-state";
import type { Coverage, CrashFeature, CrashQueryResult, CrashTotals } from "@/server/crashes/types";
import { LEON_BOUNDS, TALLAHASSEE_VIEW, type MapTarget } from "./CrashMapView";

const CrashMapView = dynamic(() => import("./CrashMapView"), { ssr: false, loading: () => <p className="p-6">Loading the map…</p> });

// Rough Leon County bounds, used only to tell people when they have panned outside the data.
const inLeonCounty = (v: View) => v.lng > -84.75 && v.lng < -84.03 && v.lat > 30.25 && v.lat < 30.72;

const ROAD_USER_TEXT: Record<CrashFeature["roadUsers"][number], string> = {
  pedestrian: "Pedestrian",
  bicyclist: "Bicyclist",
  motor_vehicle: "Motor vehicle",
};

type Status = { kind: "loading" } | { kind: "ready" } | { kind: "error"; message: string };
// What the last finished request returned, tagged with the query it answered.
type Loaded = { key: string; ok: true } | { key: string; ok: false; message: string };
const PAGE = 50;
const EMPTY: CrashFeature[] = [];

// Matches the lg breakpoint. On the server and phones this is false.
const WIDE = "(min-width: 1024px)";
const useWide = () =>
  useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(WIDE);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );

interface Props {
  initial: MapState;
  coverage: Coverage;
  initialTotals: CrashTotals;
}

export default function Explorer({ initial, coverage, initialTotals }: Props) {
  const [state, setState] = useState<MapState>(initial);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  // The latest successful results stay on screen while a new query loads.
  const [data, setData] = useState<CrashQueryResult | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mode, setMode] = useState<"map" | "list">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [target, setTarget] = useState<MapTarget | undefined>();
  const [retry, setRetry] = useState(0);
  const detailRef = useRef<HTMLHeadingElement>(null);
  const wide = useWide();

  const { geo, from, to, severity, user } = state;
  const query = useMemo(() => serializeMapState({ geo, from, to, severity, user }, coverage), [geo, from, to, severity, user, coverage]);
  const href = `/map${serializeMapState(state, coverage) ? `?${serializeMapState(state, coverage)}` : ""}`;

  // Keep the URL in step with the view so it can be shared, bookmarked and restored with Back.
  useEffect(() => {
    if (window.location.pathname + window.location.search !== href) window.history.replaceState(window.history.state, "", href);
  }, [href]);

  const key = `${query}#${retry}`;
  useEffect(() => {
    const ac = new AbortController();
    fetch(`/api/crashes?${query}`, { signal: ac.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`The server answered ${r.status}.`);
        return r.json() as Promise<CrashQueryResult>;
      })
      .then((result) => {
        setData(result);
        setLoaded({ key, ok: true });
        setShown(PAGE);
      })
      .catch((e: Error) => {
        if (e.name !== "AbortError") setLoaded({ key, ok: false, message: e.message });
      });
    return () => ac.abort();
  }, [query, key]);

  const status: Status = loaded?.key !== key ? { kind: "loading" } : loaded.ok ? { kind: "ready" } : { kind: "error", message: loaded.message };
  const features: CrashFeature[] = data?.features ?? EMPTY;
  const totals: CrashTotals = data?.totals ?? initialTotals;

  const update = useCallback((patch: Partial<MapState>) => setState((s) => ({ ...s, ...patch })), []);
  const onSelect = useCallback((id: string) => {
    update({ crash: id });
    requestAnimationFrame(() => detailRef.current?.focus());
  }, [update]);
  const onMove = useCallback((view: View) => update({ view }), [update]);

  const selected = state.crash ? features.find((c) => c.id === state.crash) : undefined;
  const selectionMissing = status.kind === "ready" && state.crash && !selected;
  const sorted = useMemo(() => [...features].sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)), [features]);
  const outside = state.view && !inLeonCounty(state.view);
  const returnTo = encodeURIComponent(href);
  const resetFilters = () => setState((s) => ({ ...defaultMapState(coverage), view: s.view }));

  // The selected crash. On phones it floats over the bottom of the map so the map does not move under the finger,
  // stopping above the Mapbox logo and attribution, which have to stay visible;
  // from lg up, and in the list on phones, it sits above the results.
  const sheet = !wide && mode === "map";
  const detail = selected && (
    <section
      aria-labelledby="detail-heading"
      className={`bg-surface p-5 ${sheet ? "absolute inset-x-2 bottom-10 z-10 max-h-[calc(60%-2.5rem)] overflow-auto shadow-[0_6px_24px_rgb(0_0_0/0.22)]" : ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="detail-heading" ref={detailRef} tabIndex={-1} className="text-lead">
          {selected.severity === "fatal" ? "Fatal crash" : "Crash"} on {formatDate(selected.date)}
        </h2>
        <button type="button" onClick={() => update({ crash: undefined })} className="min-h-11 px-3 text-small underline">Close</button>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        <div><dt className="text-small text-muted">Time</dt><dd>{selected.time}</dd></div>
        <div><dt className="text-small text-muted">Involved</dt><dd>{selected.roadUsers.map((u) => ROAD_USER_TEXT[u]).join(", ")}</dd></div>
        <div><dt className="text-small text-muted">Vehicles</dt><dd className="tabular-nums">{selected.vehicles}</dd></div>
        <div><dt className="text-small text-muted">People involved</dt><dd className="tabular-nums">{selected.people}</dd></div>
      </dl>
      <p className="mt-3 text-small text-muted">
        Report {selected.id}. &ldquo;People involved&rdquo; counts everyone in the crash, not only people hurt.{" "}
        <Link href={`/data?returnTo=${returnTo}#crashes-vs-people`} className="underline">Why</Link>
      </p>
    </section>
  );

  return (
    // Phone first: count and Filters button, then the map, then totals and coverage.
    // From lg up the first three sit in a left column and the results fill the right.
    <div className="grid gap-[var(--gap)] p-[var(--gap)] lg:grid-cols-[380px_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr]">
      <h1 className="sr-only">Tallahassee crash map</h1>

      <section aria-label="Filters" className="order-1 lg:col-start-1 lg:row-start-1">
        <div className="flex gap-[var(--gap)] lg:hidden">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="crash-filters"
            onClick={() => setFiltersOpen((o) => !o)}
            className={`min-h-12 shrink-0 px-5 text-body ${filtersOpen ? "bg-ink text-ground" : "bg-surface"}`}
          >
            {filtersOpen ? "Done" : "Filters"}
          </button>
          <p className="flex min-h-12 flex-1 items-center bg-surface px-4 py-1.5 text-small" aria-live="polite">
            <span>
              <span className="tabular-nums">{formatCount(totals.crashes)}</span> crashes ·{" "}
              <span className="tabular-nums text-fatal">{formatCount(totals.fatalCrashes)}</span> fatal · {geo === "leon" ? "Leon County" : "Tallahassee"}
              {/* The data is years old; say so before anyone reads the dots as recent. */}
              <span className="block tabular-nums text-muted">{formatDate(from, "short")} – {formatDate(to, "short")}</span>
            </span>
          </p>
        </div>
        <div id="crash-filters" className={`${filtersOpen ? "mt-[var(--gap)] block" : "hidden"} lg:mt-0 lg:block`}>
          <form className="space-y-6 bg-surface p-5" onSubmit={(e) => e.preventDefault()} aria-label="Crash filters">
            <fieldset>
              <legend className="text-body">Area</legend>
              <div className="mt-2 grid grid-cols-2 gap-[var(--gap)]">
                {GEOGRAPHIES.map((g) => (
                  <label key={g} className={`flex min-h-11 cursor-pointer items-center px-3 text-small has-[:focus-visible]:outline has-[:focus-visible]:outline-2 ${geo === g ? "bg-ink text-ground" : "bg-surface-2"}`}>
                    <input
                      type="radio"
                      name="geo"
                      value={g}
                      checked={geo === g}
                      onChange={() => {
                        update({ geo: g });
                        setTarget(g === "leon" ? { bounds: LEON_BOUNDS } : { view: TALLAHASSEE_VIEW });
                      }}
                      className="sr-only"
                    />
                    {GEOGRAPHY_LABELS[g]}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-body">Severity</legend>
              <div className="mt-2 grid grid-cols-3 gap-[var(--gap)]">
                {SEVERITIES.map((s) => (
                  <label key={s} className={`flex min-h-11 cursor-pointer items-center justify-center px-2 text-center text-small has-[:focus-visible]:outline has-[:focus-visible]:outline-2 ${severity === s ? (s === "fatal" ? "bg-fatal-dot text-[var(--map-paper)]" : "bg-ink text-ground") : "bg-surface-2"}`}>
                    <input type="radio" name="severity" value={s} checked={severity === s} onChange={() => update({ severity: s })} className="sr-only" />
                    {s === "all" ? "All" : s === "fatal" ? "Fatal" : "Nonfatal"}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-small text-muted">
                Fatal means at least one person died. Injury severity isn&rsquo;t in this data yet.{" "}
                <Link href={`/data?returnTo=${returnTo}#fatal`} className="underline">More</Link>
              </p>
            </fieldset>

            <div>
              <label htmlFor="user" className="text-body">Who was involved</label>
              <select id="user" value={user} onChange={(e) => update({ user: e.target.value as MapState["user"] })} className="field-input">
                {ROAD_USERS.map((u) => (
                  <option key={u} value={u}>{ROAD_USER_LABELS[u]}</option>
                ))}
              </select>
            </div>

            <fieldset>
              <legend className="text-body">Dates</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <label className="text-small">
                  From
                  <input type="date" value={from} min={coverage.start} max={to} required onChange={(e) => e.target.value && update({ from: e.target.value })} className="field-input" />
                </label>
                <label className="text-small">
                  To
                  <input type="date" value={to} min={from} max={coverage.end} required onChange={(e) => e.target.value && update({ to: e.target.value })} className="field-input" />
                </label>
              </div>
              <p className="mt-2 text-small text-muted">Records cover {formatDate(coverage.start, "short")} to {formatDate(coverage.end, "short")}.</p>
            </fieldset>

            <button type="button" onClick={resetFilters} disabled={isDefaultFilters(state, coverage)} className="button-quiet w-full disabled:cursor-not-allowed disabled:opacity-60">
              Reset filters
            </button>
            <button type="button" onClick={() => setFiltersOpen(false)} className="button w-full lg:hidden">
              Show {formatCount(totals.crashes)} crashes
            </button>
          </form>
        </div>
      </section>

      <section aria-labelledby="totals-heading" className="order-3 bg-surface p-5 lg:col-start-1 lg:row-start-2" aria-busy={status.kind === "loading"}>
          <h2 id="totals-heading" className="text-body">Showing</h2>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-4" aria-live="polite">
            <div>
              <dt className="text-small text-muted">Crashes</dt>
              <dd className="text-head tabular-nums">{formatCount(totals.crashes)}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">Fatal crashes</dt>
              <dd className="text-head tabular-nums text-fatal">{formatCount(totals.fatalCrashes)}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">Involving a pedestrian</dt>
              <dd className="text-lead tabular-nums">{formatCount(totals.pedestrian)}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">Involving a bicyclist</dt>
              <dd className="text-lead tabular-nums">{formatCount(totals.bicyclist)}</dd>
            </div>
          </dl>
          <p className="mt-4 text-small">
            People killed: not counted yet.{" "}
            <Link href={`/data?returnTo=${returnTo}#crashes-vs-people`} className="underline">About these numbers</Link>
          </p>
      </section>

      <section aria-labelledby="coverage-heading" className="order-4 self-start bg-accent p-5 text-accent-ink lg:col-start-1 lg:row-start-3">
          <h2 id="coverage-heading" className="text-body">What this map can&rsquo;t show yet</h2>
          <p className="mt-2 text-small">
            Crashes after {formatDate(coverage.end)} aren&rsquo;t here yet, because newer records have to be bought.{" "}
            <Link href="/support" className="underline">Help update this data</Link>
          </p>
          <ul className="mt-3 space-y-1 text-small">
            <li><Link href={`/data/request?returnTo=${returnTo}`} className="underline">Request data for this selection</Link></li>
            <li><Link href="/cities/request" className="underline">Request a map for another Florida city</Link></li>
          </ul>
      </section>

      {/* Results: map or list, with the selected crash. */}
      <section aria-label="Results" className="order-2 flex flex-col gap-[var(--gap)] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:h-[calc(100svh-60px-3*var(--gap))] lg:min-h-[560px]">
        <div className="flex flex-wrap items-center gap-[var(--gap)]">
          <div role="group" aria-label="View" className="flex gap-[var(--gap)]">
            {(["map", "list"] as const).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`min-h-11 px-5 text-body ${mode === m ? "bg-ink text-ground" : "bg-surface hover:bg-surface-2"}`}>
                {m === "map" ? "Map" : "List"}
              </button>
            ))}
          </div>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 px-2 text-small" aria-label="Legend">
            <li className="flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rounded-full border-[1.5px] border-white bg-fatal-dot outline outline-1 outline-fatal-dot" aria-hidden="true" />Fatal</li>
            <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-pedestrian" aria-hidden="true" />Pedestrian</li>
            <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-bicyclist" aria-hidden="true" />Bicyclist</li>
            <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-vehicle" aria-hidden="true" />Motor vehicles only</li>
            <li><Link href={`/data?returnTo=${returnTo}#reading-the-map`} className="underline">How to read this map</Link></li>
          </ul>
        </div>

        {status.kind === "error" && (
          <div role="alert" className="bg-surface p-5">
            <p>Crashes couldn&rsquo;t be loaded. {status.message}</p>
            <button type="button" onClick={() => setRetry((n) => n + 1)} className="button mt-3">Try again</button>
          </div>
        )}
        {status.kind === "ready" && totals.crashes === 0 && (
          <div role="status" className="bg-surface p-5">
            <p>No crashes match these filters.</p>
            <div className="mt-3 flex flex-wrap gap-[var(--gap)]">
              <button type="button" onClick={resetFilters} className="button">Clear filters</button>
              <button type="button" onClick={() => update({ from: coverage.start, to: coverage.end })} className="button-quiet">Use all dates</button>
            </div>
          </div>
        )}
        {outside && mode === "map" && (
          <div role="status" className="bg-surface p-5">
            <p>This area is outside the data. The map only covers Leon County.</p>
            <div className="mt-3 flex flex-wrap gap-[var(--gap)]">
              <button type="button" onClick={() => setTarget({ view: TALLAHASSEE_VIEW })} className="button">Back to Tallahassee</button>
              <Link href="/cities/request" className="button-quiet">Request your Florida city</Link>
            </div>
          </div>
        )}
        {selectionMissing && (
          <div role="status" className="bg-surface p-5">
            <p>The crash in this link isn&rsquo;t in the current results. It may be outside these filters, or the data has changed.</p>
            <button type="button" onClick={() => update({ crash: undefined })} className="button-quiet mt-3">Back to results</button>
          </div>
        )}

        {selected && !sheet && detail}

        <div className={`relative h-[62svh] min-h-[340px] bg-surface-2 lg:h-auto lg:min-h-0 lg:flex-1 ${mode === "map" ? "" : "hidden"}`}>
          {mapError ? (
            <div role="alert" className="p-6">
              <p>{mapError}</p>
              <button type="button" onClick={() => setMode("list")} className="button mt-3">Show the list</button>
            </div>
          ) : (
            <CrashMapView
              features={features}
              view={initial.view}
              startBounds={initial.geo === "leon" ? LEON_BOUNDS : undefined}
              target={target}
              selected={state.crash}
              coverBottom={sheet && !!selected}
              onSelect={onSelect}
              onMove={onMove}
              onError={setMapError}
            />
          )}
          <p className="absolute left-3 top-3 bg-ground px-3 py-2 text-small" role="status">
            {status.kind === "loading" ? "Loading crashes…" : `Records end ${formatDate(coverage.end, "short")}`}
          </p>
          {selected && sheet && detail}
        </div>

        {mode === "list" && (
          <div className="max-h-[75svh] overflow-auto bg-ground lg:max-h-none lg:min-h-0 lg:flex-1">
            <table className="w-full border-collapse text-left text-body">
              <caption className="sr-only">Crashes matching the filters, newest first</caption>
              <thead className="sticky top-0 bg-ground">
                <tr className="border-b border-line">
                  <th scope="col" className="px-3 py-3 text-small font-normal text-muted">Date</th>
                  <th scope="col" className="px-3 py-3 text-small font-normal text-muted">Severity</th>
                  <th scope="col" className="px-3 py-3 text-small font-normal text-muted">Involved</th>
                  <th scope="col" className="hidden px-3 py-3 text-right text-small font-normal text-muted sm:table-cell">People</th>
                  <th scope="col" className="px-3 py-3 text-small font-normal text-muted"><span className="sr-only">Details</span></th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, shown).map((c) => (
                  <tr key={c.id} className={`border-b border-line ${c.id === state.crash ? "bg-accent text-accent-ink" : ""}`}>
                    <td className="px-3 py-3 tabular-nums">{formatDate(c.date, "short")}<span className="block text-small text-muted sm:inline sm:pl-2 sm:text-body sm:text-ink">{c.time}</span></td>
                    <td className={`px-3 py-3 ${c.severity === "fatal" ? "text-fatal" : ""}`}>{c.severity === "fatal" ? "Fatal" : "Nonfatal"}</td>
                    <td className="px-3 py-3">{c.roadUsers.map((u) => ROAD_USER_TEXT[u]).join(", ")}</td>
                    <td className="hidden px-3 py-3 text-right tabular-nums sm:table-cell">{c.people}</td>
                    <td className="px-3 py-3 text-right">
                      <button type="button" onClick={() => { onSelect(c.id); setMode("map"); }} className="min-h-11 px-2 text-small underline">
                        Show on map<span className="sr-only">: crash on {formatDate(c.date)}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown < sorted.length && (
              <div className="p-4">
                <button type="button" onClick={() => setShown((n) => n + PAGE * 4)} className="button-quiet">
                  Show more ({formatCount(sorted.length - shown)} left)
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
