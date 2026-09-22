"use client";

import { useId, useState, type ReactNode } from "react";
import { IconoMas } from "@/assets/icons";

export type ItemAcordeon = {
  pregunta: string;
  respuesta: ReactNode;
};

export function Acordeon({ items }: { items: readonly ItemAcordeon[] }) {
  const [abierto, setAbierto] = useState<number | null>(null);
  const base = useId();

  return (
    <ul className="w-full border-t border-linea">
      {items.map((item, i) => {
        const activo = abierto === i;
        const idBoton = `${base}-boton-${i}`;
        const idPanel = `${base}-panel-${i}`;

        return (
          <li
            key={item.pregunta}
            className={`border-b transition-colors duration-500 ${
              activo ? "border-oro bg-oro-tinte/70" : "border-linea"
            }`}
          >
            <h3>
              <button
                type="button"
                id={idBoton}
                aria-expanded={activo}
                aria-controls={idPanel}
                onClick={() => setAbierto(activo ? null : i)}
                className="group flex w-full cursor-pointer items-center justify-between gap-5 px-4 py-5 text-left sm:px-6 sm:py-6"
              >
                <span
                  className={`font-display text-[17px] leading-snug tracking-wide uppercase transition-colors duration-300 sm:text-[21px] ${
                    activo
                      ? "text-oro"
                      : "text-crema group-hover:text-oro-claro"
                  }`}
                >
                  {item.pregunta}
                </span>
                <span
                  aria-hidden
                  className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] sm:size-10 ${
                    activo
                      ? "rotate-45 border-oro bg-oro text-noche"
                      : "border-oro-profundo text-oro group-hover:border-oro group-hover:bg-oro-tinte"
                  }`}
                >
                  <IconoMas size={16} strokeWidth={1.8} />
                </span>
              </button>
            </h3>
            <div
              id={idPanel}
              role="region"
              aria-labelledby={idBoton}
              inert={!activo}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                activo
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="max-w-[46rem] px-4 pb-6 text-[16px] leading-relaxed text-tenue sm:px-6 sm:text-[17px] [&_a]:font-semibold [&_a]:text-oro [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-oro-claro [&_strong]:font-semibold [&_strong]:text-crema">
                  {item.respuesta}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
