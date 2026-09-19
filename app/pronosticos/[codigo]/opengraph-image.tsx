import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { COMBATES, EVENTO, type Peleador } from "@/lib/evento";
import { SITIO } from "@/lib/sitio";
import { eleccionesDe, votosDeCodigo } from "@/lib/compartir";

export const alt = `Pronósticos para ${EVENTO.nombre}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Cada código es inmutable —los pronósticos van dentro de la URL—, así que la
 * imagen se renderiza una sola vez, la primera que alguien la pide, y de ahí
 * en adelante sale de la caché. Sin esto se volvería a dibujar en cada visita
 * del enlace compartido, que es justo el caso que más se repite.
 */
export function generateStaticParams() {
  return [];
}

export const revalidate = 604800; // una semana

// Las fuentes no dependen de la petición: se leen una vez al cargar el módulo.
// Van en `assets/` y no en `public/`: no hace falta servirlas al navegador, que
// ya las recibe por `next/font`. Son las mismas dos familias del sitio (Anton
// para los titulares, Barlow Condensed para los rótulos), así que la imagen
// compartida se lee como una pieza de la web y no como una plantilla ajena.
const anton = await readFile(join(process.cwd(), "assets/Anton-Regular.ttf"));
const barlowCond = await readFile(
  join(process.cwd(), "assets/BarlowCondensed-SemiBold.ttf"),
);

/**
 * Todo el arte del sitio está en WebP y el rasterizador de `ImageResponse` no
 * lo entiende: solo PNG y JPEG. Por eso cada imagen pasa por sharp antes de
 * entrar en la plantilla. Es también la razón de que sharp figure en
 * `dependencies`: aquí es código de aplicación, no el optimizador de Next.
 */
const ruta = (publico: string) => join(process.cwd(), "public", publico);

// El logo no depende de la petición: se convierte una vez y se queda.
const logo = `data:image/png;base64,${(
  await sharp(ruta("/marca/logo-noche-dorada.webp"))
    .resize({ height: 180 })
    .png({ compressionLevel: 9 })
    .toBuffer()
).toString("base64")}`;

/**
 * Proporción del alto de la silueta que ocupa el recuadro de la cara.
 *
 * Los recortes de estudio vienen normalizados (misma proporción, silueta
 * centrada y apoyada al pie), así que un cuadrado anclado ARRIBA del contorno
 * real cae siempre sobre la cabeza. 0,40 es el valor con el que los dieciséis
 * quedan de cara y hombros; subirlo aleja el plano y baja la cara dentro del
 * cuadro.
 */
const ALTO_CARA = 0.4;
const LADO_CARA = 128;

/** Data URI de la cara, o null si el recorte falla: la ficha sabe vivir sin él. */
const cacheCaras = new Map<string, string | null>();

async function caraDe(p: Peleador): Promise<string | null> {
  const guardada = cacheCaras.get(p.slug);
  if (guardada !== undefined) return guardada;

  let uri: string | null = null;
  try {
    // `cuerpo` es el recorte de estudio con fondo transparente; `foto` es el
    // retrato sacado del arte del combate, que viene tan cerrado que a este
    // tamaño no es una cara sino un ojo. Se prefiere el primero y el segundo
    // queda de respaldo por si algún día entra alguien sin recorte.
    const origen = ruta(p.cuerpo ?? p.foto);

    // `trim` deja el contorno real de la silueta: sin esto, el aire
    // transparente de arriba se llevaría medio recuadro.
    const contorno = await sharp(origen)
      .trim({ threshold: 5 })
      .toBuffer({ resolveWithObject: true });
    const { width, height } = contorno.info;
    const lado = Math.round(Math.min(width, height * ALTO_CARA));

    const jpeg = await sharp(contorno.data)
      .extract({
        left: Math.round((width - lado) / 2),
        top: 0,
        width: lado,
        height: lado,
      })
      .resize(LADO_CARA, LADO_CARA)
      // Sobre el mismo gris de las casillas del cara a cara, para que el
      // recorte no traiga un halo transparente. En JPEG, además, pesa un
      // tercio de lo que pesaría en PNG con alfa.
      .flatten({ background: "#0e0e12" })
      .jpeg({ quality: 82 })
      .toBuffer();

    uri = `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    // Una foto que falta no puede tumbar la imagen entera: se pinta el hueco.
    uri = null;
  }

  cacheCaras.set(p.slug, uri);
  return uri;
}

// La paleta de `globals.css`, a mano: aquí no hay Tailwind ni variables CSS.
const ORO = "#d4af37";
const ORO_CLARO = "#f7e3a1";
const ORO_MEDIO = "#b08a34";
const ORO_PROFUNDO = "#8c6b22";
const ORO_TINTE = "#171208";
const NOCHE = "#0b0b0d";
const CARBON = "#101015";
const LINEA = "#2a2a31";
const CREMA = "#f5eedc";
const TENUE = "#a39b8a";
const HUMO = "#63636f";

const DISPLAY = "Anton";
const COND = "Barlow Condensed";

/** El dominio pelado, para el pie: "lanochedorada.pe". */
const DOMINIO = SITIO.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Filete dorado: el mismo separador que usa el sitio, en horizontal. */
function Filete({ alto = 1 }: { alto?: number }) {
  return (
    <div
      style={{
        height: alto,
        width: "100%",
        backgroundImage: `linear-gradient(to right, rgba(212,175,55,0) 0%, ${ORO} 38%, ${ORO_CLARO} 50%, ${ORO} 62%, rgba(212,175,55,0) 100%)`,
      }}
    />
  );
}

/** Escuadras doradas en las esquinas, como en el retrato de la ficha. */
function Escuadra({ x, y }: { x: "left" | "right"; y: "top" | "bottom" }) {
  const borde = `2px solid ${ORO_PROFUNDO}`;
  // Ojo: nada de claves con `undefined`. Satori recorre los estilos y llama a
  // `.trim()` sobre cada valor, así que una sola propiedad indefinida tumba la
  // imagen entera con un "Cannot read properties of undefined".
  return (
    <div
      style={{
        position: "absolute",
        width: 26,
        height: 26,
        ...(x === "left"
          ? { left: 20, borderLeft: borde }
          : { right: 20, borderRight: borde }),
        ...(y === "top"
          ? { top: 20, borderTop: borde }
          : { bottom: 20, borderBottom: borde }),
      }}
    />
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const votos = votosDeCodigo(codigo);
  if (!votos) return new Response("Código no válido", { status: 404 });

  const elecciones = eleccionesDe(votos);
  const hechos = elecciones.filter((e) => e.elegido).length;

  // Las caras, en paralelo y solo las elegidas: los combates sin pronóstico no
  // pintan retrato, así que no hay nada que recortar para ellos.
  const caras = new Map<string, string | null>(
    await Promise.all(
      elecciones.map(async (e) =>
        e.elegido
          ? ([e.combate.n, await caraDe(e.elegido)] as const)
          : ([e.combate.n, null] as const),
      ),
    ),
  );

  // Dos columnas de cuatro. Satori no sabe de `grid`, así que la rejilla se
  // arma a mano: cuatro filas de dos celdas.
  const filas = [0, 1, 2, 3].map((i) => elecciones.slice(i * 2, i * 2 + 2));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: NOCHE,
          fontFamily: COND,
          position: "relative",
        }}
      >
        {/* Resplandor dorado, el mismo recurso del hero */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(70% 55% at 50% 0%, rgba(212,175,55,0.22) 0%, rgba(11,11,13,0) 72%)",
          }}
        />
        <Escuadra x="left" y="top" />
        <Escuadra x="right" y="top" />
        <Escuadra x="left" y="bottom" />
        <Escuadra x="right" y="bottom" />

        <Filete alto={5} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "26px 54px 24px",
          }}
        >
          {/* Encabezado: la marca y qué es esto a la izquierda; cuándo y dónde
              a la derecha. Es lo que hace que la imagen se entienda sola cuando
              aparece suelta en un chat, sin el enlace a la vista. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} height={96} alt="" />
              <div
                style={{
                  width: 1,
                  height: 66,
                  backgroundColor: ORO_PROFUNDO,
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: DISPLAY,
                    fontSize: 46,
                    lineHeight: 1.1,
                    color: ORO_CLARO,
                    textTransform: "uppercase",
                  }}
                >
                  Mis pronósticos
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 19,
                    letterSpacing: 5,
                    color: ORO,
                    textTransform: "uppercase",
                    marginTop: 3,
                  }}
                >
                  {EVENTO.nombre} · {EVENTO.edicion}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  letterSpacing: 3,
                  color: CREMA,
                  textTransform: "uppercase",
                }}
              >
                {EVENTO.fechaLarga} · {EVENTO.hora}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  letterSpacing: 3,
                  color: TENUE,
                  textTransform: "uppercase",
                  marginTop: 4,
                }}
              >
                {EVENTO.sede} · {EVENTO.distrito}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 18, marginBottom: 18 }}>
            <Filete />
          </div>

          {/* Los ocho combates, del estelar al primero de la noche */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "space-between",
            }}
          >
            {filas.map((fila, i) => (
              <div key={i} style={{ display: "flex", gap: 14 }}>
                {fila.map((e) => {
                  const elegido = e.elegido;
                  const estelar = e.combate.estelar === true;
                  const cara = caras.get(e.combate.n) ?? null;
                  return (
                    <div
                      key={e.combate.n}
                      style={{
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                        gap: 14,
                        padding: "9px 14px",
                        borderRadius: 3,
                        border: `1px solid ${estelar ? ORO : LINEA}`,
                        backgroundColor: estelar ? ORO_TINTE : CARBON,
                      }}
                    >
                      {/* La cara del elegido, con el número del combate
                          montado en la esquina como en la parrilla del cara a
                          cara. Sin pronóstico solo queda el número. */}
                      <div
                        style={{
                          position: "relative",
                          display: "flex",
                          width: 58,
                          height: 58,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 3,
                          overflow: "hidden",
                          backgroundColor: "#0e0e12",
                          border: `1px solid ${elegido ? ORO_PROFUNDO : LINEA}`,
                        }}
                      >
                        {cara ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cara}
                            width={58}
                            height={58}
                            alt=""
                            style={{ objectFit: "cover" }}
                          />
                        ) : null}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            display: "flex",
                            width: 22,
                            height: 22,
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: DISPLAY,
                            fontSize: 13,
                            backgroundColor: elegido ? ORO : LINEA,
                            color: elegido ? NOCHE : TENUE,
                          }}
                        >
                          {e.combate.n}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            fontFamily: DISPLAY,
                            fontSize: 25,
                            lineHeight: 1.16,
                            textTransform: "uppercase",
                            color: elegido ? CREMA : HUMO,
                          }}
                        >
                          {elegido ? elegido.nombre : "Sin pronóstico"}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            fontSize: 17,
                            letterSpacing: 2,
                            textTransform: "uppercase",
                            color: elegido ? ORO_MEDIO : HUMO,
                            marginTop: 1,
                          }}
                        >
                          {elegido
                            ? `vs ${e.rival?.nombre ?? ""}`
                            : `${e.combate.a.nombre} vs ${e.combate.b.nombre}`}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 18, marginBottom: 14 }}>
            <Filete />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 4,
                color: ORO,
                textTransform: "uppercase",
              }}
            >
              {hechos} de {COMBATES.length} combates elegidos
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 20,
                letterSpacing: 4,
                color: TENUE,
                textTransform: "uppercase",
              }}
            >
              Arma los tuyos en {DOMINIO}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: DISPLAY, data: anton, style: "normal", weight: 400 },
        { name: COND, data: barlowCond, style: "normal", weight: 600 },
      ],
    },
  );
}
