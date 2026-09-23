import type { MetadataRoute } from "next";
import { PELEADORES } from "@/lib/evento";

import { SITIO } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITIO },
    ...PELEADORES.map((p) => ({ url: `${SITIO}/peleadores/${p.slug}` })),
  ];
}
