import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BANDERAS, CASA_APUESTAS, COMBATES, EVENTO } from "@/lib/evento";
import { eleccionesDe, votosDeCodigo } from "@/lib/compartir";
import { Bandera } from "@/app/components/bandera";
import { FileteOro } from "@/app/components/filete-oro";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

/**
 * Ningún código se prerrenderiza en el build: son 3⁸ combinaciones y solo
 * existen las que alguien comparte. Con la lista vacía, cada enlace se genera
 * la primera vez que se abre y queda cacheado (ver `revalidate`), así que la
 * segunda visita —y el robot de WhatsApp, y el de Facebook— ya lo encuentran
 * hecho.
 */
export function generateStaticParams() {
  return [];
}

export const revalidate = 604800; // una semana

export async function generateMetadata(
  props: PageProps<"/pronosticos/[codigo]">,
): Promise<Metadata> {
  const { codigo } = await props.params;
  const votos = votosDeCodigo(codigo);
  if (!votos) return {};

  const elecciones = eleccionesDe(votos).filter((e) => e.elegido);
  const titulo = `Mis pronósticos · ${elecciones.length} de ${COMBATES.length} combates`;
  const descripcion = `Estos son mis pronósticos para ${EVENTO.nombre}: ${elecciones
    .map((e) => e.elegido?.nombre)
    .join(" · ")}. Arma los tuyos. ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima.`;

  return {
    title: titulo,
    description: descripcion,
    // Hay una URL por combinación de votos: son páginas para compartir, no
    // para buscar. Se indexa la home, no ocho mil variantes del mismo cartel.
    // `follow` sí, para que los enlaces de aquí dentro sigan contando.
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: EVENTO.nombre,
      url: `/pronosticos/${codigo}`,
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
    },
    // La imagen la ponen `opengraph-image.tsx` y `twitter-image.tsx`.
  };
}

export default async function Page(props: PageProps<"/pronosticos/[codigo]">) {
  const { codigo } = await props.params;
  const votos = votosDeCodigo(codigo);
  if (!votos) notFound();

  const elecciones = eleccionesDe(votos);
  const hechos = elecciones.filter((e) => e.elegido).length;

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-noche pt-24 pb-14 lg:pt-32 lg:pb-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_20%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
          />

          <div className="mx-auto flex max-w-contenido flex-col items-center gap-7 px-6 lg:gap-9 lg:px-14">
            {/* En móvil esta cabecera es lo único que se ve antes de los
                botones, así que va corta a propósito: el titular ya dice de
                qué va y la lista de abajo dice el resto. La sede no entra
                aquí —está en el pie y en la imagen compartida— porque metía
                una tercera fila de chips y empujaba los botones fuera de
                pantalla. */}
            <header className="flex flex-col items-center gap-3 text-center">
              <p className="flex items-center gap-2.5 font-cond text-[11px] font-bold uppercase tracking-[0.24em] text-oro">
                <span aria-hidden className="h-px w-6 bg-oro-profundo" />
                Pronósticos compartidos
                <span aria-hidden className="h-px w-6 bg-oro-profundo" />
              </p>
              {/* En primera persona a propósito: quien abre esto llega desde
                  un chat, y lo que tiene delante es la quiniela de quien se la
                  pasó. Es la misma voz del titular de la imagen compartida. */}
              <h1 className="texto-oro break-words text-[30px] leading-[1.12] sm:text-[46px] lg:text-[56px]">
                Estos son mis pronósticos
              </h1>
              <p className="max-w-[34rem] text-[15px] leading-relaxed text-tenue sm:text-[16px]">
                Mis elegidos en los {COMBATES.length} combates. Míralos y arma
                tu quiniela.
              </p>

              <ul className="flex flex-wrap items-center justify-center gap-2">
                {[
                  {
                    etiqueta: `${hechos} de ${COMBATES.length} combates`,
                    fuerte: true,
                  },
                  { etiqueta: EVENTO.fechaLarga, fuerte: false },
                ].map((c) => (
                  <li
                    key={c.etiqueta}
                    className={`rounded-full border px-3.5 py-1.5 font-cond text-[10px] font-bold uppercase tracking-[0.14em] sm:text-[11px] ${
                      c.fuerte
                        ? "border-oro bg-oro-tinte text-oro"
                        : "border-linea bg-carbon text-tenue"
                    }`}
                  >
                    {c.etiqueta}
                  </li>
                ))}
              </ul>
            </header>

            {/* Las acciones van ARRIBA, pegadas al titular. Casi todo el
                tráfico de esta página llega de un chat en el móvil, y ahí la
                lista de ocho combates mide varias pantallas: un botón al pie
                queda a tres scrolls de distancia y no lo ve nadie. A ancho
                completo y apilados en móvil; en fila desde sm. */}
            <div className="flex w-full flex-col items-center gap-2.5">
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                {/* Botón de apuestas, con el logo real de la marca en vez de
                    su nombre escrito: el wordmark es lo que la identifica y
                    evita inventarle colores. El fondo va oscuro porque ese
                    logo es la versión clara. Solo aparece si algún
                    patrocinador está marcado como casa de apuestas. */}
                {CASA_APUESTAS && (
                  <a
                    href={CASA_APUESTAS.url}
                    target="_blank"
                    rel="noreferrer sponsored"
                    aria-label={`Apostar en ${CASA_APUESTAS.nombre} (se abre en otra pestaña)`}
                    className="group flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm border-2 border-oro bg-noche px-6 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.12em] text-crema shadow-[0_8px_26px_rgba(212,175,55,0.22)] transition-colors hover:bg-oro-tinte sm:text-[14px] sm:tracking-[0.14em]"
                  >
                    <span aria-hidden>Apostar en</span>
                    <Image
                      src={CASA_APUESTAS.logo}
                      alt=""
                      width={CASA_APUESTAS.w}
                      height={CASA_APUESTAS.h}
                      sizes="84px"
                      className="h-auto w-[84px]"
                    />
                    <svg
                      aria-hidden
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      className="shrink-0 text-oro transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      <path d="M7 17 17 7M9 7h8v8" />
                    </svg>
                  </a>
                )}

                <Link
                  href="/#pronosticos"
                  className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm bg-oro px-6 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.12em] text-noche shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro sm:text-[14px] sm:tracking-[0.14em]"
                >
                  Armar mis pronósticos
                </Link>
              </div>

              {/* El aviso viaja con el botón de apuestas, no solo en el pie. */}
              <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-medio">
                +18 · Juega con responsabilidad
              </p>
            </div>

            {/* Las ocho elecciones, del estelar al primer combate: el mismo
                orden del cartel, de la imagen compartida y de la home. */}
            <ul className="grid w-full gap-3 lg:grid-cols-2 lg:gap-4">
              {elecciones.map((e) => {
                const { combate, elegido, rival } = e;
                return (
                  <li key={combate.n}>
                    <div
                      className={`flex h-full items-center gap-4 rounded-sm border px-4 py-3.5 ${
                        combate.estelar
                          ? "border-oro bg-oro-tinte"
                          : "border-linea bg-carbon"
                      }`}
                    >
                      <span
                        className={`grid size-11 shrink-0 place-items-center font-display text-[19px] leading-none ${
                          elegido ? "bg-oro text-noche" : "bg-linea text-tenue"
                        }`}
                      >
                        {combate.n}
                      </span>

                      {elegido ? (
                        <>
                          <span className="relative block h-[62px] w-[50px] shrink-0 overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12]">
                            <Image
                              src={elegido.cuerpo ?? elegido.foto}
                              alt=""
                              fill
                              sizes="50px"
                              className={`object-cover object-top ${
                                elegido.cuerpo
                                  ? "brightness-125 contrast-[1.06]"
                                  : ""
                              }`}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <Link
                              href={`/peleadores/${elegido.slug}`}
                              className="group flex min-w-0 items-center gap-2"
                            >
                              <Bandera
                                pais={elegido.pais}
                                className="h-2.5 w-[15px] shrink-0"
                              />
                              <span className="min-w-0 truncate font-display text-[20px] uppercase leading-[1.2] text-crema transition-colors group-hover:text-oro sm:text-[23px]">
                                {elegido.nombre}
                              </span>
                            </Link>
                            <span className="mt-1 block truncate font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro-medio">
                              vs {rival?.nombre}
                              <span className="text-tenue">
                                {" "}
                                · {BANDERAS[elegido.pais].nombre}
                              </span>
                            </span>
                          </span>
                        </>
                      ) : (
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[20px] uppercase leading-[1.2] text-humo">
                            Sin pronóstico
                          </span>
                          <span className="mt-1 block truncate font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-tenue">
                            {combate.a.nombre} vs {combate.b.nombre}
                          </span>
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Cierre: las dos acciones principales ya están arriba, así que
                aquí solo queda la de asistir, para quien haya bajado leyendo
                los ocho combates. */}
            <div className="flex w-full flex-col items-center gap-4 rounded-sm border border-oro-profundo bg-oro-tinte px-5 py-6 text-center sm:px-8">
              <p className="font-display text-[24px] uppercase leading-tight text-oro-claro sm:text-[30px]">
                ¿Y tú a quién le vas?
              </p>
              <a
                href={EVENTO.entradasUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-oro-profundo px-8 py-4 font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:border-oro hover:bg-noche sm:w-auto"
              >
                Comprar entradas
                <svg
                  aria-hidden
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </div>

            {/* El +18 ya va arriba, junto al botón de apuestas; aquí solo
                queda de qué son estos pronósticos. */}
            <p className="text-center font-cond text-[11px] font-semibold uppercase tracking-[0.16em] text-oro-medio">
              Pronósticos de quien compartió el enlace · No son un resultado
              oficial
            </p>
          </div>
        </section>
        <FileteOro />
      </main>
      <SiteFooter />
    </>
  );
}
