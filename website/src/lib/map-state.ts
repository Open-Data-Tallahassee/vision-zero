// Map exploration state, encoded in the URL so views can be shared and restored.
// Shared by server and client code; must not import anything server-only.

export const GEOGRAPHIES = ["tallahassee", "leon"] as const;
export const SEVERITIES = ["all", "fatal", "nonfatal"] as const;
export const ROAD_USERS = ["all", "pedestrian", "bicyclist", "motor_vehicle"] as const;

export type Geography = (typeof GEOGRAPHIES)[number];
export type Severity = (typeof SEVERITIES)[number];
export type RoadUser = (typeof ROAD_USERS)[number];

export interface View {
  lng: number;
  lat: number;
  z: number;
}

export interface MapState {
  geo: Geography;
  from: string; // YYYY-MM-DD, inclusive
  to: string; // YYYY-MM-DD, inclusive
  severity: Severity;
  user: RoadUser;
  view?: View;
  crash?: string;
}

export interface DateBounds {
  start: string;
  end: string;
}

export const GEOGRAPHY_LABELS: Record<Geography, string> = {
  tallahassee: "Tallahassee (city limits)",
  leon: "Leon County",
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  all: "All crashes",
  fatal: "Fatal crashes",
  nonfatal: "Nonfatal crashes",
};

export const ROAD_USER_LABELS: Record<RoadUser, string> = {
  all: "Everyone",
  pedestrian: "Pedestrians",
  bicyclist: "Bicyclists",
  motor_vehicle: "Motor vehicles",
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (s: string | null): s is string =>
  !!s && DATE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`)) && new Date(`${s}T00:00:00Z`).toISOString().startsWith(s);

const pick = <T extends string>(allowed: readonly T[], raw: string | null, fallback: T): T =>
  allowed.includes(raw as T) ? (raw as T) : fallback;

const clampDate = (d: string, { start, end }: DateBounds) => (d < start ? start : d > end ? end : d);

export function defaultMapState(bounds: DateBounds): MapState {
  return { geo: "tallahassee", from: bounds.start, to: bounds.end, severity: "all", user: "all" };
}

/** Reads map state from URL params. Invalid or missing values fall back to defaults; it never throws. */
export function parseMapState(params: URLSearchParams, bounds: DateBounds): MapState {
  const defaults = defaultMapState(bounds);
  let from = isValidDate(params.get("from")) ? clampDate(params.get("from")!, bounds) : defaults.from;
  let to = isValidDate(params.get("to")) ? clampDate(params.get("to")!, bounds) : defaults.to;
  if (from > to) [from, to] = [to, from];

  const state: MapState = {
    geo: pick(GEOGRAPHIES, params.get("geo"), defaults.geo),
    from,
    to,
    severity: pick(SEVERITIES, params.get("severity"), defaults.severity),
    user: pick(ROAD_USERS, params.get("user"), defaults.user),
  };

  const [lng, lat, z] = (params.get("v") ?? "").split(",").map(Number);
  if ([lng, lat, z].every(Number.isFinite) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90 && z >= 0 && z <= 22) {
    state.view = { lng, lat, z };
  }

  const crash = params.get("crash");
  if (crash && /^\d{1,12}$/.test(crash)) state.crash = crash;

  return state;
}

/** Writes map state as a query string, leaving out values that match the defaults. */
export function serializeMapState(state: MapState, bounds: DateBounds): string {
  const defaults = defaultMapState(bounds);
  const params = new URLSearchParams();
  if (state.geo !== defaults.geo) params.set("geo", state.geo);
  if (state.from !== defaults.from) params.set("from", state.from);
  if (state.to !== defaults.to) params.set("to", state.to);
  if (state.severity !== defaults.severity) params.set("severity", state.severity);
  if (state.user !== defaults.user) params.set("user", state.user);
  if (state.view) {
    const { lng, lat, z } = state.view;
    params.set("v", `${lng.toFixed(4)},${lat.toFixed(4)},${z.toFixed(2)}`);
  }
  if (state.crash) params.set("crash", state.crash);
  return params.toString();
}

export function isDefaultFilters(state: MapState, bounds: DateBounds): boolean {
  const d = defaultMapState(bounds);
  return state.geo === d.geo && state.from === d.from && state.to === d.to && state.severity === d.severity && state.user === d.user;
}

/** Accepts only same-site map links as return destinations, so `returnTo` can't become an open redirect. */
export function safeReturnTo(raw: string | null | undefined): string {
  if (!raw) return "/map";
  if (!raw.startsWith("/map") || raw.startsWith("//")) return "/map";
  const rest = raw.slice(4);
  if (rest !== "" && !rest.startsWith("?")) return "/map";
  if (/[\\\s]/.test(raw)) return "/map";
  return raw;
}
