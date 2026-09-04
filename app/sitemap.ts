import type { MetadataRoute } from "next";

const SITIO = process.env.NEXT_PUBLIC_SITIO ?? "https://lanochedorada.pe";

export default function sitemap(): MetadataRoute.Sitemap {
  // Por ahora la home es la única ruta. Al sumar /peleadores/[slug] y
  // /pronosticos hay que agregarlas acá.
  return [
    {
      url: SITIO,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
