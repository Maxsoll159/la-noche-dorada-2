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
} as const;

/**
 * Marcas patrocinadoras, en el orden en que se pintan.
 *
 * El logo tiene que venir en versión CLARA: el módulo va sobre fondo oscuro y
 * un wordmark negro desaparece. `ancho` se ajusta marca por marca para que
 * todas queden ópticamente del mismo alto (~90 px) pese a tener proporciones
 * distintas; `w`/`h` son las del archivo, para que Next reserve el espacio.
 */
export const PATROCINADORES: readonly {
  nombre: string;
  url: string;
  logo: string;
  w: number;
  h: number;
  ancho: number;
}[] = [
  {
    nombre: "Stake.pe",
    url: "https://stake.pe",
    logo: "/marca/stake.webp",
    w: 260,
    h: 102,
    ancho: 240,
  },
  {
    nombre: "Pragmatic Play",
    url: "https://www.pragmaticplay.com",
    logo: "/marca/pragmatic-play.webp",
    w: 1600,
    h: 695,
    ancho: 220,
  },
];

/**
 * Video de la gala de presentación, donde se anunció la cartelera y se hicieron
 * los careos. `inicio` es el segundo en el que arranca la reproducción: viene
 * del enlace compartido (22:09), bájalo a 0 si quieres el video desde el
 * principio.
 */
export const PRESENTACION = {
  videoId: "0aHy3gq3Tr4",
  titulo: "Presentación de la Noche Dorada 2",
  canal: "Max-Web",
  inicio: 1329,
} as const;

/**
 * Interruptor de la votación. En false la sección se muestra bloqueada: sin
 * porcentajes y con los botones inertes, sin hablar con Supabase. En true la
 * sección lee los conteos reales y deja votar.
 *
 * Antes de publicarlo en true hace falta que Google esté habilitado como
 * proveedor de Auth en Supabase; si no, el botón de iniciar sesión no lleva a
 * ninguna parte. Los pasos están en README.md.
 */
export const PRONOSTICOS_ACTIVOS = true;

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
  /**
   * Reseña editorial, 2 o 3 frases: quién es y qué se juega en esta pelea.
   * Sin esto, las 16 páginas de peleador son la misma plantilla con otra foto
   * y compiten entre ellas en buscadores. Mientras esté vacía, el bloque
   * sencillamente no se pinta.
   */
  resena?: string;
  /**
   * Perfiles públicos. `usuario` se deriva de la URL, no se escribe a mano.
   * `seguidores` es TEXTO ya formateado ("3,6 M"), no un número: la cifra
   * cambia a diario, así que se muestra siempre junto a `REDES_ACTUALIZADAS`
   * para que se lea como una foto fija y no como un dato en vivo.
   */
  redes?: {
    plataforma: string;
    url: string;
    usuario: string;
    seguidores?: string;
  }[];
};

/**
 * Ficha física de cada peleador.
 *
 * Solo jh y may conservan altura y peso de un pesaje oficial: el de Stream
 * Fighters 4 (18/10/2025, publicado por El Espectador). Es otra velada de hace
 * casi un año, así que hay que reemplazarlos con el pesaje de La Noche Dorada
 * II en cuanto se publique.
 *
 * Shelao salía de ese mismo pesaje (88,2 kg), pero su peso se reemplazó por
 * 102 kg de fuente no documentada. `aprox` es por peleador, no por dato, así
 * que eso pone el asterisco también sobre su altura, que sí es oficial. Si el
 * 102 llega a venir de un pesaje, se quita el flag y la ficha vuelve a ser
 * oficial entera.
 *
 * El resto de alturas y pesos no sale de una balanza oficial: van con `aprox`
 * para que la ficha los marque con asterisco. Ojo con cada uno, están flojos a
 * propósito y conviene reemplazarlos:
 *   canita  — 1,80 de un agregador; en TikTok circula 1,60 como burla.
 *             71 kg sin fuente documentada.
 *   piero   — 1,79 en una nota, 1,84 en una cuenta de fans. Se contradicen.
 *             90 kg sin fuente documentada.
 *   sacha   — 1,80 lo dice él; su papá lo desmiente en video.
 *             80 kg sin fuente documentada.
 *   daniela — 1,51 de un clip de TikTok. 53 kg sin fuente documentada.
 *             Su edad se dio en 20, contra los 21 que salían de la fecha que
 *             había; mandan los 20 y la fecha pasó a ser relleno.
 *   emetsuki— 1,62 / 57 kg sin fuente documentada. Su edad (25) sí cuadra con
 *             la fecha de nacimiento que ya estaba.
 *   zully   — 1,65 / 55 kg de Sunoti.
 *   pulsera — 1,70 / 68 kg sin fuente documentada.
 *   jeque   — 32 años, 1,80 / 80 kg sin fuente documentada.
 *   jota    — 1,72 / 82 kg sin fuente documentada.
 *   kingteka— 1,70 / 114 kg sin fuente documentada. Su edad se dio en 29,
 *             contra los 28 que salían de la fecha que había; mandan los 29 y
 *             la fecha pasó a ser relleno.
 *   bebote  — 25 años, 1,82 / 76 kg sin fuente documentada. La edad se corrigió
 *             desde los 22 que se habían cargado antes.
 *   pepita  — 1,55 / 48 kg sin fuente documentada.
 *   pauchi. — 19 años, 1,64 / 56 kg sin fuente documentada.
 *   shelao  — 102 kg sin fuente documentada; su altura sí es oficial.
 *
 * Ya no queda nadie sin ningún dato. Queda un solo hueco en las dieciséis
 * fichas: pepita no tiene edad.
 */
const FICHAS: Record<
  string,
  { nacimiento?: string; altura?: number; peso?: number; aprox?: boolean }
> = {
  jh: { nacimiento: "1995-04-14", altura: 1.67, peso: 62.9 },
  // Solo el año 2000 está corroborado (la prensa le puso 24 años en 2024 y
  // 2025); el 1 de enero es el relleno de la fuente, así que la edad puede
  // bailar un año.
  canita: { nacimiento: "2000-01-01", altura: 1.8, peso: 71, aprox: true },
  shelao: { nacimiento: "1990-06-08", altura: 1.88, peso: 102, aprox: true },
  piero: { nacimiento: "2000-08-01", altura: 1.79, peso: 90, aprox: true },
  zully: { nacimiento: "2004-11-07", altura: 1.65, peso: 55, aprox: true },
  may: { nacimiento: "2001-12-21", altura: 1.58, peso: 58.1 },
  // Bebote tampoco tiene fecha de nacimiento publicada: el 1 de enero es
  // relleno para que la ficha diga 25 en la noche del evento.
  bebote: { nacimiento: "2001-01-01", altura: 1.82, peso: 76, aprox: true },
  // La fecha que había (23/02/1998) daba 28 la noche del evento; se reemplazó
  // por los 29 confirmados y el 1 de enero pasó a ser relleno. Si aparece el
  // día real, va aquí.
  kingteka: { nacimiento: "1997-01-01", altura: 1.7, peso: 114, aprox: true },
  // El Jeque no tiene fecha de nacimiento publicada: el 1 de enero es relleno
  // para que la ficha pueda decir 32 en la noche del evento. Si aparece el día
  // real, hay que cambiarlo aquí.
  jeque: { nacimiento: "1994-01-01", altura: 1.8, peso: 80, aprox: true },
  jota: { nacimiento: "1996-05-07", altura: 1.72, peso: 82, aprox: true },
  pulsera: { nacimiento: "1998-11-16", altura: 1.7, peso: 68, aprox: true },
  sacha: { nacimiento: "2004-06-15", altura: 1.8, peso: 80, aprox: true },
  emetsuki: { nacimiento: "2001-03-18", altura: 1.62, peso: 57, aprox: true },
  // La fecha que había (09/07/2005) daba 21 la noche del evento; se reemplazó
  // por los 20 confirmados. El 1 de enero es relleno: si aparece el día real,
  // va aquí.
  daniela: { nacimiento: "2006-01-01", altura: 1.51, peso: 53, aprox: true },
  pepita: { altura: 1.55, peso: 48, aprox: true },
  // Sin fecha de nacimiento publicada: el 1 de enero es relleno para que la
  // ficha diga 19 en la noche del evento.
  pauchikita: { nacimiento: "2007-01-01", altura: 1.64, peso: 56, aprox: true },
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
 * Ya están los dieciséis.
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
  "may",
  "jota",
  "daniela",
  "pepita",
]);

export type Combate = {
  /**
   * "01".."08", el rótulo del cartel. Es también la clave con la que este
   * combate se cruza con la tabla `combates` de Supabase: los porcentajes y
   * el voto del usuario llegan de ahí, no de este archivo.
   */
  n: string;
  /** Rótulo de cartel: estelar, semifondo o vacío */
  billing?: string;
  estelar?: boolean;
  arte: string;
  a: Peleador;
  b: Peleador;
};

/**
 * Perfiles públicos de cada peleador, en el orden en que se pintan bajo su
 * foto. Solo se listan los localizados: quien no tenga una plataforma
 * sencillamente no muestra ese icono, en vez de dejar un enlace muerto.
 *
 * Las URLs van limpias a propósito: la lista de origen traía un
 * `?utm_source=` pegado que habría mandado un parámetro de rastreo ajeno en
 * cada clic desde el sitio.
 *
 * Sin ningún perfil localizado: jeque y pepita.
 * Nadie tiene TikTok en la lista, pese a que varios son tiktokers de origen.
 */
/**
 * Fecha del corte de las cifras de seguidores. Se muestra al pie del bloque:
 * sin ella, un número viejo parece un descuido en vez de una foto fija.
 */
export const REDES_ACTUALIZADAS = "septiembre de 2026";

/** Handle legible a partir de la URL del perfil. */
function usuarioDeUrl(url: string): string {
  const ruta = new URL(url).pathname.replace(/\/$/, "");
  const ultimo = ruta.split("/").filter(Boolean).pop() ?? "";
  return ultimo.startsWith("@") ? ultimo : `@${ultimo}`;
}

const REDES: Record<
  string,
  { plataforma: string; url: string; seguidores?: string }[]
> = {
  canita: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@iamalexiss" },
    { plataforma: "Instagram", url: "https://www.instagram.com/elcanita7w7/" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@ElCanita" },
  ],
  jh: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@j.h.delacruz.7.7.7" },
    { plataforma: "Instagram", url: "https://www.instagram.com/jhde.la.cruz777/" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@jhdelacruz777joveneshoy" },
  ],
  shelao: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@shelao" },
    { plataforma: "Instagram", url: "https://www.instagram.com/crissalva40/" },
    { plataforma: "Kick", url: "https://kick.com/shelao" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@Shelao" },
    { plataforma: "X", url: "https://x.com/shelao40" },
  ],
  piero: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@pieroarenas.t" },
    { plataforma: "Instagram", url: "https://www.instagram.com/pieroarenast/" },
    { plataforma: "Kick", url: "https://kick.com/pieroarenas" },
  ],
  zully: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@zullyy_cs" },
    { plataforma: "Instagram", url: "https://www.instagram.com/zullyy_cs/" },
    { plataforma: "Kick", url: "https://kick.com/zully" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@Zullyy_cs" },
    { plataforma: "X", url: "https://x.com/Zullyy_cs" },
  ],
  may: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@may_osorioo20" },
    { plataforma: "Kick", url: "https://kick.com/mayosorio" },
  ],
  kingteka: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@kingtekaoficial" },
    { plataforma: "Instagram", url: "https://www.instagram.com/kingtekaboss/" },
    { plataforma: "Kick", url: "https://kick.com/kingteka" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@Kingteka" },
    { plataforma: "X", url: "https://x.com/Kingtekaboss" },
  ],
  bebote: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@esbebote" },
    { plataforma: "Instagram", url: "https://www.instagram.com/esbebote/" },
    { plataforma: "Kick", url: "https://kick.com/bebote" },
  ],
  jeque: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@jequearabeperuano" },
  ],
  jota: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@jotadelashoy" },
    { plataforma: "Instagram", url: "https://www.instagram.com/jota.shoy/" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@JOTAOFFICIAL" },
    { plataforma: "X", url: "https://x.com/jota_shoy" },
  ],
  daniela: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@danielataquire" },
    { plataforma: "Instagram", url: "https://www.instagram.com/danielataquire/" },
    { plataforma: "Kick", url: "https://kick.com/danielataquire" },
  ],
  emetsuki: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@emetsukiiii" },
    { plataforma: "Instagram", url: "https://www.instagram.com/emetsukii/" },
    { plataforma: "Kick", url: "https://kick.com/emetsuki" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@EmetSuki" },
    { plataforma: "X", url: "https://x.com/EmetSuki" },
  ],
  sacha: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@sachauzumaki_" },
    { plataforma: "Instagram", url: "https://www.instagram.com/sachauzumaki__/" },
    { plataforma: "Kick", url: "https://kick.com/sachauzumaki" },
    { plataforma: "YouTube", url: "https://www.youtube.com/@sachauzumaki3852" },
  ],
  pulsera: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@srpulsera2.0" },
    { plataforma: "Instagram", url: "https://www.instagram.com/sr.pulsera/" },
    { plataforma: "Kick", url: "https://kick.com/srpulsera" },
  ],
  pepita: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@allisonkiara_" },
  ],
  pauchikita: [
    { plataforma: "TikTok", url: "https://www.tiktok.com/@pauchikita_" },
    { plataforma: "Kick", url: "https://kick.com/pauchikita" },
  ],
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
  ...(REDES[slug] && {
    redes: REDES[slug].map((r) => ({ ...r, usuario: usuarioDeUrl(r.url) })),
  }),
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
  },
  {
    n: "07",
    billing: "Semifondo",
    arte: "/combates/arte-07.webp",
    a: p("shelao", "Shelao", "CL"),
    b: p("piero", "Piero Arenas", "PE"),
  },
  {
    n: "06",
    arte: "/combates/arte-06.webp",
    a: p("zully", "Zully", "PE"),
    b: p("may", "May Osorio", "CO"),
  },
  {
    n: "05",
    arte: "/combates/arte-05.webp",
    a: p("bebote", "Bebote", "PE"),
    b: p("kingteka", "Kingteka", "PE"),
  },
  {
    n: "04",
    arte: "/combates/arte-04.webp",
    a: p("jeque", "El Jeque", "PE"),
    b: p("jota", "Jota Shoy", "PE"),
  },
  {
    n: "03",
    arte: "/combates/arte-03.webp",
    a: p("pulsera", "Sr. Pulsera", "PE"),
    b: p("sacha", "Sacha Uzumaki", "PE"),
  },
  {
    n: "02",
    arte: "/combates/arte-02.webp",
    a: p("emetsuki", "Emetsuki", "CO"),
    b: p("daniela", "Daniela Taquire", "PE"),
  },
  {
    n: "01",
    arte: "/combates/arte-01.webp",
    a: p("pepita", "Pepita", "PE"),
    b: p("pauchikita", "Pauchikita", "PE"),
  },
];

export const PELEADORES: Peleador[] = COMBATES.flatMap((c) => [c.a, c.b]);

/**
 * Todo lo que hay que saber de un peleador a partir de su slug: su combate,
 * su rival y de qué lado del cartel está (que es la clave para cruzarlo con
 * los conteos de Supabase). Devuelve null si el slug no existe, para que la
 * página pueda responder 404.
 */
export function fichaDe(slug: string) {
  for (const combate of COMBATES) {
    if (combate.a.slug === slug)
      return { combate, peleador: combate.a, rival: combate.b, lado: "a" as const };
    if (combate.b.slug === slug)
      return { combate, peleador: combate.b, rival: combate.a, lado: "b" as const };
  }
  return null;
}

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
