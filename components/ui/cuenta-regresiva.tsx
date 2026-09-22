"use client";

import { useSyncExternalStore } from "react";

const UNIDADES = [
  ["dias", "Días"],
  ["horas", "Horas"],
  ["minutos", "Minutos"],
  ["segundos", "Segundos"],
] as const;

type Restante = Record<(typeof UNIDADES)[number][0], number>;

function calcular(objetivo: number, ahora: number): Restante {
  const falta = Math.max(0, objetivo - ahora);
  const seg = Math.floor(falta / 1000);
  return {
    dias: Math.floor(seg / 86400),
    horas: Math.floor((seg % 86400) / 3600),
    minutos: Math.floor((seg % 3600) / 60),
    segundos: seg % 60,
  };
}

function suscribirAlReloj(avisar: () => void) {
  const id = setInterval(avisar, 1000);
  return () => clearInterval(id);
}

const segundoActual = () => Math.floor(Date.now() / 1000) * 1000;
const sinReloj = () => null;

export function CuentaRegresiva({ inicioISO }: { inicioISO: string }) {
  const objetivo = new Date(inicioISO).getTime();
  const ahora = useSyncExternalStore(suscribirAlReloj, segundoActual, sinReloj);
  const restante = ahora === null ? null : calcular(objetivo, ahora);

  return (
    <ul className="flex w-full flex-nowrap items-center justify-center gap-2 sm:gap-3.5">
      {UNIDADES.map(([clave, etiqueta]) => (
        <li
          key={clave}
          className="flex w-[74px] flex-col items-center gap-0.5 rounded-sm border border-linea border-t-oro/60 bg-noche/55 py-2.5 backdrop-blur-sm sm:w-[104px] sm:gap-1 sm:py-4 lg:w-[120px]"
        >
          <span className="block overflow-hidden">
            <span
              key={restante ? restante[clave] : "--"}
              className="block tic font-display text-[26px] leading-none text-oro-claro tabular-nums sm:text-[34px] lg:text-[38px]"
            >
              {restante ? String(restante[clave]).padStart(2, "0") : "--"}
            </span>
          </span>
          <span className="font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase sm:text-[11px] sm:tracking-[0.2em]">
            {etiqueta}
          </span>
        </li>
      ))}
    </ul>
  );
}
