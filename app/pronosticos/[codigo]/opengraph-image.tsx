import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { COMBATES, EVENTO } from "@/lib/evento";
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

// La paleta de `globals.css`, a mano: aquí no hay Tailwind ni variables CSS.
const ORO = "#d4af37";
const ORO_CLARO = "#f7e3a1";
const ORO_MEDIO = "#b08a34";
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
              "radial-gradient(70% 55% at 50% 0%, rgba(212,175,55,0.20) 0%, rgba(11,11,13,0) 72%)",
          }}
        />

        <Filete alto={5} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            padding: "30px 54px 26px",
          }}
        >
          {/* Encabezado: quién y qué, a la izquierda; cuándo y dónde, a la
              derecha. Es lo que hace que la imagen se entienda sola cuando
              aparece suelta en un chat, sin el enlace a la vista. */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 21,
                  letterSpacing: 7,
                  color: ORO,
                  textTransform: "uppercase",
                }}
              >
                Mis pronósticos
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: DISPLAY,
                  fontSize: 58,
                  lineHeight: 1.1,
                  color: ORO_CLARO,
                  textTransform: "uppercase",
                  marginTop: 2,
                }}
              >
                {EVENTO.nombre}
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

          <div style={{ display: "flex", marginTop: 20, marginBottom: 20 }}>
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
                  return (
                    <div
                      key={e.combate.n}
                      style={{
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                        gap: 14,
                        padding: "11px 16px",
                        borderRadius: 3,
                        border: `1px solid ${estelar ? ORO : LINEA}`,
                        backgroundColor: estelar ? ORO_TINTE : CARBON,
                      }}
                    >
                      {/* Número del combate: dorado si lo pronosticó */}
                      <div
                        style={{
                          display: "flex",
                          width: 40,
                          height: 40,
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: DISPLAY,
                          fontSize: 21,
                          backgroundColor: elegido ? ORO : LINEA,
                          color: elegido ? NOCHE : TENUE,
                        }}
                      >
                        {e.combate.n}
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

          <div style={{ display: "flex", marginTop: 20, marginBottom: 16 }}>
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
