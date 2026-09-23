import {
  COMBATES,
  EVENTO,
  PATROCINADORES,
  PELEADORES,
  ZONAS,
} from "@/lib/evento";
import { NOMBRES_ALTERNOS, SITIO } from "@/lib/sitio";

const precios = ZONAS.map((z) => parseFloat(z.actual.replace(/[^\d.]/g, "")));

export function DatosEstructurados() {
  const sitio = SITIO;

  const organizadora = {
    "@type": "Organization",
    "@id": `${sitio}/#organizadora`,
    name: EVENTO.productora || EVENTO.nombre,
    url: sitio,
    logo: `${sitio}/icon.png`,
  };

  const web = {
    "@type": "WebSite",
    "@id": `${sitio}/#web`,
    url: sitio,
    name: EVENTO.nombre,
    alternateName: NOMBRES_ALTERNOS,
    inLanguage: "es-PE",
    publisher: { "@id": organizadora["@id"] },
  };

  const evento = {
    "@type": "SportsEvent",
    "@id": `${sitio}/#evento`,
    name: EVENTO.nombre,
    alternateName: NOMBRES_ALTERNOS,
    description: `Ocho combates de boxeo amateur entre dieciséis creadores de contenido. ${COMBATES[0].billing}: ${COMBATES[0].a.nombre} contra ${COMBATES[0].b.nombre}.`,
    startDate: EVENTO.inicioISO,
    endDate: EVENTO.inicioISO.slice(0, 10),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    image: [`${sitio}/opengraph-image.jpg`],
    url: sitio,
    sport: "Boxing",
    location: {
      "@type": "Place",
      name: EVENTO.sede,
      address: {
        "@type": "PostalAddress",
        streetAddress: EVENTO.direccion,
        addressLocality: "San Borja",
        addressRegion: "Lima",
        postalCode: "15037",
        addressCountry: "PE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: EVENTO.coordenadas.lat,
        longitude: EVENTO.coordenadas.lon,
      },
    },
    organizer: { "@id": organizadora["@id"] },
    sponsor: PATROCINADORES.map((p) => ({
      "@type": "Organization",
      name: p.nombre,
      url: p.url,
    })),
    offers: {
      "@type": "AggregateOffer",
      url: EVENTO.entradasUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "PEN",
      lowPrice: Math.min(...precios),
      highPrice: Math.max(...precios),
      offerCount: ZONAS.length,
      category: "primary",
    },
    performer: PELEADORES.map((p) => ({
      "@type": "Person",
      name: p.nombre,
      url: `${sitio}/peleadores/${p.slug}`,
    })),
    subEvent: COMBATES.map((c) => ({
      "@type": "SportsEvent",
      name: `${c.a.nombre} vs ${c.b.nombre}`,
      startDate: EVENTO.inicioISO,
      location: { "@type": "Place", name: EVENTO.sede },
      performer: [
        { "@type": "Person", name: c.a.nombre },
        { "@type": "Person", name: c.b.nombre },
      ],
    })),
  };

  const grafo = {
    "@context": "https://schema.org",
    "@graph": [organizadora, web, evento],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
    />
  );
}
