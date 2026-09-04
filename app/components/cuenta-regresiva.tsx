"use client";

import { useEffect, useState } from "react";

const UNIDADES = [
  ["dias", "Días"],
  ["horas", "Horas"],
  ["minutos", "Minutos"],
  ["segundos", "Segundos"],
] as const;

type Restante = Record<(typeof UNIDADES)[number][0], number>;

function calcular(objetivo: number): Restante {
  const falta = Math.max(0, objetivo - Date.now());
  const seg = Math.floor(falta / 1000);
  return {
    dias: Math.floor(seg / 86400),
    horas: Math.floor((seg % 86400) / 3600),
    minutos: Math.floor((seg % 3600) / 60),
    segundos: seg % 60,
  };
}

export function CuentaRegresiva({ inicioISO }: { inicioISO: string }) {
  const objetivo = new Date(inicioISO).getTime();
  // Arranca en null para que el HTML del servidor y el del cliente coincidan:
  // si renderizáramos la cuenta en el servidor, el primer tick del cliente
  // provocaría un error de hidratación.
  const [restante, setRestante] = useState<Restante | null>(null);

  useEffect(() => {
    setRestante(calcular(objetivo));
    const id = setInterval(() => setRestante(calcular(objetivo)), 1000);
    return () => clearInterval(id);
  }, [objetivo]);

  return (
    // flex-nowrap + cajas angostas en móvil: las cuatro unidades tienen que
    // caber en una sola línea incluso en pantallas de 360 px.
    <ul className="flex w-full flex-nowrap items-center justify-center gap-2 sm:gap-3.5">
      {UNIDADES.map(([clave, etiqueta]) => (
        <li
          key={clave}
          className="flex w-[74px] flex-col items-center gap-0.5 rounded-sm border border-linea bg-superficie/80 py-2.5 sm:w-[104px] sm:gap-1 sm:py-4 lg:w-[120px]"
        >
          <span
            suppressHydrationWarning
            className="font-display text-[26px] leading-none text-oro-claro tabular-nums sm:text-[34px] lg:text-[38px]"
          >
            {restante ? String(restante[clave]).padStart(2, "0") : "--"}
          </span>
          <span className="font-cond text-[9px] font-semibold uppercase tracking-[0.12em] text-tenue sm:text-[11px] sm:tracking-[0.2em]">
            {etiqueta}
          </span>
        </li>
      ))}
    </ul>
  );
}
