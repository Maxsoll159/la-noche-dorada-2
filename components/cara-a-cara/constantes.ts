import { getImageProps } from "next/image";
import { PELEADORES, type Peleador } from "@/lib/evento";

export type Lado = "a" | "b";

export const ORDEN_PARRILLA = [
  "jh",
  "jeque",
  "daniela",
  "pauchikita",
  "sacha",
  "kingteka",
  "piero",
  "pulsera",
  "bebote",
  "shelao",
  "pepita",
  "ismael-sanchez",
  "canita",
  "emetsuki",
  "jota",
  "neutro",
];
export const PARRILLA: Peleador[] = [
  ...ORDEN_PARRILLA.flatMap((slug) =>
    PELEADORES.filter((p) => p.slug === slug),
  ),
  ...PELEADORES.filter((p) => !ORDEN_PARRILLA.includes(p.slug)),
];

export const POR_SLUG = new Map(PELEADORES.map((p) => [p.slug, p]));

export const SIZES_FIGURA =
  "(min-width: 1024px) 40vh, (min-width: 640px) 330px, calc(58vw - 28px)";

const pedidas = new Set<string>();

export function precargarFigura(src: string) {
  if (pedidas.has(src)) return;
  pedidas.add(src);

  const { props } = getImageProps({
    src,
    alt: "",
    fill: true,
    sizes: SIZES_FIGURA,
  });

  const img = new window.Image();
  img.fetchPriority = "low";
  if (props.sizes) img.sizes = props.sizes;
  if (props.srcSet) img.srcset = props.srcSet;
  img.src = props.src;
}

export const LADO = {
  a: {
    numero: 1,
    borde: "border-lado-a",
    fondo: "bg-lado-a",
    tinte: "bg-lado-a/20",
    brillo: "shadow-[0_0_22px_rgba(226,54,44,0.5)]",
  },
  b: {
    numero: 2,
    borde: "border-lado-b",
    fondo: "bg-lado-b",
    tinte: "bg-lado-b/20",
    brillo: "shadow-[0_0_22px_rgba(47,123,230,0.5)]",
  },
} as const;
