export const PATROCINADORES: readonly {
  nombre: string;
  url: string;
  logo: string;
  w: number;
  h: number;
  ancho: number;
  apuestas?: boolean;
}[] = [
  {
    nombre: "Stake.pe",
    url: "https://stake.pe",
    logo: "/marca/stake-logo.webp",
    w: 260,
    h: 102,
    ancho: 240,
    apuestas: true,
  },
  {
    nombre: "Pragmatic Play",
    url: "https://www.pragmaticplay.com",
    logo: "/marca/pragmatic-play.webp",
    w: 1600,
    h: 695,
    ancho: 220,
  },
  {
    nombre: "Kick",
    url: "https://kick.com",
    logo: "/marca/kick.webp",
    w: 568,
    h: 193,
    ancho: 165,
  },
];

export const CASA_APUESTAS = PATROCINADORES.find((p) => p.apuestas) ?? null;

export type Sponsor = {
  nombre: string;
  url?: string;
  logo?: { src: string; w: number; h: number };
};

export const SPONSORS: readonly Sponsor[] = [
  {
    nombre: "Claro",
    url: "https://www.claro.com",
    logo: { src: "/sponsor/claro.webp", w: 1024, h: 370 },
  },
  {
    nombre: "Alavista",
    url: "https://www.alavistamarketing.com",
    logo: { src: "/sponsor/alavista.webp", w: 1401, h: 383 },
  },
  {
    nombre: "Maniak",
    url: "https://www.instagram.com/bemaniak.pe/",
    logo: { src: "/sponsor/maniak.webp", w: 496, h: 226 },
  },
  {
    nombre: "Cineplanet",
    url: "https://www.cineplanet.com.pe",
    logo: { src: "/sponsor/cineplanet.webp", w: 1646, h: 442 },
  },
  {
    nombre: "Monster Energy",
    url: "https://www.monsterenergy.com/es-pe/",
    logo: { src: "/sponsor/monster.webp", w: 1713, h: 751 },
  },
];
