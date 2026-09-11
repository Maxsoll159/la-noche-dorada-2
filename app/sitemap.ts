import type { MetadataRoute } from "next";
import { PELEADORES } from "@/lib/evento";

const SITIO = process.env.NEXT_PUBLIC_SITIO ?? "https://lanochedorada.pe";

export default function sitemap(): MetadataRoute.Sitemap {
  const ahora = new Date();
  return [
    {
      url: SITIO,
      lastModified: ahora,
      changeFrequency: "weekly",
      priority: 1,
    },
    // Las 16 fichas. Salen de `PELEADORES`, así que sumar o quitar un peleador
    // del cartel actualiza el sitemap solo.
    ...PELEADORES.map((p) => ({
      url: `${SITIO}/peleadores/${p.slug}`,
      lastModified: ahora,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
