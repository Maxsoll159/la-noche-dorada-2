import Image from "next/image";
import type { CSSProperties } from "react";
import { IconoExterno } from "@/assets/icons";
import { PATROCINADORES } from "@/lib/evento";
import { Seccion } from "@/components/ui/seccion";
import { BarridoLuz, REBOTE, ResplandorDorado } from "./efectos-marca";
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
      className={`group relative isolate flex w-full flex-row overflow-hidden rounded-md border border-oro-profundo/50 bg-[linear-gradient(180deg,#15120b_0%,#0e0e12_70%)] shadow-[0_20px_44px_-30px_rgba(0,0,0,0.9)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-24px_rgba(212,175,55,0.5)] sm:flex-col ${REBOTE}`}
    >
      <span
        aria-hidden
        className="marco-vivo z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <span className="marco-vivo-haz" />
      </span>

      <span className="relative flex h-24 w-[46%] shrink-0 items-center justify-center overflow-hidden px-3 sm:h-48 sm:w-auto sm:px-8">
        <span
          aria-hidden
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,rgba(212,175,55,0.035)_0_1px,transparent_1px_11px)]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(55%_80%_at_50%_0%,rgba(247,227,161,0.16)_0%,rgba(247,227,161,0)_100%)] transition-opacity duration-500 group-hover:opacity-60"
        />
        <span
          aria-hidden
          className="absolute bottom-3 left-1/2 h-4 w-3/5 -translate-x-1/2 rounded-[50%] bg-oro/15 blur-lg transition-all duration-500 group-hover:w-4/5 group-hover:bg-oro/30 sm:bottom-6 sm:h-6"
        />
        <ResplandorDorado />
        <BarridoLuz />
        <Image
          src={p.logo}
          alt=""
          width={p.w}
          height={p.h}
          sizes={`${p.ancho}px`}
          style={{ "--ancho": `${p.ancho}px` } as CSSProperties}
          className={`relative h-auto w-[calc(var(--ancho)*0.58)] max-w-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] transition duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_24px_rgba(212,175,55,0.4)] sm:w-[calc(var(--ancho)*0.78)] lg:w-(--ancho) ${REBOTE}`}
        />
      </span>

      <span className="relative flex flex-1 items-center justify-between gap-3 bg-noche/80 px-4 py-3 transition-colors duration-500 group-hover:bg-oro-tinte sm:px-5 sm:py-4">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-oro-profundo to-transparent transition-colors duration-500 group-hover:via-oro sm:inset-x-0 sm:top-0 sm:bottom-auto sm:h-px sm:w-auto sm:bg-gradient-to-r"
        />
        <span className="min-w-0">
          <span className="block truncate font-display text-[17px] leading-tight text-crema uppercase transition-colors duration-500 group-hover:text-oro-claro sm:text-[18px]">
            {p.nombre}
          </span>
          <span className="block truncate font-cond text-[11px] font-semibold tracking-[0.16em] text-tenue uppercase">
            {dominio(p.url)}
          </span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-oro/70 bg-noche/60 text-oro transition-colors duration-500 group-hover:border-oro group-hover:bg-oro group-hover:text-noche lg:hidden">
          <IconoExterno size={14} strokeWidth={2.4} />
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-oro/70 bg-noche/60 px-3.5 py-1.5 font-cond text-[11px] font-bold tracking-[0.16em] text-oro uppercase transition-colors duration-500 group-hover:border-oro group-hover:bg-oro group-hover:text-noche lg:flex">
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

export function Patrocinador({
  fondo = "noche",
}: {
  fondo?: "noche" | "superficie";
}) {
  return (
    <Seccion
      id="patrocinadores"
      fondo={fondo}
      antetitulo="Con el respaldo de"
      titulo="Patrocinadores"
      bajada="Las marcas que hacen posible la segunda edición de la velada."
    >
      <div className="flex w-full flex-col items-center gap-10 sm:gap-12">
        <ul className="grid w-full gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5">
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
