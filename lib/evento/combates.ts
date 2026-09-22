import { crearPeleador, type Peleador } from "./peleadores";

export type Combate = {
  n: string;
  billing?: string;
  estelar?: boolean;
  arte: string;
  a: Peleador;
  b: Peleador;
};

export const COMBATES: Combate[] = [
  {
    n: "08",
    billing: "Combate estelar",
    estelar: true,
    arte: "/combates/jh-canita.webp",
    a: crearPeleador("jh", "JH de la Cruz", "CO"),
    b: crearPeleador("canita", "Cañita", "PE"),
  },
  {
    n: "07",
    billing: "Semifondo",
    arte: "/combates/shelao-piero.webp",
    a: crearPeleador("shelao", "Shelao", "CL"),
    b: crearPeleador("piero", "Piero Arenas", "PE"),
  },
  {
    n: "06",
    arte: "/combates/bebote-kingteka.webp",
    a: crearPeleador("bebote", "Bebote", "PE"),
    b: crearPeleador("kingteka", "Kingteka", "PE"),
  },
  {
    n: "05",
    arte: "/combates/jeque-jota.webp",
    a: crearPeleador("jeque", "El Jeque", "PE"),
    b: crearPeleador("jota", "Jota Shoy", "PE"),
  },
  {
    n: "04",
    arte: "/combates/pulsera-ismael-sanchez.webp",
    a: crearPeleador("pulsera", "Pulsera", "PE"),
    b: crearPeleador("ismael-sanchez", "Ismael Sánchez", "EC"),
  },
  {
    n: "03",
    arte: "/combates/sacha-neutro.webp",
    a: crearPeleador("sacha", "Sacha Uzumaki", "PE"),
    b: crearPeleador("neutro", "Neutro", "PE"),
  },
  {
    n: "02",
    arte: "/combates/emetsuki-daniela.webp",
    a: crearPeleador("emetsuki", "Emetsuki", "CO"),
    b: crearPeleador("daniela", "Daniela Taquire", "PE"),
  },
  {
    n: "01",
    arte: "/combates/pepita-pauchikita.webp",
    a: crearPeleador("pepita", "Pepita", "PE"),
    b: crearPeleador("pauchikita", "Pauchikita", "PE"),
  },
];

export const PELEADORES: Peleador[] = COMBATES.flatMap((c) => [c.a, c.b]);

export function fichaDe(slug: string) {
  for (const combate of COMBATES) {
    if (combate.a.slug === slug)
      return {
        combate,
        peleador: combate.a,
        rival: combate.b,
        lado: "a" as const,
      };
    if (combate.b.slug === slug)
      return {
        combate,
        peleador: combate.b,
        rival: combate.a,
        lado: "b" as const,
      };
  }
  return null;
}
