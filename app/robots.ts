import type { MetadataRoute } from "next";

import { SITIO } from "@/lib/sitio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/auth/", "/api/"] }],
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
