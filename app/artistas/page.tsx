import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ARTISTAS, EVENTO, type Artista } from "@/lib/evento";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Ecualizador, IconoPlay } from "@/components/artistas/adornos";
import { Revelar } from "@/components/ui/revelar";
import { Seccion } from "@/components/ui/seccion";

const CONFIRMADOS = ARTISTAS.filter((a) => a.nombre);

const DESCRIPCION = `La música de ${EVENTO.nombre}: ${CONFIRMADOS.map((a) => a.nombre).join(", ")} y más artistas por anunciar. ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima.`;

export const metadata: Metadata = {
  title: "Artistas",
  description: DESCRIPCION,
  alternates: { canonical: "/artistas" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: EVENTO.nombre,
    url: "/artistas",
    title: `Artistas · ${EVENTO.nombre}`,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: `Artistas · ${EVENTO.nombre}`,
    description: DESCRIPCION,
  },
};

const numero = (i: number) => String(i + 1).padStart(2, "0");

// Haces de luz de escenario que barren el fondo de la sección.
function Focos() {
  const focos = [
    { left: "12%", desde: "-18deg", hasta: "10deg", dur: "9s" },
    { left: "50%", desde: "8deg", hasta: "-8deg", dur: "11s" },
    { left: "88%", desde: "16deg", hasta: "-12deg", dur: "10s" },
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -inset-x-6 -top-64 bottom-0 -z-10 overflow-hidden lg:-inset-x-14"
    >
      {focos.map((f) => (
        <span
          key={f.left}
          className="absolute top-0 h-[120%] w-[340px] foco -translate-x-1/2 bg-[conic-gradient(from_162deg_at_50%_0,transparent_0deg,rgba(247,227,161,0.13)_18deg,transparent_36deg)] [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]"
          style={
            {
              left: f.left,
              "--desde": f.desde,
              "--hasta": f.hasta,
              "--dur": f.dur,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function TarjetaArtista({
  artista,
  i,
}: {
  artista: Artista & { nombre: string; slug: string };
  i: number;
}) {
  return (
    <Link
      href={`/artistas/${artista.slug}`}
      className="group relative isolate col-span-6 block aspect-square overflow-hidden rounded-sm border border-oro-profundo bg-carbon shadow-[0_0_60px_-12px_rgba(212,175,55,0.45)] transition-shadow duration-300 hover:shadow-[0_0_80px_-8px_rgba(212,175,55,0.7)] sm:col-span-3"
    >
      {artista.foto && (
        <Image
          src={artista.foto}
          alt={artista.nombre}
          fill
          priority
          sizes="(min-width: 1280px) 640px, (min-width: 640px) 50vw, 100vw"
          className="-z-10 acercar object-cover"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,#0b0b0d_0%,rgba(11,11,13,0.75)_22%,transparent_55%),linear-gradient(to_bottom,rgba(11,11,13,0.6),transparent_25%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-1/3 destello bg-gradient-to-r from-transparent via-oro-claro/20 to-transparent"
      />
      <span aria-hidden className="marco-vivo z-10">
        <span className="marco-vivo-haz" />
        <span className="marco-vivo-haz marco-vivo-opuesto" />
      </span>

      <div className="flex items-start justify-between p-4 sm:p-6">
        <span className="flex items-center gap-1.5 rounded-full bg-oro px-3 py-1.5 font-cond text-[11px] leading-none font-bold tracking-[0.14em] text-noche uppercase shadow-[0_0_20px_rgba(212,175,55,0.6)]">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-lado-a opacity-75" />
            <span className="relative size-2 rounded-full bg-lado-a" />
          </span>
          Confirmado
        </span>
        <span className="font-display text-[40px] leading-none text-crema/25 sm:text-[56px]">
          {numero(i)}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 sm:p-8">
        <div className="flex items-end gap-4">
          <h3 className="texto-oro font-display text-[48px] leading-[0.95] tracking-[0.03em] drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] sm:text-[52px] lg:text-[72px] xl:text-[84px]">
            {artista.nombre}
          </h3>
          <Ecualizador className="mb-2 h-8 sm:mb-3 sm:h-12" />
        </div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-cond text-[12px] font-semibold tracking-[0.2em] text-crema/85 uppercase sm:text-[14px]">
          <span>En vivo</span>
          <span aria-hidden className="text-oro">
            ✦
          </span>
          <span>{EVENTO.fechaLarga}</span>
          <span aria-hidden className="text-oro">
            ✦
          </span>
          <span>{EVENTO.sede}</span>
        </p>
        <span className="mt-1 flex w-fit items-center gap-2 rounded-full border border-oro/70 bg-noche/60 px-4 py-2 font-cond text-[13px] font-bold tracking-[0.14em] text-oro uppercase backdrop-blur-sm transition-colors group-hover:bg-oro group-hover:text-noche">
          <IconoPlay className="size-3.5" />
          Escuchar sus canciones
        </span>
      </div>
    </Link>
  );
}

// Silueta genérica de un artista, oculta tras el "?".
function Silueta() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="absolute inset-x-0 bottom-0 -z-10 mx-auto h-[88%] w-auto text-oro/[0.13] transition-colors duration-500 group-hover:text-oro/25"
      fill="currentColor"
    >
      <circle cx="100" cy="62" r="30" />
      <path d="M40 200c0-44 26-74 60-74s60 30 60 74z" />
    </svg>
  );
}

function TarjetaIncognito({ i, ancha }: { i: number; ancha: boolean }) {
  return (
    <article
      aria-label={`Artista ${numero(i)}, por anunciar`}
      className={`group relative isolate flex ${ancha ? "aspect-[2/1] sm:aspect-square" : "aspect-square"} flex-col items-center justify-center overflow-hidden rounded-sm border border-dashed border-oro-profundo bg-[radial-gradient(circle_at_50%_38%,#3a2c12_0%,#17120a_45%,#0b0b0d_100%)] p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-solid hover:border-oro hover:shadow-[0_0_40px_-8px_rgba(212,175,55,0.55)]`}
    >
      <Silueta />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.035)_0_1px,transparent_1px_4px)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 destello bg-gradient-to-r from-transparent via-oro-claro/10 to-transparent"
        style={{ animationDelay: `${i * 0.7}s` }}
      />

      <span className="absolute top-3 left-3 font-display text-[26px] leading-none text-crema/20 sm:top-4 sm:left-4 sm:text-[32px]">
        {numero(i)}
      </span>
      <span className="absolute top-3 right-3 rounded-full border border-oro-profundo/80 bg-noche/60 px-2 py-1 font-cond text-[10px] leading-none font-bold tracking-[0.14em] text-oro uppercase sm:top-4 sm:right-4">
        Secreto
      </span>

      <span
        aria-hidden
        className="texto-oro incognito font-display text-[84px] leading-none sm:text-[112px]"
        style={{ animationDelay: `${-i * 0.6}s` }}
      >
        ?
      </span>
      <p className="mt-1 font-display text-[22px] leading-none tracking-[0.08em] text-crema sm:text-[26px]">
        Incógnito
      </p>
      <p className="mt-2 flex items-center gap-1.5 font-cond text-[11px] font-semibold tracking-[0.22em] text-oro-medio uppercase sm:text-[12px]">
        <span aria-hidden className="size-1.5 latido rounded-full bg-oro" />
        Muy pronto
      </p>
    </article>
  );
}

// Cinta con los nombres que corre bajo la cuadrícula.
function Cinta() {
  const nombres = ARTISTAS.map((a) => a.nombre ?? "???");
  const vuelta = [...nombres, ...nombres];
  return (
    <div
      aria-hidden
      className="relative w-full overflow-hidden border-y border-oro-profundo/60 bg-oro-tinte [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)] py-3"
    >
      <div className="flex w-max cinta">
        {[0, 1].map((copia) => (
          <div key={copia} className="flex shrink-0 items-center">
            {vuelta.map((n, i) => (
              <span
                key={`${copia}-${i}`}
                className="flex items-center gap-6 pr-6 font-display text-[22px] leading-none tracking-[0.06em] whitespace-nowrap sm:text-[26px]"
              >
                <span className={n === "???" ? "text-crema/35" : "texto-oro"}>
                  {n}
                </span>
                <span className="text-[14px] text-oro-profundo">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

const INCOGNITOS = ARTISTAS.flatMap((a, i) => (a.nombre ? [] : [i]));

// En el celular los incógnitos van de a 2: si son impares, el último ocupa
// la fila entera.
const sueltoEnCelular = (i: number) =>
  INCOGNITOS.length % 2 === 1 && i === INCOGNITOS.at(-1);

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[81px] lg:pt-[89px]">
        <Seccion
          id="artistas"
          antetitulo="La música de la noche"
          titulo="Artistas"
          bajada={`${EVENTO.nombre} no es solo boxeo: estos artistas ponen la música en el ${EVENTO.sede}. Pronto revelamos a los que faltan.`}
          ancho="amplio"
        >
          <div className="relative flex w-full flex-col gap-10">
            <Focos />
            {/* 6 columnas: confirmados de a 2 por fila, incógnitos de a 3
                (de a 2 en el celular; si sobra uno, va a lo ancho). */}
            <div className="grid w-full grid-cols-6 gap-4 sm:gap-5">
              {ARTISTAS.map((a, i) =>
                a.nombre ? (
                  <TarjetaArtista
                    key={a.nombre}
                    artista={{ ...a, nombre: a.nombre, slug: a.slug ?? "" }}
                    i={i}
                  />
                ) : (
                  <Revelar
                    key={`incognito-${i}`}
                    retardo={i * 90}
                    className={
                      sueltoEnCelular(i)
                        ? "col-span-6 sm:col-span-2"
                        : "col-span-3 sm:col-span-2"
                    }
                  >
                    <TarjetaIncognito i={i} ancha={sueltoEnCelular(i)} />
                  </Revelar>
                ),
              )}
            </div>
            <Cinta />
          </div>
        </Seccion>
      </main>
      <SiteFooter />
    </>
  );
}
