import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { PELEADORES } from "./evento";

/** Data URL de una miniatura. El tipo es el que pide `placeholder` de next/image. */
export type Silueta = `data:image/${string}`;

/** Ancho de la miniatura, en píxeles. A 14 pesa unos 330 bytes en base64. */
const ANCHO_MINIATURA = 14;

let cache: Record<string, Silueta> | undefined;

async function miniatura(publico: string): Promise<Silueta | null> {
  try {
    const bytes = await readFile(join(process.cwd(), "public", publico));
    const mini = await sharp(bytes)
      .resize({ width: ANCHO_MINIATURA })
      .webp({ quality: 35, alphaQuality: 60, effort: 6 })
      .toBuffer();
    return `data:image/webp;base64,${mini.toString("base64")}`;
  } catch {
    // Una miniatura que no se pudo generar no puede tumbar la página: ese
    // peleador se queda sin placeholder, exactamente como estaba antes.
    return null;
  }
}

/**
 * Miniaturas borrosas de las siluetas, por slug, para que el escenario del
 * cara a cara nunca se quede en blanco.
 *
 * El problema que resuelven: al cambiar de peleador, el nodo de la figura se
 * remonta y el `<img>` nuevo no pinta NADA hasta que su imagen llega. Quien
 * cambiaba rápido veía el hueco vacío, daba por hecho que no cargaba y se iba
 * a otro peleador, donde le pasaba lo mismo. Con esto, en el instante del clic
 * ya se ve la silueta —borrosa, pero la suya— y la foto buena entra encima
 * cuando está.
 *
 * Viajan dentro del HTML (unos 5 KB las dieciséis), así que están disponibles
 * sin pedir nada a la red. El navegador las estira suavizándolas, que es justo
 * el efecto que se busca.
 *
 * Van como `placeholder="data:image/..."` y NO como `placeholder="blur"`: el
 * modo `blur` de Next envuelve la imagen en un SVG que rellena de negro todo
 * lo transparente (`feFlood` + `feComposite out`), y estos recortes son WebP
 * con alfa. Con `blur` el escenario mostraría un rectángulo negro en lugar de
 * una silueta. En el modo data URL, Next la usa tal cual y el alfa se respeta.
 *
 * Se calculan una sola vez, en el build: la home es estática, así que sharp no
 * corre en ninguna petición. Al sumar un peleador al cartel su miniatura
 * aparece sola; no hay archivo generado que mantener a mano.
 */
export async function siluetasBorrosas(): Promise<Record<string, Silueta>> {
  if (cache) return cache;

  const pares = await Promise.all(
    PELEADORES.map(async (p) => {
      const uri = await miniatura(p.cuerpo ?? p.foto);
      return [p.slug, uri] as const;
    }),
  );

  cache = Object.fromEntries(
    pares.filter((par): par is readonly [string, Silueta] => par[1] !== null),
  );
  return cache;
}
