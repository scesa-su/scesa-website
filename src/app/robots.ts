import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/constants.ts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/keystatic", "/api"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
