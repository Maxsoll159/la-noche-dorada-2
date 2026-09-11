import { COMBATES, EVENTO, PATROCINADORES, PELEADORES } from "@/lib/evento";

/**
 * JSON-LD del evento. Es lo que le permite a Google mostrar fecha, sede y
 * enlace de entradas directamente en el resultado de búsqueda.
 * Solo se declara lo verificable: no hay precios aquí porque los de la
 * preventa 1 pueden haber cambiado con el nuevo calendario.
 */
export function DatosEstructurados() {
  const sitio = process.env.NEXT_PUBLIC_SITIO ?? "https://lanochedorada.pe";

  const evento = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: EVENTO.nombre,
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
    organizer: {
      "@type": "Organization",
      name: EVENTO.productora,
    },
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
    performer: PELEADORES.map((p) => ({
      "@type": "Person",
      name: p.nombre,
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

  return (
    <script
      type="application/ld+json"
      // El contenido es nuestro y no lleva entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(evento) }}
    />
  );
}
