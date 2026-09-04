export const EVENTO = {
  nombre: "La Noche Dorada II",
  edicion: "Segunda edición",
  /** 28/11/2026 7:00 pm en hora de Perú (UTC-5). La hora aún no está confirmada por la organización. */
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
  productora: "Vastion",
  patrocinador: "Stake.pe",
  patrocinadorUrl: "https://stake.pe",
} as const;

/**
 * La votación llega en una segunda fase. Mientras esté en false, la sección de
 * pronósticos se muestra bloqueada: sin porcentajes y con los botones inertes.
 * Al ponerlo en true se activa la interacción tal como está construida.
 */
export const PRONOSTICOS_ACTIVOS = false;

export type Peleador = {
  slug: string;
  nombre: string;
  pais: "PE" | "CO" | "CL";
  /** Retrato recortado del arte del combate, para fichas y listas */
  foto: string;
  /** Sesión de estudio recortada con fondo transparente, para el cara a cara */
  cuerpo?: string;
  /** Fecha de nacimiento ISO. La edad se calcula, no se guarda. */
  nacimiento?: string;
  /** Metros */
  altura?: number;
  /** Kilos */
  peso?: number;
  /** Altura y peso NO salen de un pesaje oficial: la ficha los marca con *. */
  aprox?: boolean;
};

/**
 * Ficha física de cada peleador.
 *
 * Solo jh, shelao y may tienen altura y peso de un pesaje oficial: el de
 * Stream Fighters 4 (18/10/2025, publicado por El Espectador). Es otra velada
 * de hace casi un año, así que hay que reemplazarlos con el pesaje de La Noche
 * Dorada II en cuanto se publique.
 *
 * El resto de alturas viene de agregadores de biografías y clips, no de una
 * balanza: van con `aprox` para que la ficha las marque con asterisco. Ojo con
 * cada una, están flojas a propósito y conviene reemplazarlas:
 *   canita  — 1,80 de un agregador; en TikTok circula 1,60 como burla.
 *   piero   — 1,79 en una nota, 1,84 en una cuenta de fans. Se contradicen.
 *   sacha   — 1,80 lo dice él; su papá lo desmiente en video.
 *   daniela — 1,51 de un clip de TikTok.
 *   zully   — 1,65 / 55 kg de Sunoti, único con peso no oficial.
 *
 * Sin ningún dato publicado, en ninguna calidad: bebote, jeque, pepita,
 * pauchikita, kingteka, jota, pulsera y emetsuki (estos cuatro solo edad).
 */
const FICHAS: Record<
  string,
  { nacimiento?: string; altura?: number; peso?: number; aprox?: boolean }
> = {
  jh: { nacimiento: "1995-04-14", altura: 1.67, peso: 62.9 },
  // Solo el año 2000 está corroborado (la prensa le puso 24 años en 2024 y
  // 2025); el 1 de enero es el relleno de la fuente, así que la edad puede
  // bailar un año.
  canita: { nacimiento: "2000-01-01", altura: 1.8, aprox: true },
  shelao: { nacimiento: "1990-06-08", altura: 1.88, peso: 88.2 },
  piero: { nacimiento: "2000-08-01", altura: 1.79, aprox: true },
  zully: { nacimiento: "2004-11-07", altura: 1.65, peso: 55, aprox: true },
  may: { nacimiento: "2001-12-21", altura: 1.58, peso: 58.1 },
  kingteka: { nacimiento: "1998-02-23" },
  jota: { nacimiento: "1996-05-07" },
  pulsera: { nacimiento: "1998-11-16" },
  sacha: { nacimiento: "2004-06-15", altura: 1.8, aprox: true },
  emetsuki: { nacimiento: "2001-03-18" },
  daniela: { nacimiento: "2005-07-09", altura: 1.51, aprox: true },
};

/**
 * Edad cumplida en una fecha dada. La referencia es la noche del evento, no
 * el día en que se abre la página: así la ficha es la misma para todos y no
 * cambia sola a mitad de campaña.
 */
export function edadEn(nacimientoISO: string, referenciaISO: string): number {
  const [an, mn, dn] = nacimientoISO.slice(0, 10).split("-").map(Number);
  const [ar, mr, dr] = referenciaISO.slice(0, 10).split("-").map(Number);
  return ar - an - (mr < mn || (mr === mn && dr < dn) ? 1 : 0);
}

/**
 * Peleadores que ya tienen su sesión de estudio recortada con fondo
 * transparente. Todas se exportan normalizadas a proporción 0.8 con la silueta
 * centrada y apoyada al pie, así entran igual en la card sin importar que la
 * foto original fuera de medio cuerpo o de busto.
 * Faltan: may, jota, daniela, pepita.
 */
const CON_CUERPO = new Set([
  "jh",
  "canita",
  "shelao",
  "piero",
  "zully",
  "bebote",
  "kingteka",
  "jeque",
  "pulsera",
  "sacha",
  "emetsuki",
  "pauchikita",
]);

export type Combate = {
  n: string;
  /** Rótulo de cartel: estelar, semifondo o vacío */
  billing?: string;
  estelar?: boolean;
  arte: string;
  a: Peleador;
  b: Peleador;
  /** Porcentaje del peleador A. Dato de demostración hasta que se abra la votación real. */
  pctA: number;
  /** "a" | "b" si el usuario ya votó. Simula el estado guardado. */
  votado?: "a" | "b";
};

const p = (
  slug: string,
  nombre: string,
  pais: Peleador["pais"],
): Peleador => ({
  slug,
  nombre,
  pais,
  foto: `/peleadores/${slug}.webp`,
  ...(CON_CUERPO.has(slug) && { cuerpo: `/peleadores/cuerpo-${slug}.webp` }),
  ...FICHAS[slug],
});

export const COMBATES: Combate[] = [
  {
    n: "08",
    billing: "Combate estelar",
    estelar: true,
    arte: "/combates/arte-08.webp",
    a: p("jh", "JH de la Cruz 777", "CO"),
    b: p("canita", "Cañita", "PE"),
    pctA: 58,
    votado: "a",
  },
  {
    n: "07",
    billing: "Semifondo",
    arte: "/combates/arte-07.webp",
    a: p("shelao", "Shelao", "CL"),
    b: p("piero", "Piero Arenas", "PE"),
    pctA: 46,
  },
  {
    n: "06",
    arte: "/combates/arte-06.webp",
    a: p("zully", "Zully", "PE"),
    b: p("may", "May Osorio", "CO"),
    pctA: 61,
    votado: "a",
  },
  {
    n: "05",
    arte: "/combates/arte-05.webp",
    a: p("bebote", "Bebote", "PE"),
    b: p("kingteka", "Kingteka", "PE"),
    pctA: 52,
  },
  {
    n: "04",
    arte: "/combates/arte-04.webp",
    a: p("jeque", "El Jeque", "PE"),
    b: p("jota", "Jota Shoy", "PE"),
    pctA: 44,
  },
  {
    n: "03",
    arte: "/combates/arte-03.webp",
    a: p("pulsera", "Sr. Pulsera", "PE"),
    b: p("sacha", "Sacha Uzumaki", "PE"),
    pctA: 63,
    votado: "a",
  },
  {
    n: "02",
    arte: "/combates/arte-02.webp",
    a: p("emetsuki", "Emetsuki", "CO"),
    b: p("daniela", "Daniela Taquire", "PE"),
    pctA: 71,
  },
  {
    n: "01",
    arte: "/combates/arte-01.webp",
    a: p("pepita", "Pepita", "PE"),
    b: p("pauchikita", "Pauchikita", "PE"),
    pctA: 47,
  },
];

export const PELEADORES: Peleador[] = COMBATES.flatMap((c) => [c.a, c.b]);

export const NAV: readonly { href: string; label: string; tag?: string }[] = [
  { href: "#combates", label: "Combates" },
  { href: "#pronosticos", label: "Pronósticos" },
  { href: "#entradas", label: "Entradas" },
  { href: "#sede", label: "Sede" },
  { href: "#donde-verlo", label: "Dónde verlo" },
];

/** Bandas de color de cada bandera, de arriba/izquierda a abajo/derecha. */
export const BANDERAS: Record<
  Peleador["pais"],
  { nombre: string; orientacion: "v" | "h"; bandas: [string, number][] }
> = {
  PE: {
    nombre: "Perú",
    orientacion: "v",
    bandas: [
      ["#D91023", 1],
      ["#FFFFFF", 1],
      ["#D91023", 1],
    ],
  },
  CO: {
    nombre: "Colombia",
    orientacion: "h",
    bandas: [
      ["#FCD116", 2],
      ["#003893", 1],
      ["#CE1126", 1],
    ],
  },
  CL: {
    nombre: "Chile",
    orientacion: "h",
    bandas: [
      ["#FFFFFF", 1],
      ["#D52B1E", 1],
    ],
  },
};
