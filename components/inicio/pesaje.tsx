import Image from "next/image";
import Link from "next/link";
import { IconoKick } from "@/assets/icons";
import {
  COMBATES,
  EVENTO,
  PESAJE,
  PESOS_OFICIALES,
  type Combate,
  type Peleador,
} from "@/lib/evento";
import { coma } from "@/lib/formato";
import { Bandera } from "@/components/ui/bandera";
import { Seccion } from "@/components/ui/seccion";

// En el orden de la noche: el pesaje arranca por el combate 01.
const CARTELERA = [...COMBATES].sort((x, y) => x.n.localeCompare(y.n));

const PESADOS = Object.keys(PESOS_OFICIALES).length;
const TOTAL = CARTELERA.length * 2;

function kg(n: number) {
  return Number.isInteger(n) ? String(n) : coma(n, 1);
}

function PuntoVivo() {
  return (
    <span aria-hidden className="relative flex size-2">
      <span className="absolute inset-0 animate-ping rounded-full bg-lado-a opacity-75" />
      <span className="relative size-2 rounded-full bg-lado-a" />
    </span>
  );
}

function Lado({ p, derecha }: { p: Peleador; derecha?: boolean }) {
  const pesaje = PESOS_OFICIALES[p.slug];
  const cambio =
    pesaje?.antes !== undefined
      ? Math.round((pesaje.ahora - pesaje.antes) * 10) / 10
      : null;

  return (
    <div
      className={`flex min-w-0 flex-col gap-3 ${derecha ? "items-end text-right" : "items-start"}`}
    >
      <Link
        href={`/peleadores/${p.slug}`}
        className={`flex min-w-0 items-center gap-2.5 text-crema transition-colors hover:text-oro ${derecha ? "flex-row-reverse" : ""}`}
      >
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-oro-profundo bg-noche sm:size-12">
          <Image
            src={p.foto}
            alt=""
            fill
            sizes="48px"
            className="object-cover"
          />
        </span>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="truncate font-display text-[17px] leading-none sm:text-[20px]">
            {p.nombre}
          </span>
          <Bandera
            pais={p.pais}
            className={`h-2.5 w-4 ${derecha ? "self-end" : ""}`}
          />
        </span>
      </Link>

      {pesaje ? (
        <div
          className={`flex flex-col gap-1.5 ${derecha ? "items-end" : "items-start"}`}
        >
          <p className="flex items-baseline gap-1 font-display leading-none text-oro-claro">
            <span className="text-[34px] tabular-nums sm:text-[40px]">
              {kg(pesaje.ahora)}
            </span>
            <span className="font-cond text-[13px] font-bold tracking-[0.1em] text-oro uppercase">
              kg
            </span>
          </p>
          {pesaje.antes !== undefined && (
            <p
              className={`flex flex-wrap items-center gap-x-2 gap-y-1 font-cond text-[12px] font-semibold tracking-[0.1em] text-tenue uppercase ${derecha ? "justify-end" : ""}`}
            >
              <span>
                Antes{" "}
                <span className="text-crema/70 line-through decoration-lado-a/70">
                  {kg(pesaje.antes)} kg
                </span>
              </span>
              {cambio !== null && cambio !== 0 && (
                <span
                  className={`rounded-sm px-1.5 py-0.5 leading-none ${
                    cambio < 0
                      ? "bg-kick/10 text-kick"
                      : "bg-oro-tinte text-oro"
                  }`}
                >
                  {cambio > 0 ? "+" : "−"}
                  {kg(Math.abs(cambio))} kg
                </span>
              )}
              {cambio === 0 && (
                <span className="rounded-sm bg-oro-tinte px-1.5 py-0.5 leading-none text-oro">
                  Igual
                </span>
              )}
            </p>
          )}
        </div>
      ) : (
        <div
          className={`flex flex-col gap-1.5 ${derecha ? "items-end" : "items-start"}`}
        >
          <p className="font-display text-[34px] leading-none text-humo sm:text-[40px]">
            —
          </p>
          <p className="font-cond text-[12px] font-semibold tracking-[0.14em] text-humo uppercase">
            Por pesar
          </p>
        </div>
      )}
    </div>
  );
}

function TarjetaPesaje({ c }: { c: Combate }) {
  const pesadosAqui = [c.a, c.b].filter((p) => PESOS_OFICIALES[p.slug]).length;
  const listo = pesadosAqui === 2;

  return (
    <article
      className={`flex flex-col gap-4 rounded-sm border p-4 sm:p-5 ${
        listo
          ? "border-oro-profundo bg-carbon"
          : pesadosAqui > 0
            ? "border-oro bg-oro-tinte"
            : "border-linea bg-carbon/60"
      }`}
    >
      <header className="flex items-center justify-between gap-3 font-cond text-[11px] font-bold tracking-[0.18em] uppercase">
        <span className="text-oro">
          Combate {c.n}
          {c.billing && <span className="text-oro-medio"> · {c.billing}</span>}
        </span>
        {listo ? (
          <span className="rounded-sm border border-oro-profundo px-2 py-1 leading-none text-oro-claro">
            Pesados
          </span>
        ) : pesadosAqui > 0 ? (
          <span className="flex items-center gap-1.5 rounded-sm bg-oro px-2 py-1 leading-none text-noche">
            <PuntoVivo />
            En la balanza
          </span>
        ) : (
          <span className="leading-none text-humo">Pendiente</span>
        )}
      </header>
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <Lado p={c.a} />
        <span
          aria-hidden
          className="mt-3.5 font-cond text-[11px] font-bold tracking-[0.2em] text-oro-medio"
        >
          VS
        </span>
        <Lado p={c.b} derecha />
      </div>
    </article>
  );
}

export function Pesaje() {
  return (
    <Seccion
      id="pesaje"
      fondo="superficie"
      ancho="amplio"
      antetitulo={PESAJE.enVivo ? "En vivo · Se actualiza" : PESAJE.dia}
      titulo="Pesaje oficial"
      bajada={
        PESAJE.enVivo
          ? "Los dieciséis pasan por la balanza. Mira cuánto pesaban antes y cuánto marcan ahora: actualizamos la web con cada peleador que se sube."
          : "Lo que marcó la balanza un día antes de la velada, frente a lo que pesaban antes."
      }
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3 font-cond text-[12px] font-bold tracking-[0.16em] uppercase">
          {PESAJE.enVivo && (
            <span className="flex items-center gap-2 rounded-full bg-lado-a px-3 py-1.5 leading-none text-crema">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-crema opacity-75" />
                <span className="relative size-2 rounded-full bg-crema" />
              </span>
              En vivo
            </span>
          )}
          <span className="rounded-full border border-oro-profundo px-3 py-1.5 leading-none text-oro">
            {PESADOS} de {TOTAL} pesados
          </span>
          {PESAJE.enVivo && (
            <a
              href={EVENTO.streamUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-kick/70 bg-kick/10 px-3 py-1.5 leading-none text-kick transition-colors hover:bg-kick hover:text-noche"
            >
              <IconoKick className="size-3" />
              Míralo en Kick
            </a>
          )}
        </div>

        <div className="grid w-full gap-4 md:grid-cols-2">
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
    </Seccion>
  );
}
