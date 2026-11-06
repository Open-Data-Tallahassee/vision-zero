export const SITE = {
  name: "Vision Zero TLH",
  shortName: "Vision Zero TLH",
  url: "https://visionzero.opentlh.com",
  tagline: "Built by neighbors, for safer streets. Free for everyone.",
  description:
    "A free community map of traffic crashes in Tallahassee and Leon County, Florida, including fatal crashes, pedestrian and bicyclist crashes, built by Open Tallahassee.",
  publisher: { name: "Open Tallahassee", url: "https://www.opentlh.com/" },
  repo: "https://github.com/Open-Data-Tallahassee/vision-zero",
} as const;

export const NAV = [
  { href: "/data", label: "Understand the data" },
  { href: "/cities/request", label: "Request a Florida city" },
  { href: "/support", label: "Support the work" },
  { href: "/about", label: "About" },
] as const;
