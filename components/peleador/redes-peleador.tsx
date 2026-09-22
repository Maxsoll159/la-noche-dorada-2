import type { CSSProperties } from "react";
import { IconoRed } from "@/assets/icons";
import { REDES_ACTUALIZADAS, type Peleador } from "@/lib/evento";

export function RedesPeleador({
  peleador,
  style,
}: {
  peleador: Peleador;
  style?: CSSProperties;
}) {
  const redes = peleador.redes ?? [];
  if (redes.length === 0) return null;

  return (
    <div style={style} className="flex entrada flex-col items-center gap-3">
      <ul className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
        {redes.map((r) => (
          <li key={r.url}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 rounded-sm border border-linea bg-carbon px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-oro hover:bg-oro-tinte sm:w-[186px] sm:gap-2.5 sm:py-2.5"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-oro-profundo text-oro transition-colors duration-300 group-hover:border-oro">
                <IconoRed
                  plataforma={r.plataforma}
                  size={18}
                  className="shrink-0"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-cond text-[11px] font-bold tracking-[0.14em] whitespace-nowrap text-crema uppercase sm:text-[11px] sm:tracking-[0.18em] sm:text-oro-medio">
                  {r.plataforma}
                </span>
                <span className="hidden truncate font-cond text-[12px] font-semibold text-crema sm:block">
                  {r.usuario}
                </span>
              </span>
              {r.seguidores && (
                <span className="shrink-0 font-display text-[15px] leading-none text-oro">
                  {r.seguidores}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
      {redes.some((r) => r.seguidores) && (
        <p className="font-cond text-[11px] font-semibold tracking-[0.14em] text-oro-medio uppercase">
          Seguidores a {REDES_ACTUALIZADAS} · Varían a diario
        </p>
      )}
    </div>
  );
}
