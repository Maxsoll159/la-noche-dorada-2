import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BANDERAS, COMBATES, EVENTO } from "@/lib/evento";
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
  const titulo = `Pronósticos · ${elecciones.length} de ${COMBATES.length} combates`;
  const descripcion = `${elecciones
    .map((e) => e.elegido?.nombre)
    .join(" · ")}. Arma los tuyos para ${EVENTO.nombre}: ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima.`;

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
        <section className="relative isolate overflow-hidden bg-noche pt-28 pb-16 lg:pt-36 lg:pb-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_20%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
          />

          <div className="mx-auto flex max-w-contenido flex-col items-center gap-9 px-6 lg:px-14">
            <header className="flex flex-col items-center gap-3 text-center">
              <p className="flex items-center gap-3 font-cond text-[12px] font-bold uppercase tracking-[0.28em] text-oro">
                <span aria-hidden className="h-px w-8 bg-oro-profundo" />
                Pronósticos compartidos
                <span aria-hidden className="h-px w-8 bg-oro-profundo" />
              </p>
              <h1 className="texto-oro break-words text-[38px] leading-[1.12] sm:text-[56px] lg:text-[64px]">
                {hechos} de {COMBATES.length} combates
              </h1>
              <p className="max-w-[40rem] text-[17px] leading-relaxed text-tenue">
                Así quedó la quiniela de quien te pasó este enlace para{" "}
                {EVENTO.nombre}. {EVENTO.fechaLarga} en el {EVENTO.sede}, Lima.
              </p>
            </header>

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

            {/* Es una página de llegada: quien abre el enlace viene de un chat
                y lo que tiene que encontrar es la puerta para armar los suyos. */}
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href="/#pronosticos"
                className="flex items-center justify-center gap-2.5 rounded-sm bg-oro px-8 py-4 font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-noche shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro"
              >
                Armar mis pronósticos
              </Link>
              <a
                href={EVENTO.entradasUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-sm border border-oro-profundo px-8 py-4 font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte"
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

            <p className="text-center font-cond text-[12px] font-semibold uppercase tracking-[0.18em] text-oro-medio">
              Los pronósticos de esta página son de quien compartió el enlace ·
              No son un resultado oficial
            </p>
          </div>
        </section>
        <FileteOro />
      </main>
      <SiteFooter />
    </>
  );
}
