import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { IconoChevronIzquierda } from "@/assets/icons";
import { COLUMNAS_PRONOSTICO, pronosticoPublico } from "@/lib/api/comunidad";
import { idValido } from "@/lib/api/servidor";
import { eleccionesDe, metodosDeCodigo, votosDeCodigo } from "@/lib/compartir";
import { COMBATES, EVENTO } from "@/lib/evento";
import { haceCuanto } from "@/lib/formato";
import { clientePublico } from "@/lib/supabase/servidor";
import { AccionesPronostico } from "@/components/comunidad/acciones-pronostico";
import { Comentarios } from "@/components/peleador/comentarios";
import { ListaElecciones } from "@/components/pronosticos/lista-elecciones";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AvatarUsuario } from "@/components/ui/avatar-usuario";
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

  const elecciones = eleccionesDe(
    votosDeCodigo(p.codigo) ?? {},
    metodosDeCodigo(p.codigo) ?? {},
  );
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

          <div className="mx-auto flex max-w-contenido flex-col gap-7 px-6 lg:gap-9 lg:px-14">
            <Link
              href="/comunidad"
              className="flex w-fit items-center gap-2 font-cond text-[12px] font-bold tracking-[0.18em] text-oro-medio uppercase transition-colors hover:text-oro"
            >
              <IconoChevronIzquierda size={14} strokeWidth={2.4} />
              Volver a la comunidad
            </Link>

            <header className="flex flex-col gap-5 rounded-md border border-oro-profundo bg-[linear-gradient(135deg,#1f180a_0%,#120f09_45%,#0d0c0b_100%)] p-5 sm:p-7">
              <div className="flex items-center gap-4">
                <AvatarUsuario
                  nombre={p.autor_nombre}
                  url={p.autor_avatar}
                  className="size-14 sm:size-16"
                />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2.5 font-cond text-[11px] font-bold tracking-[0.24em] text-oro uppercase">
                    Pronósticos de
                  </p>
                  <h1 className="texto-oro truncate text-[30px] leading-[1.15] sm:text-[40px]">
                    {p.autor_nombre}
                  </h1>
                  <p className="font-cond text-[12px] font-semibold tracking-[0.1em] text-tenue uppercase">
                    <time dateTime={p.actualizado_en}>
                      {haceCuanto(p.actualizado_en)}
                    </time>
                    <span aria-hidden> · </span>
                    {hechos} de {COMBATES.length} combates
                  </p>
                </div>
              </div>

              {p.descripcion && (
                <blockquote className="border-l-2 border-oro pl-4 text-[16px] leading-relaxed break-words whitespace-pre-line text-crema sm:text-[18px]">
                  {p.descripcion}
                </blockquote>
              )}

              <AccionesPronostico inicial={p} />
            </header>

            <ListaElecciones elecciones={elecciones} />

            <div className="flex w-full flex-col items-center gap-4 rounded-sm border border-oro-profundo bg-oro-tinte px-5 py-6 text-center sm:px-8">
              <p className="font-display text-[24px] leading-tight text-oro-claro uppercase sm:text-[30px]">
                ¿Y tú a quién le vas?
              </p>
              <Link
                href="/#pronosticos"
                className="flex w-full items-center justify-center gap-2.5 rounded-sm bg-oro px-8 py-4 font-cond text-[14px] font-bold tracking-[0.14em] text-noche uppercase shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro sm:w-auto"
              >
                Armar mis pronósticos
              </Link>
            </div>
          </div>
        </section>

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
