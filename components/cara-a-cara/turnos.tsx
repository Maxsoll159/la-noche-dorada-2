import type { Peleador } from "@/lib/evento";
import { LADO, type Lado } from "./constantes";

export function Turnos({
  izq,
  der,
  turno,
  onTurno,
}: {
  izq: Peleador;
  der: Peleador;
  turno: Lado;
  onTurno: (lado: Lado) => void;
}) {
  return (
    <ul className="mx-auto flex w-full max-w-[880px] items-stretch gap-2 lg:max-w-[800px]">
      {(["a", "b"] as const).map((lado) => {
        const p = lado === "a" ? izq : der;
        const activo = turno === lado;
        return (
          <li key={lado} className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onTurno(lado)}
              aria-pressed={activo}
              aria-label={`Elegir al jugador ${LADO[lado].numero}. Ahora es ${p.nombre}`}
              className={`flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-sm border px-2.5 py-2 text-left transition duration-300 sm:px-3 ${
                lado === "b" ? "flex-row-reverse text-right" : ""
              } ${
                activo
                  ? `border-oro bg-oro-tinte ${LADO[lado].brillo}`
                  : "border-linea bg-[#0e0e12] hover:border-oro-profundo"
              }`}
            >
              <span
                aria-hidden
                className={`grid size-5 shrink-0 place-items-center font-display text-[12px] leading-none text-white ${LADO[lado].fondo}`}
              >
                {LADO[lado].numero}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-cond text-[12px] leading-tight font-bold tracking-[0.1em] text-crema uppercase sm:text-[13px]">
                  {p.nombre}
                </span>
                <span
                  className={`block font-cond text-[10px] font-bold tracking-[0.16em] uppercase ${
                    activo ? "text-oro" : "text-tenue"
                  }`}
                >
                  {activo ? "Eligiendo" : "Cambiar"}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
