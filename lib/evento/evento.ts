export const EVENTO = {
  nombre: "La Noche Dorada II",
  edicion: "Segunda edición",
  inicioISO: "2026-11-28T19:00:00-05:00",
  fechaLarga: "Sábado 28 de noviembre",
  hora: "7:00 pm PET",
  sede: "Coliseo Eduardo Dibós",
  distrito: "San Borja, Lima",
  direccion: "Av. Angamos Este 2681, Urb. Primavera de Monterrico",
  coordenadas: { lat: -12.1109128, lon: -77.0011657 },
  entradasUrl: "https://www.ticketmaster.pe/event/la-noche-dorada-edicion-2026",
  streamUrl: "https://kick.com/elzeein",
  streamCanal: "/elzeein",
  productora: "",
} as const;

export const PRESENTACION = {
  videoId: "0aHy3gq3Tr4",
  titulo: "Presentación de la Noche Dorada 2",
  canal: "Max-Web",
  inicio: 1329,
} as const;

export const PRONOSTICOS_ACTIVOS = true;

export const PREVENTAS = {
  actual: { nombre: "Preventa 1", hasta: "30 de septiembre" },
  siguiente: {
    nombre: "Preventa 2",
    desde: "1 de octubre",
    hasta: "3 de noviembre",
  },
} as const;

export const REDES_ACTUALIZADAS = "septiembre de 2026";

export const NAV: readonly { href: string; label: string; tag?: string }[] = [
  { href: "/#combates", label: "Combates" },
  { href: "/#cara-a-cara", label: "Cara a cara" },
  { href: "/#pronosticos", label: "Pronósticos" },
  { href: "/#entradas", label: "Entradas" },
  { href: "/#sede", label: "Sede" },
  { href: "/#donde-verlo", label: "Dónde verlo" },
];
