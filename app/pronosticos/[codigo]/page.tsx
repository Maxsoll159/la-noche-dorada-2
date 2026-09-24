import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconoExterno } from "@/assets/icons";
import { BANDERAS, CASA_APUESTAS, COMBATES, EVENTO } from "@/lib/evento";
import {
  METODO,
  eleccionesDe,
  metodosDeCodigo,
  votosDeCodigo,
} from "@/lib/compartir";
import { Bandera } from "@/components/ui/bandera";
import { FileteOro } from "@/components/ui/filete-oro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export function generateStaticParams() {
  return [];
}

export const revalidate = 604800;

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
    .join(
      " · ",
    )}. Arma los tuyos. ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima.`;

  return {
    title: titulo,
    description: descripcion,
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
  };
}

export default async function Page(props: PageProps<"/pronosticos/[codigo]">) {
  const { codigo } = await props.params;
  const votos = votosDeCodigo(codigo);
  if (!votos) notFound();

  const elecciones = eleccionesDe(votos, metodosDeCodigo(codigo) ?? {});
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
            <header className="flex flex-col items-center gap-3 text-center">
              <p className="flex items-center gap-2.5 font-cond text-[11px] font-bold tracking-[0.24em] text-oro uppercase">
                <span aria-hidden className="h-px w-6 bg-oro-profundo" />
                Pronósticos compartidos
                <span aria-hidden className="h-px w-6 bg-oro-profundo" />
              </p>
              <h1 className="texto-oro text-[30px] leading-[1.12] break-words sm:text-[46px] lg:text-[56px]">
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
                    className={`rounded-full border px-3.5 py-1.5 font-cond text-[10px] font-bold tracking-[0.14em] uppercase sm:text-[11px] ${
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

            <div className="flex w-full flex-col items-center gap-2.5">
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
                {CASA_APUESTAS && (
                  <a
                    href={CASA_APUESTAS.url}
                    target="_blank"
                    rel="noreferrer sponsored"
                    aria-label={`Apostar en ${CASA_APUESTAS.nombre} (se abre en otra pestaña)`}
                    className="group flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm border-2 border-oro bg-noche px-6 py-3 font-cond text-[13px] font-bold tracking-[0.12em] text-crema uppercase shadow-[0_8px_26px_rgba(212,175,55,0.22)] transition-colors hover:bg-oro-tinte sm:text-[14px] sm:tracking-[0.14em]"
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
                    <IconoExterno
                      size={15}
                      strokeWidth={2.4}
                      className="shrink-0 text-oro transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                )}

                <Link
                  href="/#pronosticos"
                  className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm bg-oro px-6 py-3 font-cond text-[13px] font-bold tracking-[0.12em] text-noche uppercase shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro sm:text-[14px] sm:tracking-[0.14em]"
                >
                  Armar mis pronósticos
                </Link>
              </div>

              <p className="font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase">
                +18 · Juega con responsabilidad
              </p>
            </div>

            <ul className="grid w-full gap-3 lg:grid-cols-2 lg:gap-4">
              {elecciones.map((e) => {
                const { combate, elegido, rival, metodo } = e;
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
                              <span className="min-w-0 truncate font-display text-[20px] leading-[1.2] text-crema uppercase transition-colors group-hover:text-oro sm:text-[23px]">
                                {elegido.nombre}
                              </span>
                            </Link>
                            <span className="mt-1 block truncate font-cond text-[11px] font-bold tracking-[0.16em] text-oro-medio uppercase">
                              vs {rival?.nombre}
                              <span className="text-tenue">
                                {" "}
                                · {BANDERAS[elegido.pais].nombre}
                              </span>
                            </span>
                            {metodo && (
                              <span className="mt-1.5 inline-flex rounded-full border border-oro-profundo bg-oro-tinte px-2.5 py-[3px] font-cond text-[10px] leading-none font-bold tracking-[0.14em] text-oro uppercase">
                                {METODO[metodo].nombre}
                              </span>
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="min-w-0 flex-1">
                          <span className="block font-display text-[20px] leading-[1.2] text-humo uppercase">
                            Sin pronóstico
                          </span>
                          <span className="mt-1 block truncate font-cond text-[11px] font-bold tracking-[0.16em] text-tenue uppercase">
                            {combate.a.nombre} vs {combate.b.nombre}
                          </span>
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex w-full flex-col items-center gap-4 rounded-sm border border-oro-profundo bg-oro-tinte px-5 py-6 text-center sm:px-8">
              <p className="font-display text-[24px] leading-tight text-oro-claro uppercase sm:text-[30px]">
                ¿Y tú a quién le vas?
              </p>
              <a
                href={EVENTO.entradasUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-sm border border-oro-profundo px-8 py-4 font-cond text-[14px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:border-oro hover:bg-noche sm:w-auto"
              >
                Comprar entradas
                <IconoExterno size={15} strokeWidth={2.4} />
              </a>
            </div>

            <p className="text-center font-cond text-[11px] font-semibold tracking-[0.16em] text-oro-medio uppercase">
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
