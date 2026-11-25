// Genera `lib/og/recursos.generado.ts` con el logo, las caras de los
// peleadores y las fuentes de la imagen OG ya procesados y en base64.
//
// La imagen OG se sirve desde Cloudflare Workers, donde no hay `sharp` ni
// sistema de archivos en tiempo de ejecución: todo lo que necesita va dentro
// del bundle. Vuelve a ejecutarlo (`npm run og:recursos`) cuando cambie el
// logo, una foto de `public/peleadores` o una fuente de `assets/`.
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const raiz = join(import.meta.dirname, "..");
const publico = join(raiz, "public");

// Tamaño en el que se pinta cada cara en la OG; se guarda al doble para que
// se vea nítida.
const ANCHO_CARA = 51;
const ALTO_CARA = 68;

const logo = await sharp(join(publico, "marca/logo-noche-dorada.webp"))
  .resize({ height: 180 })
  .png({ compressionLevel: 9 })
  .toBuffer();

// Solo las fotos de cara: `slug.webp`. Se descartan los cuerpos y las
// versiones alternativas (`cuerpo-*`, `*-medio`, `*-cuerpo`).
const archivos = (await readdir(join(publico, "peleadores")))
  .filter((f) => f.endsWith(".webp"))
  .filter((f) => !f.startsWith("cuerpo-") && !/-(medio|cuerpo)\.webp$/.test(f))
  .sort();

const caras = {};
for (const archivo of archivos) {
  const jpeg = await sharp(join(publico, "peleadores", archivo))
    .resize(ANCHO_CARA * 2, ALTO_CARA * 2, { fit: "cover", position: "top" })
    .jpeg({ quality: 84 })
    .toBuffer();
  caras[archivo.replace(/\.webp$/, "")] =
    `data:image/jpeg;base64,${jpeg.toString("base64")}`;
}

const anton = await readFile(join(raiz, "assets/Anton-Regular.ttf"));
const barlow = await readFile(
  join(raiz, "assets/BarlowCondensed-SemiBold.ttf"),
);

const salida = `// ARCHIVO GENERADO por scripts/generar-recursos-og.mjs — no editar a mano.
// Regenerar con: npm run og:recursos

export const LOGO = ${JSON.stringify(`data:image/png;base64,${logo.toString("base64")}`)};

export const CARAS: Record<string, string> = ${JSON.stringify(caras, null, 2)};

export const ANTON_BASE64 = ${JSON.stringify(anton.toString("base64"))};

export const BARLOW_COND_BASE64 = ${JSON.stringify(barlow.toString("base64"))};
`;

await mkdir(join(raiz, "lib/og"), { recursive: true });
const destino = join(raiz, "lib/og/recursos.generado.ts");
await writeFile(destino, salida);

console.log(
  `OK: ${archivos.length} caras, ${(salida.length / 1024).toFixed(0)} KB → lib/og/recursos.generado.ts`,
);
