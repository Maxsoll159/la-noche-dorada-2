import Image from "next/image";
import type { CSSProperties } from "react";
import { IconoExterno } from "@/assets/icons";
import { PATROCINADORES } from "@/lib/evento";
import { Seccion } from "@/components/ui/seccion";
import {
  BarridoLuz,
  EsquinasDoradas,
  REBOTE,
  ResplandorDorado,
} from "./efectos-marca";
import { Sponsors } from "./sponsors";

const dominio = (url: string) => new URL(url).hostname.replace(/^www\./, "");

type Patrocinio = (typeof PATROCINADORES)[number];

function TarjetaPatrocinador({ p }: { p: Patrocinio }) {
  return (
    <a
      href={p.url}
      target="_blank"
      rel="noreferrer sponsored"
      aria-label={`Ir al sitio de ${p.nombre} (se abre en otra pestaña)`}
      className={`group relative isolate flex w-full flex-col overflow-hidden rounded-sm border border-oro-profundo/70 bg-carbon transition duration-500 hover:-translate-y-1.5 hover:border-oro hover:shadow-[0_26px_50px_-20px_rgba(212,175,55,0.5)] ${REBOTE}`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 z-10 h-[2px] origin-center scale-x-0 bg-gradient-to-r from-transparent via-oro-claro to-transparent transition-transform duration-500 group-hover:scale-x-100"
      />
      <span className="relative flex h-16 items-center justify-center bg-[radial-gradient(70%_90%_at_50%_45%,rgba(212,175,55,0.12)_0%,rgba(212,175,55,0)_100%)] px-2.5 sm:h-40 sm:px-8">
        <ResplandorDorado />
        <BarridoLuz />
        <span className="hidden sm:block">
          <EsquinasDoradas variante="dentro" />
        </span>
        <Image
          src={p.logo}
          alt=""
          width={p.w}
          height={p.h}
          sizes={`${p.ancho}px`}
          style={{ "--ancho": `${p.ancho}px` } as CSSProperties}
          className={`relative h-auto w-[calc(var(--ancho)*0.42)] max-w-full transition duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.35)] sm:w-(--ancho) ${REBOTE}`}
        />
      </span>
      <span className="flex flex-1 items-center justify-center gap-1.5 border-t border-linea bg-[#08080b] px-2 py-2 transition-colors duration-500 group-hover:border-oro-profundo group-hover:bg-oro-tinte sm:justify-between sm:gap-3 sm:px-5 sm:py-3.5">
        <span className="min-w-0">
          <span className="block truncate font-display text-[12px] leading-tight text-crema uppercase transition-colors duration-500 group-hover:text-oro-claro sm:text-[16px]">
            {p.nombre}
          </span>
          <span className="hidden truncate font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase sm:block">
            {dominio(p.url)}
          </span>
        </span>
        <IconoExterno
          size={11}
          strokeWidth={2.6}
          className="shrink-0 text-oro sm:hidden"
        />
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-oro-profundo px-3 py-1.5 font-cond text-[11px] font-bold tracking-[0.16em] text-oro uppercase transition-colors duration-500 group-hover:border-oro group-hover:bg-oro group-hover:text-noche sm:flex">
          Visitar
          <IconoExterno
            size={13}
            strokeWidth={2.4}
            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </span>
    </a>
  );
}

export function Patrocinador() {
  return (
    <Seccion
      id="patrocinadores"
      antetitulo="Con el respaldo de"
      titulo="Patrocinadores"
    >
      <div className="flex w-full flex-col items-center gap-8 sm:gap-9">
        <ul className="grid w-full grid-cols-3 gap-2 sm:gap-4 lg:gap-5">
          {PATROCINADORES.map((p) => (
            <li key={p.nombre} className="flex">
              <TarjetaPatrocinador p={p} />
            </li>
          ))}
        </ul>

        <Sponsors />
      </div>
    </Seccion>
  );
}
