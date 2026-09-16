import { COMBATES, EVENTO, PATROCINADORES, PELEADORES } from "@/lib/evento";
import { NOMBRES_ALTERNOS, SITIO } from "@/lib/sitio";

/**
 * JSON-LD de la home: el sitio, la organizadora y el evento. El sitio con sus
 * nombres alternos es lo que le dice a Google que "noche dorada 2" o
 * "lanochedorada" son esta web; el evento es lo que le permite mostrar fecha,
 * sede y enlace de entradas directamente en el resultado de búsqueda.
 * Solo se declara lo verificable: no hay precios aquí porque los de la
 * preventa 1 pueden haber cambiado con el nuevo calendario.
 */
export function DatosEstructurados() {
  const sitio = SITIO;

  const organizadora = {
    "@type": "Organization",
    "@id": `${sitio}/#organizadora`,
    name: EVENTO.productora,
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
      "@type": "Offer",
      url: EVENTO.entradasUrl,
      availability: "https://schema.org/InStock",
      priceCurrency: "PEN",
      category: "primary",
    },
    // Cada peleador con la URL de su ficha: enlaza el evento con las 16
    // páginas y les da entidad propia en el buscador.
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
      // El contenido es nuestro y no lleva entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
    />
  );
}
