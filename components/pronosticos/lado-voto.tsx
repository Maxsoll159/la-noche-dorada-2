import Image from "next/image";
import { IconoVoto } from "@/assets/icons";
import type { Combate } from "@/lib/evento";
import type { Lado } from "@/lib/votacion";

const NUMERO: Record<Lado, { n: number; fondo: string; tinte: string }> = {
  a: {
    n: 1,
    fondo: "bg-lado-a",
    tinte:
      "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(226,54,44,0.32)_0%,rgba(16,16,21,0)_75%)]",
  },
  b: {
    n: 2,
    fondo: "bg-lado-b",
    tinte:
      "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(47,123,230,0.32)_0%,rgba(16,16,21,0)_75%)]",
  },
};

export function LadoVoto({
  peleador,
  lado,
  posicion,
  pct,
  lidera,
  resultado,
  votado,
  otroVotado,
  puedeVotar,
  enviando,
  onVotar,
}: {
  peleador: Combate["a"];
  lado: Lado;
  posicion?: Lado;
  pct: number | null;
  lidera: boolean;
  resultado?: "gano" | "perdio";
  votado: boolean;
  otroVotado: boolean;
  puedeVotar: boolean;
  enviando: boolean;
  onVotar: () => void;
}) {
  const sitio = posicion ?? lado;
  const izquierda = sitio === "a";
  const destacado = resultado ? resultado === "gano" : lidera;
  const apagado = resultado === "perdio" || (otroVotado && puedeVotar);
  return (
    <button
      type="button"
      disabled={!puedeVotar || enviando}
      onClick={onVotar}
      aria-pressed={votado}
      aria-label={
        votado
          ? `Votaste por ${peleador.nombre}. Volver a tocar quita el voto`
          : `Votar por ${peleador.nombre}`
      }
      className={`group relative isolate block aspect-[4/5] w-full overflow-hidden rounded-sm bg-carbon transition duration-300 outline-none sm:aspect-square ${
        votado
          ? "shadow-[0_0_0_1px_rgba(212,175,55,0.5),0_0_32px_rgba(212,175,55,0.4)] ring-[3px] ring-oro ring-inset"
          : puedeVotar
            ? "cursor-pointer ring-1 ring-linea ring-inset hover:ring-oro-profundo"
            : "ring-1 ring-linea ring-inset"
      } ${apagado ? "opacity-45 grayscale-[0.6] hover:opacity-100 hover:grayscale-0" : ""} disabled:cursor-default`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 -z-10 ${
          votado
            ? "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(212,175,55,0.4)_0%,rgba(16,16,21,0)_75%)]"
            : NUMERO[sitio].tinte
        }`}
      />

      {votado && (
        <span className="absolute inset-x-0 top-0 z-10 flex items-center justify-center gap-1.5 bg-oro py-1 font-cond text-[11px] font-bold tracking-[0.18em] text-noche uppercase">
          <IconoVoto size={16} className="shrink-0" />
          Tu voto
        </span>
      )}

      <span className="absolute inset-x-0 top-[12%] bottom-0 sm:top-[9%]">
        <Image
          src={peleador.cuerpo ?? peleador.foto}
          alt=""
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"
          className={`object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04] ${
            peleador.cuerpo ? "brightness-125 contrast-[1.06] saturate-105" : ""
          } ${resultado === "perdio" ? "grayscale" : ""}`}
        />
      </span>

      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-noche via-noche/75 to-transparent"
      />

      <span
        aria-hidden
        className={`absolute grid size-5 place-items-center font-display text-[12px] leading-none text-white ${
          votado ? "top-6" : "top-0"
        } ${izquierda ? "left-0" : "right-0"} ${NUMERO[sitio].fondo}`}
      >
        {NUMERO[sitio].n}
      </span>

      <span
        className={`absolute font-display text-[28px] leading-none tabular-nums drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] sm:text-[38px] ${
          votado ? "top-8 sm:top-9" : "top-2 sm:top-3"
        } ${izquierda ? "right-3 sm:right-4" : "left-3 sm:left-4"} ${
          destacado ? "text-oro" : "text-tenue"
        }`}
      >
        {pct === null ? "—" : `${pct}%`}
      </span>

      <span
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-3 pb-3 sm:px-4 sm:pb-4 ${
          izquierda ? "items-start text-left" : "items-end text-right"
        }`}
      >
        <span
          className={`font-display text-[15px] leading-tight break-words uppercase sm:text-[19px] ${
            destacado || votado ? "text-oro-claro" : "text-crema"
          }`}
        >
          {peleador.nombre}
        </span>
        {resultado === "gano" ? (
          <span className="rounded-full bg-oro px-2.5 py-[3px] font-cond text-[11px] font-bold tracking-[0.16em] text-noche uppercase">
            Ganó
          </span>
        ) : votado ? (
          <span className="font-cond text-[11px] font-bold tracking-[0.14em] text-oro-claro uppercase">
            Tocar para quitar
          </span>
        ) : puedeVotar ? (
          <span className="flex items-center gap-1 rounded-sm border border-oro bg-noche/70 px-2.5 py-1 font-cond text-[11px] font-bold tracking-[0.16em] text-oro uppercase backdrop-blur-sm transition-colors group-hover:bg-oro group-hover:text-noche">
            <IconoVoto size={16} className="shrink-0" />
            {otroVotado ? "Cambiar" : "Votar"}
          </span>
        ) : null}
      </span>
    </button>
  );
}
