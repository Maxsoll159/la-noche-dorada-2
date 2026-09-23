export type Pais = "PE" | "CO" | "CL" | "EC";

export type Peleador = {
  slug: string;
  nombre: string;
  pais: Pais;
  foto: string;
  cuerpo?: string;
  video?: string;
  nacimiento?: string;
  altura?: number;
  peso?: number;
  aprox?: boolean;
  resena?: string;
  redes?: {
    plataforma: string;
    url: string;
    usuario: string;
    seguidores?: string;
  }[];
};

const FICHAS: Record<
  string,
  { nacimiento?: string; altura?: number; peso?: number; aprox?: boolean }
> = {
  jh: { nacimiento: "1995-04-14", altura: 1.67, peso: 62.9 },
  canita: { nacimiento: "2000-01-01", altura: 1.8, peso: 71, aprox: true },
  shelao: { nacimiento: "1990-06-08", altura: 1.88, peso: 102, aprox: true },
  piero: { nacimiento: "2000-08-01", altura: 1.79, peso: 90, aprox: true },
  bebote: { nacimiento: "2001-01-01", altura: 1.82, peso: 76, aprox: true },
  kingteka: { nacimiento: "1997-01-01", altura: 1.7, peso: 114, aprox: true },
  jeque: { nacimiento: "1994-01-01", altura: 1.8, peso: 80, aprox: true },
  jota: { nacimiento: "1996-05-07", altura: 1.72, peso: 82, aprox: true },
  pulsera: { nacimiento: "1998-11-16", altura: 1.7, peso: 68, aprox: true },
  sacha: { nacimiento: "2004-06-15", altura: 1.8, peso: 80, aprox: true },
  emetsuki: { nacimiento: "2001-03-18", altura: 1.62, peso: 57, aprox: true },
  daniela: { nacimiento: "2006-01-01", altura: 1.51, peso: 53, aprox: true },
  pepita: { altura: 1.55, peso: 48, aprox: true },
  pauchikita: { nacimiento: "2007-01-01", altura: 1.64, peso: 56, aprox: true },
  neutro: { nacimiento: "2004-01-01", altura: 1.73, peso: 73, aprox: true },
  "ismael-sanchez": { nacimiento: "2002-01-01" },
};

const CON_CUERPO = new Set([
  "jh",
  "canita",
  "shelao",
  "piero",
  "bebote",
  "kingteka",
  "jeque",
  "pulsera",
  "sacha",
  "emetsuki",
  "pauchikita",
  "jota",
  "daniela",
  "pepita",
  "neutro",
  "ismael-sanchez",
]);

const CON_VIDEO = new Set([
  "jh",
  "canita",
  "piero",
  "jeque",
  "jota",
  "bebote",
  "emetsuki",
  "daniela",
  "pepita",
  "pauchikita",
]);

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
    {
      plataforma: "Instagram",
      url: "https://www.instagram.com/jhde.la.cruz777/",
    },
    {
      plataforma: "YouTube",
      url: "https://www.youtube.com/@jhdelacruz777joveneshoy",
    },
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
    {
      plataforma: "Instagram",
      url: "https://www.instagram.com/danielataquire/",
    },
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
    {
      plataforma: "Instagram",
      url: "https://www.instagram.com/sachauzumaki__/",
    },
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

export const crearPeleador = (
  slug: string,
  nombre: string,
  pais: Pais,
): Peleador => ({
  slug,
  nombre,
  pais,
  foto: `/peleadores/${slug}.webp`,
  ...(CON_CUERPO.has(slug) && { cuerpo: `/peleadores/cuerpo-${slug}.webp` }),
  ...(CON_VIDEO.has(slug) && { video: `/videos/${slug}.mp4` }),
  ...(REDES[slug] && {
    redes: REDES[slug].map((r) => ({ ...r, usuario: usuarioDeUrl(r.url) })),
  }),
  ...FICHAS[slug],
});
