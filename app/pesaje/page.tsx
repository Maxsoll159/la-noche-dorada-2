import type { Metadata } from "next";
import { IconoKick } from "@/assets/icons";
import { COMBATES, EVENTO, PESAJE, PESOS_OFICIALES } from "@/lib/evento";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PuntoVivo, TarjetaPesaje } from "@/components/pesaje/tarjeta-pesaje";
import { Estrellas } from "@/components/ui/estrellas";
import { FileteOro } from "@/components/ui/filete-oro";

// En el orden de la noche: el pesaje arranca por el combate 01.
const CARTELERA = [...COMBATES].sort((x, y) => x.n.localeCompare(y.n));
const PESADOS = Object.keys(PESOS_OFICIALES).length;
const TOTAL = CARTELERA.length * 2;

const DESCRIPCION = `Pesaje oficial de ${EVENTO.nombre}, ${PESAJE.dia}: cuánto pesaban antes y cuánto marcó la balanza cada uno de los 16 peleadores.`;

export const metadata: Metadata = {
  title: "Pesaje oficial",
  description: DESCRIPCION,
  alternates: { canonical: "/pesaje" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: EVENTO.nombre,
    url: "/pesaje",
    title: `Pesaje oficial · ${EVENTO.nombre}`,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: `Pesaje oficial · ${EVENTO.nombre}`,
    description: DESCRIPCION,
  },
};

function Video() {
  if (PESAJE.youtube) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-oro-profundo bg-noche shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${PESAJE.youtube}?rel=0&modestbranding=1`}
          title={`Pesaje oficial de ${EVENTO.nombre}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }
  // Reproductor oficial de Kick con el canal en vivo.
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-oro-profundo bg-noche shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
        <iframe
          src={`https://player.kick.com${EVENTO.streamCanal}?autoplay=true&muted=true`}
          title={`Pesaje oficial de ${EVENTO.nombre} en vivo por Kick`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
      <a
        href={EVENTO.streamUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-2 self-center font-cond text-[12px] font-bold tracking-[0.16em] text-kick uppercase transition-colors hover:text-crema"
      >
        <IconoKick className="size-3.5" />
        Abrir en Kick · kick.com{EVENTO.streamCanal}
      </a>
    </div>
  );
}

export default function PaginaPesaje() {
  const progreso = Math.round((PESADOS / TOTAL) * 100);

  return (
    <>
      <SiteHeader />
      <main className="relative isolate overflow-hidden bg-noche">
        <Estrellas />
        <div className="mx-auto flex max-w-[78rem] flex-col gap-10 px-5 pt-32 pb-16 sm:px-6 sm:pt-36 lg:px-10 lg:pb-24">
          <header className="flex flex-col items-center gap-4 text-center">
            {PESAJE.enVivo ? (
              <span className="flex items-center gap-2 rounded-full bg-lado-a px-3.5 py-1.5 font-cond text-[12px] leading-none font-bold tracking-[0.2em] text-crema uppercase shadow-[0_0_24px_rgba(226,54,44,0.5)]">
                <PuntoVivo color="bg-crema" />
                En vivo
              </span>
            ) : (
              <span className="font-cond text-[13px] font-semibold tracking-[0.28em] text-oro uppercase">
                {PESAJE.dia}
              </span>
            )}
            <h1 className="texto-oro text-[52px] leading-none tracking-wide sm:text-[80px]">
              Pesaje oficial
            </h1>
            <p className="max-w-[42rem] text-[17px] leading-relaxed text-tenue">
              {PESAJE.enVivo
                ? "Los dieciséis suben a la balanza. Cuánto pesaban antes y cuánto marcan ahora: la página se actualiza con cada peleador."
                : "Lo que marcó la balanza un día antes de la velada, frente a lo que pesaban antes."}
            </p>
          </header>

          <Video />

          <div className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-4 font-cond font-bold uppercase">
              <span className="text-[13px] tracking-[0.2em] text-oro">
                Pesados
              </span>
              <span className="font-display text-[28px] leading-none text-crema tabular-nums">
                {PESADOS}
                <span className="text-[18px] text-humo"> / {TOTAL}</span>
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-superficie-2">
              <div
                className="h-full rounded-full bg-linear-to-r from-oro-profundo via-oro to-oro-claro"
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {CARTELERA.map((c) => (
              <TarjetaPesaje key={c.n} c={c} />
            ))}
          </div>

          {PESAJE.enVivo && (
            <p className="text-center font-cond text-[12px] font-semibold tracking-[0.16em] text-tenue uppercase">
              Recarga la página para ver los últimos pesos
            </p>
          )}
        </div>
        <FileteOro />
      </main>
      <SiteFooter />
    </>
  );
}
