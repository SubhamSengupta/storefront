import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    // The cart is user-specific and has no SEO value, so keep it out of the index.
    rules: { userAgent: "*", allow: "/", disallow: "/cart" },
    sitemap: `${base}/sitemap.xml`,
  };
}
