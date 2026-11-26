"use client";

import type { ImageLoaderProps } from "next/image";
import manifiesto from "./manifiesto.generado.json";

type Entrada = { b: string; w: number[] };
const IMAGENES: Record<string, Entrada> = manifiesto;

// Loader de next/image: las imágenes de public/ salen de los archivos que
// prepara scripts/optimizar-imagenes.mjs (estáticos, no pasan por el
// Worker). Lo que no está en el manifiesto (imágenes remotas, rutas
// dinámicas) se pide tal cual.
export default function cargarImagen({ src, width }: ImageLoaderProps) {
  const entrada = IMAGENES[decodeURI(src)];
  if (!entrada) return src;
  const ancho = entrada.w.find((w) => w >= width) ?? entrada.w.at(-1)!;
  return `${entrada.b}.w${ancho}.webp`;
}
