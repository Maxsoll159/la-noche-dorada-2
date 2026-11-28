import Link from "next/link";
import { IconoFlechaDerecha } from "@/assets/icons";
import { COMBATES, PESAJE, PESOS_OFICIALES } from "@/lib/evento";
import { PuntoVivo, TarjetaPesaje } from "@/components/pesaje/tarjeta-pesaje";
import { Estrellas } from "@/components/ui/estrellas";
import { FileteOro } from "@/components/ui/filete-oro";

const CARTELERA = [...COMBATES].sort((x, y) => x.n.localeCompare(y.n));
const PESADOS = Object.keys(PESOS_OFICIALES).length;
const TOTAL = CARTELERA.length * 2;

// El último combate que pasó por la balanza: el del último peso agregado en
// PESOS_OFICIALES (el pesaje no siempre va en orden de cartelera).
const ULTIMO_SLUG = Object.keys(PESOS_OFICIALES).at(-1);
const ULTIMO = CARTELERA.find(
  (c) => c.a.slug === ULTIMO_SLUG || c.b.slug === ULTIMO_SLUG,
);

// Anuncio en la portada que lleva a /pesaje.
export function Pesaje() {
  return (
    <section
      id="pesaje"
      className="relative isolate scroll-mt-24 overflow-hidden bg-superficie"
    >
      <Estrellas />
      <FileteOro />
      <div className="mx-auto grid max-w-[78rem] items-center gap-8 px-6 py-12 sm:py-14 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:px-14">
        <div className="flex flex-col items-center gap-5 text-center lg:items-start lg:text-left">
          {PESAJE.enVivo ? (
            <span className="flex items-center gap-2 rounded-full bg-lado-a px-3.5 py-1.5 font-cond text-[12px] leading-none font-bold tracking-[0.2em] text-crema uppercase shadow-[0_0_24px_rgba(226,54,44,0.5)]">
              <PuntoVivo color="bg-crema" />
              En vivo ahora
            </span>
          ) : (
            <span className="font-cond text-[13px] font-semibold tracking-[0.28em] text-oro uppercase">
              {PESAJE.dia}
            </span>
          )}
          <h2 className="texto-oro text-[46px] leading-none tracking-wide sm:text-[60px]">
            Pesaje oficial
          </h2>
          <p className="max-w-[30rem] text-[17px] leading-relaxed text-tenue">
            Cuánto pesaban antes y cuánto marca la balanza.{" "}
            {PESAJE.enVivo
              ? "Lo actualizamos con cada peleador que sube."
              : "Los dieciséis, uno por uno."}
          </p>
          <p className="font-display text-[30px] leading-none text-crema tabular-nums">
            {PESADOS}
            <span className="text-[20px] text-humo"> / {TOTAL} pesados</span>
          </p>
          <Link
            href="/pesaje"
            className="flex min-h-11 items-center gap-2 rounded-sm bg-oro px-6 py-3 font-cond text-[13px] font-bold tracking-[0.16em] text-noche uppercase transition-colors hover:bg-oro-claro"
          >
            {PESAJE.enVivo ? "Ver el pesaje en vivo" : "Ver el pesaje"}
            <IconoFlechaDerecha size={14} strokeWidth={2.6} />
          </Link>
        </div>
        {ULTIMO && (
          <div className="flex flex-col gap-3">
            <p className="text-center font-cond text-[12px] font-bold tracking-[0.2em] text-oro-medio uppercase lg:text-left">
              Último en la balanza
            </p>
            <TarjetaPesaje c={ULTIMO} />
          </div>
        )}
      </div>
    </section>
  );
}
