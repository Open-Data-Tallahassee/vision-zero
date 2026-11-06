import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

// Netlify sets CONTEXT to "production" only for the live site, so previews are never indexed.
export default function robots(): MetadataRoute.Robots {
  if (process.env.CONTEXT !== "production") return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
