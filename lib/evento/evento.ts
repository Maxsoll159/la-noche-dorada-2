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
// anunciar una novedad. `fotoRedonda` recorta la imagen en círculo (para
// fotos; el Calvo va sin recortar). `boton` es a dónde lleva el botón.
export const HITO = {
  activo: true,
  clave: "artistas-1",
  cifra: null as number | null,
  imagen: "/artistas/bareto.webp" as string | null,
  fotoRedonda: true,
  antetitulo: "Nueva sección · Artistas",
  titulo: "¡Ya se están anunciando los artistas!",
  texto: "Bareto ya está confirmado",
  detalle:
    "La música de la noche también se pelea. Escucha sus canciones y descubre quiénes son los artistas secretos que vamos revelando.",
  boton: { texto: "Ver los artistas", href: "/artistas" },
} as const;

// Franja de anuncio fija sobre el header, en todas las páginas. `activo` en
// false la quita. `dia` (en hora de Lima) alimenta el "Faltan 3 días /
// Mañana / Hoy"; pasado ese día la franja se esconde sola. Los `mensajes`
// rotan en escritorio.
export const ANUNCIO = {
  activo: true,
  dia: "2026-11-27",
  fecha: "Viernes 27 de noviembre",
  titulo: "Pesaje oficial",
  mensajes: [
    "No te lo pierdas",
    "En vivo y en directo por Kick",
    "Sigue el canal y activa las notificaciones",
  ],
  url: EVENTO.streamUrl,
  canal: EVENTO.streamCanal,
} as const;

// `vigencia` se lee tras el nombre ("Preventa 3 · desde el 7 de noviembre"),
// así sirve tanto para una fase con cierre como para una sin fecha de fin.
export const PREVENTAS = {
  actual: {
    nombre: "Preventa 3",
    vigencia: "desde el 7 de noviembre",
  },
  anterior: { nombre: "Preventa 1" },
} as const;

export const REDES_ACTUALIZADAS = "septiembre de 2026";

export const NAV: readonly { href: string; label: string; tag?: string }[] = [
  { href: "/#cara-a-cara", label: "Cara a cara" },
  { href: "/#pronosticos", label: "Pronósticos" },
  { href: "/artistas", label: "Artistas", tag: "Nuevo" },
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
