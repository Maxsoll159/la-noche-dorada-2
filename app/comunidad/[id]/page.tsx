import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Image from "next/image";
import {
  IconoChevronIzquierda,
  IconoExterno,
  IconoTrofeo,
} from "@/assets/icons";
import { COLUMNAS_PRONOSTICO, pronosticoPublico } from "@/lib/api/comunidad";
import { idValido } from "@/lib/api/servidor";
import {
  eleccionesDe,
  eleccionesDeCodigo,
  votosDeCodigo,
} from "@/lib/compartir";
import { CASA_APUESTAS, COMBATES, EVENTO } from "@/lib/evento";
import { haceCuanto } from "@/lib/formato";
import { clientePublico } from "@/lib/supabase/servidor";
import { AccionesPronostico } from "@/components/comunidad/acciones-pronostico";
import { RejillaElecciones } from "@/components/comunidad/rejilla-elecciones";
import { Comentarios } from "@/components/peleador/comentarios";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AvatarUsuario } from "@/components/ui/avatar-usuario";
import { Estrellas } from "@/components/ui/estrellas";
import { FileteOro } from "@/components/ui/filete-oro";
import { Seccion } from "@/components/ui/seccion";

// Contadores y descripción cambian a cada rato: se lee en cada petición.
export const dynamic = "force-dynamic";

// Lo que ve cualquiera, sin sesión. Lo propio y la reacción se piden luego
// desde el navegador (AccionesPronostico).
const leer = cache(async (idCrudo: string) => {
  const id = idValido(idCrudo);
  if (!id) return null;
  const { data, error } = await clientePublico()
    .from("pronosticos_publicados")
    .select(COLUMNAS_PRONOSTICO)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("comunidad: no se pudo leer el pronóstico", error);
    return null;
  }
  return data ? pronosticoPublico(data, null, null) : null;
});

export async function generateMetadata(
  props: PageProps<"/comunidad/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const p = await leer(id);
  if (!p) return {};

  const elegidos = eleccionesDe(votosDeCodigo(p.codigo) ?? {}).filter(
    (e) => e.elegido,
  );
  const titulo = `Pronósticos de ${p.autor_nombre}`;
  const descripcion =
    p.descripcion ??
    `${p.autor_nombre} eligió a ${elegidos.map((e) => e.elegido?.nombre).join(" · ")} para ${EVENTO.nombre}. Mira sus pronósticos, reacciona y comenta.`;

  return {
    title: titulo,
    description: descripcion,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: EVENTO.nombre,
      url: `/comunidad/${p.id}`,
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      images: [`/pronosticos/${p.codigo}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      images: [`/pronosticos/${p.codigo}/opengraph-image`],
    },
  };
}

export default async function Page(props: PageProps<"/comunidad/[id]">) {
  const { id } = await props.params;
  const p = await leer(id);
  if (!p) notFound();

  const elecciones = eleccionesDeCodigo(p.codigo);
  const hechos = elecciones.filter((e) => e.elegido).length;
  const estelar = elecciones.find((e) => e.combate.estelar);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-noche pt-24 pb-14 lg:pt-32 lg:pb-20">
          <Estrellas />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_15%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
          />

          <div className="mx-auto flex max-w-contenido flex-col gap-7 px-6 lg:gap-9 lg:px-14">
            <Link
              href="/comunidad"
              className="flex w-fit items-center gap-2 font-cond text-[12px] font-bold tracking-[0.18em] text-oro-medio uppercase transition-colors hover:text-oro"
            >
              <IconoChevronIzquierda size={14} strokeWidth={2.4} />
              Volver a la comunidad
            </Link>

            <header className="relative isolate overflow-hidden rounded-md border border-oro-profundo bg-[linear-gradient(135deg,#1f180a_0%,#120f09_45%,#0d0c0b_100%)] shadow-[0_24px_60px_-30px_rgba(212,175,55,0.5)]">
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro-claro to-transparent"
              />

              <div className="flex flex-col gap-4 px-4 pt-4 pb-5 sm:px-6 sm:pt-5">
                <div className="flex min-w-0 items-center gap-3.5 sm:gap-4">
                  <AvatarUsuario
                    nombre={p.autor_nombre}
                    url={p.autor_avatar}
                    className="size-12 sm:size-14"
                  />
                  <div className="min-w-0">
                    <p className="font-cond text-[10px] font-bold tracking-[0.26em] text-oro uppercase">
                      Pronósticos de
                    </p>
                    <h1 className="texto-oro truncate text-[24px] leading-[1.1] sm:text-[30px]">
                      {p.autor_nombre}
                    </h1>
                    <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase">
                      <time dateTime={p.actualizado_en}>
                        {haceCuanto(p.actualizado_en)}
                      </time>
                      <span aria-hidden className="text-oro-profundo">
                        ·
                      </span>
                      <span
                        className={hechos === COMBATES.length ? "text-oro" : ""}
                      >
                        {hechos} de {COMBATES.length} combates
                      </span>
                      {estelar?.elegido && (
                        <>
                          <span aria-hidden className="text-oro-profundo">
                            ·
                          </span>
                          <span className="flex items-center gap-1 text-oro-claro">
                            <IconoTrofeo className="size-[12px] text-oro" />
                            Estelar: {estelar.elegido.nombre}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {p.descripcion ? (
                  <blockquote className="border-t border-oro-profundo/50 pt-4">
                    <p className="texto-oro font-display text-[22px] leading-[1.15] break-words whitespace-pre-line drop-shadow-[0_0_18px_rgba(212,175,55,0.3)] sm:text-[28px] lg:text-[32px]">
                      {p.descripcion}
                    </p>
                  </blockquote>
                ) : (
                  <p className="border-t border-oro-profundo/50 pt-4 font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
                    Sin descripción · Que hablen los puños
                  </p>
                )}
              </div>

              <div className="border-t border-oro-profundo/40 bg-noche/40 px-4 py-3 sm:px-6">
                <AccionesPronostico inicial={p} />
              </div>
            </header>

            <div className="flex flex-col gap-4">
              <p className="flex items-center gap-3 font-cond text-[13px] font-bold tracking-[0.26em] text-oro uppercase">
                Sus elegidos
                <span aria-hidden className="h-px flex-1 bg-linea" />
                <span className="text-tenue">Del combate 01 al estelar</span>
              </p>
              <RejillaElecciones elecciones={elecciones} grande />
            </div>

            <div className="flex w-full flex-col items-center gap-4 rounded-sm border border-oro-profundo bg-oro-tinte px-5 py-6 text-center sm:px-8">
              <p className="font-display text-[24px] leading-tight text-oro-claro uppercase sm:text-[30px]">
                ¿Y tú a quién le vas?
              </p>
              <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
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
                  className="flex min-h-[52px] items-center justify-center gap-2.5 rounded-sm bg-oro px-8 py-3 font-cond text-[14px] font-bold tracking-[0.14em] text-noche uppercase shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro"
                >
                  Armar mis pronósticos
                </Link>
                <Link
                  href="/comunidad"
                  className="flex min-h-[52px] items-center justify-center gap-2 rounded-sm border border-oro-profundo px-8 py-3 font-cond text-[14px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:border-oro hover:bg-noche"
                >
                  Ver más pronósticos
                </Link>
              </div>
              {CASA_APUESTAS && (
                <p className="font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase">
                  +18 · Juega con responsabilidad
                </p>
              )}
            </div>
          </div>
        </section>
        <FileteOro />

        <Seccion
          id="comentarios"
          fondo="superficie"
          antetitulo="La comunidad opina"
          titulo="Comentarios"
        >
          <Comentarios
            destino={{ pronostico: p.id }}
            nombre="este pronóstico"
          />
        </Seccion>
      </main>
      <SiteFooter />
    </>
  );
}
