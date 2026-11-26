import type { MetadataRoute } from "next";
import { ARTISTAS, PELEADORES } from "@/lib/evento";

import { SITIO } from "@/lib/sitio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITIO },
    { url: `${SITIO}/comunidad` },
    { url: `${SITIO}/artistas` },
    ...ARTISTAS.filter((a) => a.slug && a.nombre).map((a) => ({
      url: `${SITIO}/artistas/${a.slug}`,
    })),
    ...PELEADORES.map((p) => ({ url: `${SITIO}/peleadores/${p.slug}` })),
  ];
}
