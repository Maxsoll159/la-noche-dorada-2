import type { MetadataRoute } from "next";

const SITIO = process.env.NEXT_PUBLIC_SITIO ?? "https://lanochedorada.pe";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITIO}/sitemap.xml`,
    host: SITIO,
  };
}
