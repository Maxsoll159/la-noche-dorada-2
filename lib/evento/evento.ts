export const EVENTO = {
  nombre: "La Noche Dorada II",
  edicion: "Segunda edición",
  inicioISO: "2026-11-28T15:00:00-05:00",
  fechaLarga: "Sábado 28 de noviembre",
  hora: "3:00 pm PET",
  sede: "Coliseo Eduardo Dibós",
  distrito: "San Borja, Lima",
  direccion: "Av. Angamos Este 2681, Urb. Primavera de Monterrico",
  coordenadas: { lat: -12.1109128, lon: -77.0011657 },
  aforo: 5000,
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

// Modal de anuncio en la portada. Se muestra una vez por dispositivo: cambiar
// `clave` lo vuelve a mostrar. `activo` en false lo esconde.
//
// Dos modos: con `cifra` (un número) el modal cuenta hasta ella, como el hito
// de "ya somos más de mil"; con `imagen` muestra esa foto (el Calvo) para
// anunciar una novedad. `boton` es a dónde lleva el botón principal.
export const HITO = {
  activo: true,
  clave: "comunidad-1",
  cifra: null as number | null,
  imagen: "/bot/calvo.webp" as string | null,
  antetitulo: "Nueva sección · Comunidad",
  titulo: "¡Ahora puedes compartir e interactuar!",
  texto: "Publica tus pronósticos",
  detalle:
    "Escribe tu descripción, mira las quinielas de los demás, dales me gusta o no me gusta y comenta quién se equivoca. Una publicación por persona: la actualizas cuando quieras.",
  boton: { texto: "Ir a la comunidad", href: "/comunidad" },
} as const;

export const PREVENTAS = {
  actual: {
    nombre: "Preventa 2",
    desde: "1 de octubre",
    hasta: "3 de noviembre",
  },
  anterior: { nombre: "Preventa 1" },
} as const;

export const REDES_ACTUALIZADAS = "septiembre de 2026";

export const NAV: readonly { href: string; label: string; tag?: string }[] = [
  { href: "/#cara-a-cara", label: "Cara a cara" },
  { href: "/#pronosticos", label: "Pronósticos" },
  { href: "/#favoritos", label: "Favoritos" },
  { href: "/comunidad", label: "Comunidad" },
  { href: "/#combates", label: "Combates" },
  { href: "/#entradas", label: "Entradas" },
  { href: "/#sede", label: "Sede" },
  { href: "/#donde-verlo", label: "Dónde verlo" },
];

export const REDES_EVENTO: readonly {
  plataforma: string;
  url: string;
  usuario: string;
  color: string;
}[] = [
  {
    plataforma: "Kick",
    url: EVENTO.streamUrl,
    usuario: EVENTO.streamCanal,
    color: "#53fc18",
  },
  {
    plataforma: "TikTok",
    url: "https://www.tiktok.com/@elzeeinmr",
    usuario: "/elzeeinmr",
    color: "#f5eedc",
  },
  {
    plataforma: "YouTube",
    url: "https://www.youtube.com/@elzeein",
    usuario: "/elzeein",
    color: "#ff0033",
  },
  {
    plataforma: "Instagram",
    url: "https://www.instagram.com/andynsane/",
    usuario: "/andynsane",
    color: "#e1306c",
  },
];
