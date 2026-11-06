import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { POLICY_VERSIONS } from "@/server/policies/versions";

const DATA_UPDATED = new Date("2026-11-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, lastModified = DATA_UPDATED, priority = 0.5) => ({ url: `${SITE.url}${path}`, lastModified, priority });
  const policyDate = new Date(POLICY_VERSIONS.privacy.version.slice(0, 10));
  return [
    page("/", DATA_UPDATED, 1),
    page("/map", DATA_UPDATED, 0.9),
    page("/data", DATA_UPDATED, 0.8),
    page("/cities/request"),
    page("/data/request"),
    page("/support"),
    page("/about"),
    page("/privacy", policyDate, 0.2),
    page("/terms", policyDate, 0.2),
  ];
}
