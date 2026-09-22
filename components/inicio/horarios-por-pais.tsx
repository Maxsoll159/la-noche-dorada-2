"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import type { GrupoHorario } from "@/lib/evento/horarios";

const sinSuscripcion = () => () => {};

function useOffsetLocal(inicioISO: string) {
  return useSyncExternalStore(
    sinSuscripcion,
    () => -new Date(inicioISO).getTimezoneOffset(),
    () => null,
  );
}

function Etiqueta({ children, viva }: { children: string; viva?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-1 font-cond text-[10px] leading-none font-bold tracking-[0.18em] uppercase ${
        viva ? "border-oro bg-oro text-noche" : "border-oro-profundo text-oro"
      }`}
    >
      {children}
    </span>
  );
}

function Fila({ grupo, esTuHora }: { grupo: GrupoHorario; esTuHora: boolean }) {
  const resaltada = grupo.sede || esTuHora;
  return (
    <li
      className={`relative isolate grid grid-cols-[88px_18px_minmax(0,1fr)] items-stretch gap-x-3 overflow-hidden rounded-sm border px-3 py-3.5 transition-colors sm:grid-cols-[120px_22px_minmax(0,1fr)_auto] sm:gap-x-4 sm:px-5 sm:py-4 ${
        grupo.sede
          ? "resplandor border-oro bg-oro-tinte sm:py-6"
          : esTuHora
            ? "border-oro bg-oro-tinte shadow-[0_0_24px_-10px_rgba(212,175,55,0.6)]"
            : "border-linea bg-carbon hover:border-oro-profundo"
      }`}
    >
      {grupo.sede && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-[30%] destello-fila bg-gradient-to-r from-transparent via-oro-claro/25 to-transparent"
        />
      )}
      <div className="flex flex-col items-center justify-center text-center">
        <p className="flex items-baseline gap-1 leading-none">
          <span
            className={`font-display tabular-nums ${
              grupo.sede
                ? "text-[34px] text-oro-claro sm:text-[46px]"
                : resaltada
                  ? "text-[28px] text-oro-claro sm:text-[36px]"
                  : "text-[28px] text-crema sm:text-[36px]"
            }`}
          >
            {grupo.hora}
          </span>
          <span className="font-cond text-[12px] font-bold text-tenue uppercase">
            {grupo.meridiano}
          </span>
        </p>
        <p className="mt-1 font-cond text-[10px] font-bold tracking-[0.14em] text-tenue uppercase">
          {grupo.gmt}
        </p>
        {grupo.nota && (
          <p className="mt-1 font-cond text-[10px] font-bold tracking-[0.12em] text-oro-medio uppercase">
            {grupo.nota}
          </p>
        )}
      </div>

      <div aria-hidden className="relative flex items-center justify-center">
        <span className="absolute inset-y-0 w-px bg-linea" />
        <span
          className={`relative size-2.5 rounded-full ${
            resaltada
              ? "bg-oro shadow-[0_0_12px_rgba(212,175,55,0.9)]"
              : "bg-oro-profundo"
          }`}
        />
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 self-center">
        {grupo.paises.map((p) => (
          <li
            key={p.nombre}
            className="flex items-center gap-2 font-cond text-[12px] font-bold tracking-[0.1em] text-crema uppercase sm:text-[13px]"
          >
            <Image
              src={`/banderas/${p.bandera}.webp`}
              alt=""
              width={48}
              height={32}
              sizes="21px"
              className="h-[14px] w-[21px] shrink-0 rounded-[2px] object-cover ring-1 ring-black/40"
            />
            {p.nombre}
          </li>
        ))}
      </ul>

      {resaltada && (
        <div className="col-span-3 mt-3 flex gap-2 sm:col-span-1 sm:mt-0 sm:self-center">
          {grupo.sede && <Etiqueta>Sede · Hora oficial</Etiqueta>}
          {esTuHora && <Etiqueta viva>Tu hora</Etiqueta>}
        </div>
      )}
    </li>
  );
}

export function HorariosPorPais({
  grupos,
  inicioISO,
}: {
  grupos: GrupoHorario[];
  inicioISO: string;
}) {
  const offsetLocal = useOffsetLocal(inicioISO);

  return (
    <ol className="flex flex-col gap-3">
      {grupos.map((g) => (
        <Fila
          key={g.offsetMin}
          grupo={g}
          esTuHora={g.offsetMin === offsetLocal}
        />
      ))}
    </ol>
  );
}
