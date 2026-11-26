// Prepara las imágenes de `public/` en los anchos que pide `next/image` y
// escribe el manifiesto que lee `lib/imagenes/loader.ts`.
//
// Así las imágenes salen como archivos estáticos (gratis, no cuentan como
// peticiones al Worker) en vez de pasar por `/_next/image`, que llegó a ser
// el 44 % de todas las peticiones. Corre solo antes de `next build` y
// `next dev`; si una imagen ya está generada y no cambió, la salta.
//
// Salida: public/_img/<ruta>.<hash>.w<ancho>.webp (en .gitignore) y
// lib/imagenes/manifiesto.generado.json (versionado).
import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import sharp from "sharp";

const raiz = join(import.meta.dirname, "..");
const publico = join(raiz, "public");
const salida = join(publico, "_img");
const manifiesto = join(raiz, "lib", "imagenes", "manifiesto.generado.json");

// Deben coincidir con `deviceSizes` + `imageSizes` de next.config.ts.
export const ANCHOS = [
  32, 48, 64, 96, 128, 256, 384, 640, 828, 1080, 1280, 1920,
];
const CALIDAD = 75;
const EXTENSIONES = /\.(webp|png|jpe?g)$/i;

async function* recorrer(carpeta) {
  for (const entrada of await readdir(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) {
      if (ruta !== salida) yield* recorrer(ruta);
    } else if (EXTENSIONES.test(entrada.name)) {
      yield ruta;
    }
  }
}

const existe = (ruta) =>
  stat(ruta).then(
    () => true,
    () => false,
  );

// "/bot/Imagen Bot.png" → "bot/imagen-bot"
const nombreSeguro = (rel) =>
  rel
    .replace(EXTENSIONES, "")
    .split(sep)
    .join("/")
    .toLowerCase()
    .replace(/[^a-z0-9/_-]+/g, "-");

const resultado = {};
const usados = new Set();
let generados = 0;

for await (const archivo of recorrer(publico)) {
  const rel = relative(publico, archivo);
  const clave = "/" + rel.split(sep).join("/");
  const datos = await readFile(archivo);
  const hash = createHash("sha256").update(datos).digest("hex").slice(0, 8);
  const { width: original } = await sharp(datos).metadata();

  // Anchos útiles: los menores que el original, más el original como tope.
  const anchos = ANCHOS.filter((w) => w < original);
  anchos.push(Math.min(original, ANCHOS.at(-1)));
  const unicos = [...new Set(anchos)].sort((a, b) => a - b);

  const base = `${nombreSeguro(rel)}.${hash}`;
  for (const w of unicos) {
    const destino = join(salida, `${base}.w${w}.webp`);
    usados.add(destino);
    if (await existe(destino)) continue;
    await mkdir(dirname(destino), { recursive: true });
    await sharp(datos)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: CALIDAD })
      .toFile(destino);
    generados++;
  }
  resultado[clave] = { b: `/_img/${base}`, w: unicos };
}

// Borra versiones viejas (imágenes cambiadas o eliminadas).
let borrados = 0;
async function limpiar(carpeta) {
  if (!(await existe(carpeta))) return;
  for (const entrada of await readdir(carpeta, { withFileTypes: true })) {
    const ruta = join(carpeta, entrada.name);
    if (entrada.isDirectory()) await limpiar(ruta);
    else if (!usados.has(ruta)) {
      await rm(ruta);
      borrados++;
    }
  }
}
await limpiar(salida);

const ordenado = Object.fromEntries(
  Object.entries(resultado).sort(([a], [b]) => a.localeCompare(b)),
);
await mkdir(dirname(manifiesto), { recursive: true });
await writeFile(manifiesto, JSON.stringify(ordenado, null, 2) + "\n");

console.log(
  `imágenes: ${Object.keys(ordenado).length} fuentes, ${usados.size} archivos (${generados} nuevos, ${borrados} borrados)`,
);
