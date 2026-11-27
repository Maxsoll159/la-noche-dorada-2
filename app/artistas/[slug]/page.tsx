import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTISTAS, EVENTO, artistaDe } from "@/lib/evento";
import {
  Ecualizador,
  IconoPlay,
  IconoSpotify,
} from "@/components/artistas/adornos";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CuentaRegresiva } from "@/components/ui/cuenta-regresiva";
import { Estrellas } from "@/components/ui/estrellas";
import { FileteOro } from "@/components/ui/filete-oro";

export function generateStaticParams() {
  return ARTISTAS.filter((a) => a.slug && a.nombre).map((a) => ({
    slug: a.slug!,
  }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/artistas/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const artista = artistaDe(slug);
  if (!artista?.nombre) return {};

  const descripcion = `${artista.nombre} en vivo en ${EVENTO.nombre}: ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima. Escucha sus canciones antes de la noche.`;
  const titulo = `${artista.nombre} · Artistas · ${EVENTO.nombre}`;

  return {
    title: `${artista.nombre} · Artistas`,
    description: descripcion,
    alternates: { canonical: `/artistas/${slug}` },
    openGraph: {
      type: "profile",
      locale: "es_PE",
      siteName: EVENTO.nombre,
      url: `/artistas/${slug}`,
      title: titulo,
      description: descripcion,
      ...(artista.foto && {
        images: [
          { url: artista.foto, width: 1000, height: 1000, alt: artista.nombre },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descripcion,
      ...(artista.foto && { images: [artista.foto] }),
    },
  };
}

// Disco de vinilo que asoma detrás de la portada y gira como en un tocadiscos.
function Vinilo({ foto }: { foto?: string }) {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 right-0 aspect-square h-[90%] -translate-y-1/2 transition-transform duration-700 group-hover:translate-x-[8%]"
    >
      <div
        className="relative size-full girar rounded-full bg-[repeating-radial-gradient(circle_at_50%_50%,#0d0d0f_0_2px,#1c1c21_2px_3px)] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(212,175,55,0.3)]"
        style={{ animationDuration: "6s" }}
      >
        <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0deg,rgba(255,255,255,0.09)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.07)_220deg,transparent_260deg)]" />
        <span className="absolute inset-[32%] overflow-hidden rounded-full border-4 border-oro-profundo bg-oro">
          {foto && (
            <Image
              src={foto}
              alt=""
              fill
              sizes="200px"
              className="object-cover"
            />
          )}
        </span>
        <span className="absolute inset-[48.5%] rounded-full bg-noche" />
      </div>
    </div>
  );
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="relative flex flex-col gap-1.5 overflow-hidden rounded-sm border border-oro-profundo/50 bg-[linear-gradient(180deg,rgba(40,31,12,0.6)_0%,rgba(11,11,13,0.6)_80%)] px-4 py-3 backdrop-blur-sm">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro-claro to-transparent"
      />
      <span className="font-cond text-[11px] font-semibold tracking-[0.22em] text-oro uppercase">
        {etiqueta}
      </span>
      <span className="font-display text-[18px] leading-tight tracking-[0.02em] text-crema">
        {valor}
      </span>
    </div>
  );
}

export default async function Page(props: PageProps<"/artistas/[slug]">) {
  const { slug } = await props.params;
  const artista = artistaDe(slug);
  if (!artista?.nombre) notFound();
  const nombre = artista.nombre;
  const otros = ARTISTAS.map((a, i) => ({ ...a, i })).filter(
    (a) => a.slug !== slug,
  );

  return (
    <>
      <SiteHeader />
      <main className="pt-[81px] lg:pt-[89px]">
        <section className="relative isolate overflow-hidden bg-noche">
          {artista.foto && (
            <Image
              src={artista.foto}
              alt=""
              fill
              sizes="100vw"
              className="-z-20 scale-110 object-cover opacity-30 blur-3xl"
            />
          )}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.18),transparent_55%),linear-gradient(to_bottom,rgba(11,11,13,0.35),#0b0b0d_80%)]"
          />
          <Estrellas />
          <FileteOro />

          <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-6 py-10 sm:py-14 lg:px-14 lg:py-16">
            <nav className="flex items-center gap-2 font-cond text-[13px] font-semibold tracking-[0.2em] text-tenue uppercase">
              <Link
                href="/artistas"
                className="transition-colors hover:text-oro"
              >
                ← Artistas
              </Link>
              <span aria-hidden className="text-oro-profundo">
                /
              </span>
              <span className="text-crema">{nombre}</span>
            </nav>

            <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
              {/* Portada con vinilo + cuenta regresiva */}
              <div className="flex flex-col gap-8 lg:sticky lg:top-32">
                <div className="group relative entrada pr-[24%]">
                  <Vinilo foto={artista.foto} />
                  <div className="relative isolate aspect-square overflow-hidden rounded-sm border border-oro-profundo shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),0_0_80px_-16px_rgba(212,175,55,0.5)]">
                    {artista.foto && (
                      <Image
                        src={artista.foto}
                        alt={nombre}
                        fill
                        priority
                        sizes="(min-width: 1024px) 480px, 76vw"
                        className="-z-10 acercar object-cover"
                      />
                    )}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 destello bg-gradient-to-r from-transparent via-oro-claro/20 to-transparent"
                    />
                    <span aria-hidden className="marco-vivo z-10">
                      <span className="marco-vivo-haz" />
                      <span className="marco-vivo-haz marco-vivo-opuesto" />
                    </span>
                    <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-oro px-3 py-1.5 font-cond text-[11px] leading-none font-bold tracking-[0.14em] text-noche uppercase shadow-[0_0_20px_rgba(212,175,55,0.6)] sm:top-4 sm:left-4">
                      <span aria-hidden className="relative flex size-2">
                        <span className="absolute inset-0 animate-ping rounded-full bg-lado-a opacity-75" />
                        <span className="relative size-2 rounded-full bg-lado-a" />
                      </span>
                      Confirmado
                    </span>
                  </div>
                </div>

                <div
                  className="flex entrada flex-col items-center gap-3"
                  style={{ animationDelay: "0.25s" }}
                >
                  <p className="flex items-center gap-3 font-cond text-[13px] font-semibold tracking-[0.24em] text-oro uppercase">
                    <span aria-hidden className="h-px w-8 bg-oro-profundo" />
                    Para verlos en vivo faltan
                    <span aria-hidden className="h-px w-8 bg-oro-profundo" />
                  </p>
                  <CuentaRegresiva inicioISO={EVENTO.inicioISO} />
                </div>
              </div>

              {/* Música */}
              <div
                className="flex entrada flex-col gap-7"
                style={{ animationDelay: "0.12s" }}
              >
                <div className="flex flex-col gap-3">
                  <p className="flex items-center gap-2 font-cond text-[13px] font-semibold tracking-[0.24em] text-oro uppercase">
                    <span
                      aria-hidden
                      className="flex size-5 items-center justify-center rounded-full bg-[#3d91f4] text-[11px] text-white"
                    >
                      ✓
                    </span>
                    Artista confirmado
                  </p>
                  <div className="flex items-end gap-4">
                    <h1 className="texto-oro font-display text-[72px] leading-none tracking-[0.03em] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] sm:text-[112px]">
                      {nombre}
                    </h1>
                    <Ecualizador className="mb-4 h-10 sm:mb-6 sm:h-16" />
                  </div>
                  <p className="max-w-[36rem] text-[17px] leading-relaxed text-tenue">
                    Pone la música de {EVENTO.nombre}. Dale play, apréndete los
                    coros y llega listo para cantarlos en el coliseo.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {artista.genero && (
                    <Dato etiqueta="Género" valor={artista.genero} />
                  )}
                  <Dato etiqueta="Fecha" valor={EVENTO.fechaLarga} />
                  <Dato etiqueta="Hora" valor={EVENTO.hora} />
                  <Dato etiqueta="Lugar" valor={EVENTO.sede} />
                </div>

                {artista.spotify && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="flex items-center gap-2.5 font-display text-[26px] leading-none tracking-[0.04em] text-crema sm:text-[30px]">
                        <IconoSpotify className="size-6 text-[#1db954]" />
                        Sus canciones
                      </h2>
                      <span className="flex items-center gap-1.5 font-cond text-[12px] font-semibold tracking-[0.2em] text-tenue uppercase">
                        <span
                          aria-hidden
                          className="size-1.5 latido rounded-full bg-[#1db954]"
                        />
                        Escúchalas aquí
                      </span>
                    </div>
                    <div className="rounded-xl bg-[linear-gradient(135deg,#1db954,#0b0b0d_45%,#8c6b22)] p-px shadow-[0_24px_60px_-20px_rgba(29,185,84,0.35)]">
                      <div className="overflow-hidden rounded-[11px] bg-[#121212]">
                        <iframe
                          title={`${nombre} en Spotify`}
                          src={`https://open.spotify.com/embed/artist/${artista.spotify}?utm_source=generator&theme=0`}
                          width="100%"
                          height="452"
                          loading="lazy"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          className="block"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <a
                    href={EVENTO.entradasUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="relative flex items-center gap-2.5 overflow-hidden rounded-full bg-oro px-6 py-3.5 font-cond text-[15px] font-bold tracking-[0.12em] text-noche uppercase shadow-[0_0_30px_-6px_rgba(212,175,55,0.7)] transition hover:scale-[1.03] hover:bg-oro-claro"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 brillo-boton bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    />
                    Comprar entradas
                  </a>
                  {artista.spotify && (
                    <a
                      href={`https://open.spotify.com/artist/${artista.spotify}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2.5 rounded-full border border-[#1db954] px-6 py-3.5 font-cond text-[15px] font-bold tracking-[0.12em] text-[#1db954] uppercase transition hover:scale-[1.03] hover:bg-[#1db954] hover:text-noche"
                    >
                      <IconoSpotify className="size-5" />
                      Seguir en Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {otros.length > 0 && (
          <section className="relative isolate overflow-hidden bg-superficie">
            <Estrellas />
            <FileteOro />
            <div className="mx-auto flex max-w-[88rem] flex-col gap-8 px-6 py-12 sm:py-14 lg:px-14">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <p className="font-cond text-[13px] font-semibold tracking-[0.28em] text-oro uppercase">
                    El resto del cartel
                  </p>
                  <h2 className="font-display text-[36px] leading-none tracking-wide text-crema sm:text-[44px]">
                    Más artistas de la noche
                  </h2>
                </div>
                <Link
                  href="/artistas"
                  className="flex items-center gap-2 font-cond text-[14px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:text-oro-claro"
                >
                  Ver todos <IconoPlay className="size-3" />
                </Link>
              </div>
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {otros.map((a) => (
                  <li key={a.slug ?? `incognito-${a.i}`}>
                    <Link
                      href={a.slug ? `/artistas/${a.slug}` : "/artistas"}
                      className={`group relative isolate flex aspect-[4/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-sm border ${a.nombre ? "border-oro-profundo" : "border-dashed border-oro-profundo"} bg-[radial-gradient(circle_at_50%_35%,#3a2c12_0%,#17120a_50%,#0b0b0d_100%)] transition duration-300 hover:-translate-y-1 hover:border-solid hover:border-oro`}
                    >
                      <span className="absolute top-2.5 left-3 font-display text-[20px] leading-none text-crema/40">
                        {String(a.i + 1).padStart(2, "0")}
                      </span>
                      {a.nombre && a.foto ? (
                        <>
                          <Image
                            src={a.foto}
                            alt=""
                            fill
                            sizes="(min-width: 640px) 320px, 50vw"
                            className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span
                            aria-hidden
                            className="absolute inset-0 -z-10 bg-gradient-to-t from-noche via-noche/30 to-transparent"
                          />
                          <span className="texto-oro mt-auto mb-3 px-2 text-center font-display text-[22px] leading-none tracking-[0.04em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                            {a.nombre}
                          </span>
                        </>
                      ) : (
                        <>
                          <span
                            aria-hidden
                            className="texto-oro incognito font-display text-[56px] leading-none"
                            style={{ animationDelay: `${-a.i * 0.6}s` }}
                          >
                            ?
                          </span>
                          <span className="font-display text-[18px] leading-none tracking-[0.06em] text-crema">
                            Incógnito
                          </span>
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
