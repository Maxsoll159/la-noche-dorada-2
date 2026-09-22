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
];

export const CASA_APUESTAS = PATROCINADORES.find((p) => p.apuestas) ?? null;
