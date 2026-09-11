"use client";

import Image from "next/image";
import Link from "next/link";
import {
  COMBATES,
  PRONOSTICOS_ACTIVOS,
  type Combate,
  type Peleador,
} from "@/lib/evento";
import { estaAbierto, useVotacion, type Lado } from "@/lib/votacion";

/**
 * Puesto del peleador en el apoyo de toda la cartelera.
 *
 * Solo entran los combates que ya tienen al menos un voto: uno sin votos no
 * tiene porcentaje, y meterlo como 50/50 falsearía el orden.
 */
function puestoEnElCartel(
  conteos: Record<string, { pctA: number | null }>,
  slug: string,
) {
  const lista: { slug: string; pct: number }[] = [];
  for (const c of COMBATES) {
    const k = conteos[c.n];
    if (!k || k.pctA === null) continue;
    lista.push({ slug: c.a.slug, pct: k.pctA });
    lista.push({ slug: c.b.slug, pct: 100 - k.pctA });
  }
  lista.sort((x, y) => y.pct - x.pct);
  const i = lista.findIndex((x) => x.slug === slug);
  return i === -1 ? null : { puesto: i + 1, total: lista.length };
}

function IconoVoto() {
  return (
    <svg
      aria-hidden
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M3 17V9l9-6 9 6v8l-9 4-9-4Z" />
    </svg>
  );
}

function LadoApoyo({
  p,
  pct,
  destacado,
  ganador,
  derecha,
}: {
  p: Peleador;
  pct: number | null;
  destacado: boolean;
  ganador: boolean;
  derecha?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-3 ${derecha ? "flex-row-reverse text-right" : ""}`}
    >
      <span
        className={`relative block aspect-[250/470] w-11 shrink-0 overflow-hidden rounded-sm border sm:w-14 ${
          destacado ? "border-oro" : "border-linea opacity-70"
        }`}
      >
        <Image src={p.foto} alt="" fill sizes="56px" className="object-cover" />
      </span>
      <span className="min-w-0">
        <span
          className={`flex items-center gap-2 ${derecha ? "flex-row-reverse" : ""}`}
        >
          <span
            className={`truncate font-display text-[14px] uppercase leading-tight sm:text-[17px] ${
              destacado ? "text-oro-claro" : "text-crema"
            }`}
          >
            {p.nombre}
          </span>
          {ganador && (
            <span className="shrink-0 rounded-full bg-oro px-2 py-[2px] font-cond text-[10px] font-bold uppercase tracking-[0.12em] text-noche">
              Ganó
            </span>
          )}
        </span>
        <span
          className={`mt-1 block font-display text-[26px] leading-none tabular-nums sm:text-[34px] ${
            destacado ? "text-oro" : "text-tenue"
          }`}
        >
          {pct === null ? "—" : `${pct}%`}
        </span>
      </span>
    </div>
  );
}

export function ApoyoPeleador({
  combate,
  peleador,
  rival,
  lado,
}: {
  combate: Combate;
  peleador: Peleador;
  rival: Peleador;
  lado: Lado;
}) {
  const { conteos, votos, cargando, enviando, error, votar } =
    useVotacion(PRONOSTICOS_ACTIVOS);
  const conteo = conteos[combate.n];

  // Los conteos guardan siempre el porcentaje del lado A; el del lado B es el
  // complemento, así los dos suman 100 exacto aunque el redondeo no cuadre.
  const pctPropio =
    !conteo || conteo.pctA === null
      ? null
      : lado === "a"
        ? conteo.pctA
        : 100 - conteo.pctA;
  const pctRival = pctPropio === null ? null : 100 - pctPropio;
  const totalVotos = conteo ? conteo.votosA + conteo.votosB : 0;
  const ganador = conteo?.ganador ?? null;
  const rank = conteo ? puestoEnElCartel(conteos, peleador.slug) : null;

  const ladoRival: Lado = lado === "a" ? "b" : "a";
  const miVoto = votos[combate.n];
  // Sin conteo todavía no sabemos si el combate sigue abierto, así que no se
  // puede dejar votar a ciegas.
  const sePuedeVotar =
    PRONOSTICOS_ACTIVOS && !!conteo && !ganador && estaAbierto(conteo);
  const enviandoEste = enviando === combate.n;

  const OPCIONES: { l: Lado; p: Peleador }[] = [
    { l: lado, p: peleador },
    { l: ladoRival, p: rival },
  ];

  return (
    <div className="flex w-full flex-col gap-5 rounded-sm border border-oro-profundo bg-oro-tinte px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-profundo">
          {ganador ? "Resultado final" : "Pronóstico de la comunidad"}
        </p>
        <p className="font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-tenue">
          {cargando
            ? "Cargando"
            : pctPropio === null
              ? "Sin votos todavía"
              : `${totalVotos} ${totalVotos === 1 ? "voto" : "votos"}`}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 sm:gap-6">
          <LadoApoyo
            p={peleador}
            pct={pctPropio}
            destacado={ganador ? ganador === lado : (pctPropio ?? 0) >= 50}
            ganador={ganador === lado}
          />
          <span className="relative grid size-9 shrink-0 place-items-center sm:size-11">
            <span
              aria-hidden
              className="absolute inset-0 rotate-45 rounded-[3px] border border-oro-profundo bg-noche/70"
            />
            <span className="relative font-display text-[11px] text-oro sm:text-[13px]">
              VS
            </span>
          </span>
          <LadoApoyo
            p={rival}
            pct={pctRival}
            destacado={ganador ? ganador !== lado : (pctRival ?? 0) > 50}
            ganador={ganador !== null && ganador !== lado}
            derecha
          />
        </div>

        <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#2a2a31]">
          <span
            style={{ width: `${pctPropio ?? 50}%` }}
            className={`block transition-[width] duration-500 ${
              pctPropio === null
                ? "bg-[#3a3a44]"
                : "bg-gradient-to-r from-oro-profundo to-oro-claro"
            }`}
          />
        </div>
      </div>

      {/* Votación en la propia ficha. `votar` ya resuelve el caso sin sesión:
          guarda la intención, manda a Google y al volver la emite sola. */}
      {sePuedeVotar && (
        <div className="flex flex-col gap-3 border-t border-oro-profundo/50 pt-5">
          <p className="text-center font-cond text-[12px] font-bold uppercase tracking-[0.2em] text-oro-claro">
            {miVoto ? "Tu pronóstico" : "¿Quién gana este combate?"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {OPCIONES.map(({ l, p }) => {
              const elegido = miVoto === l;
              return (
                <button
                  key={l}
                  type="button"
                  disabled={enviandoEste}
                  onClick={() => votar(combate.n, l)}
                  aria-pressed={elegido}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-sm px-4 py-3.5 text-center font-cond text-[12px] font-bold uppercase leading-tight tracking-[0.1em] transition-colors disabled:cursor-wait disabled:opacity-50 ${
                    elegido
                      ? "bg-oro text-noche hover:bg-oro-claro"
                      : "border border-oro-profundo text-oro hover:border-oro hover:bg-oro-tinte"
                  }`}
                >
                  <IconoVoto />
                  {elegido ? `Votaste por ${p.nombre}` : `Votar por ${p.nombre}`}
                </button>
              );
            })}
          </div>
          <p className="text-center font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-oro-profundo">
            {miVoto
              ? "Puedes cambiarlo hasta que cierre la votación"
              : "Un voto por combate · Nadie ve a quién votaste"}
          </p>
        </div>
      )}

      {error && (
        <p
          role="status"
          className="rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-4 py-2.5 text-center font-cond text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ffb4b4]"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 border-t border-oro-profundo/50 pt-4">
        <span className="font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro-profundo">
          {rank ? `${rank.puesto}.º más apoyado de ${rank.total}` : ""}
        </span>
        {/* Salida a la votación completa de la home: desde aquí solo se ve
            este combate, y allí están los ocho. */}
        <Link
          href="/#pronosticos"
          className="flex items-center gap-2 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:text-oro-claro"
        >
          Ver los 8 combates
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
