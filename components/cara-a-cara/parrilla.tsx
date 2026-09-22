import Image from "next/image";
import type { Peleador } from "@/lib/evento";
import { LADO, PARRILLA, precargarFigura, type Lado } from "./constantes";

export function Parrilla({
  izq,
  der,
  turno,
  onElegir,
  onAzar,
}: {
  izq: Peleador;
  der: Peleador;
  turno: Lado;
  onElegir: (slug: string) => void;
  onAzar: () => void;
}) {
  const ladoDe = (slug: string): Lado | null =>
    izq.slug === slug ? "a" : der.slug === slug ? "b" : null;

  return (
    <ul className="mx-auto grid max-w-[880px] grid-cols-8 gap-1.5 sm:grid-cols-9 sm:gap-2.5 lg:max-w-[800px] lg:gap-3">
      {PARRILLA.map((p) => {
        const lado = ladoDe(p.slug);
        const estilo = lado ? LADO[lado] : null;
        return (
          <li key={p.slug} className="min-w-0">
            <button
              type="button"
              onClick={() => onElegir(p.slug)}
              onPointerEnter={() => precargarFigura(p.cuerpo ?? p.foto)}
              onFocus={() => precargarFigura(p.cuerpo ?? p.foto)}
              aria-pressed={lado !== null}
              aria-label={`${p.nombre}: ponerlo de jugador ${LADO[turno].numero}`}
              title={p.nombre}
              className={`group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[3px] border bg-[#0e0e12] transition duration-300 outline-none ${
                estilo
                  ? `${estilo.borde} ${estilo.brillo} -translate-y-0.5`
                  : "border-linea opacity-65 hover:-translate-y-0.5 hover:border-oro-profundo hover:opacity-100"
              }`}
            >
              <Image
                src={p.foto}
                alt=""
                fill
                sizes="(min-width: 640px) 90px, 12vw"
                className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
              />
              {estilo && (
                <span
                  aria-hidden
                  className={`absolute inset-0 ${estilo.tinte}`}
                />
              )}
              <span className="absolute inset-x-0 bottom-0 hidden truncate bg-gradient-to-t from-noche/95 via-noche/70 to-transparent px-1 pt-4 pb-1 text-center font-cond text-[11px] leading-none font-bold tracking-[0.04em] text-crema uppercase sm:block">
                {p.nombre}
              </span>
              {estilo && (
                <span
                  className={`absolute top-0 left-0 grid size-4 place-items-center font-display text-[11px] leading-none text-white sm:size-5 sm:text-[12px] ${estilo.fondo}`}
                >
                  {estilo.numero}
                </span>
              )}
            </button>
          </li>
        );
      })}
      <li className="hidden sm:col-start-5 sm:row-span-2 sm:row-start-1 sm:block">
        <button
          type="button"
          onClick={onAzar}
          aria-label="Armar un combate al azar"
          className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[3px] border border-oro-profundo bg-[#0e0e12]/95 transition duration-300 outline-none hover:border-oro hover:bg-oro-tinte"
        >
          <span className="texto-oro font-display text-[44px] leading-none transition-transform duration-300 group-hover:scale-110 lg:text-[56px]">
            ?
          </span>
          <span className="font-cond text-[11px] font-bold tracking-[0.2em] text-oro-medio uppercase transition-colors group-hover:text-oro">
            Al azar
          </span>
        </button>
      </li>
    </ul>
  );
}
