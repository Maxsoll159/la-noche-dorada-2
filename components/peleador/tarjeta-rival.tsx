import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { IconoFlechaAbajo } from "@/assets/icons";
import { BANDERAS, type Peleador } from "@/lib/evento";
import { Bandera } from "@/components/ui/bandera";

export function TarjetaRival({
  rival,
  style,
}: {
  rival: Peleador;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className="entrada-resplandor overflow-hidden rounded-sm border border-oro-profundo bg-carbon"
    >
      <Link
        href={`/peleadores/${rival.slug}`}
        className="group relative flex items-center gap-4 overflow-hidden px-4 py-4 transition-colors hover:bg-oro-tinte sm:px-5"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 destello bg-gradient-to-r from-transparent via-oro/15 to-transparent"
        />
        <span className="relative block h-[88px] w-[70px] shrink-0 overflow-hidden rounded-sm border border-linea bg-[#0e0e12] transition-colors group-hover:border-oro">
          <Image
            src={rival.cuerpo ?? rival.foto}
            alt=""
            fill
            sizes="70px"
            className={`object-cover object-top ${
              rival.cuerpo ? "brightness-125 contrast-[1.06]" : ""
            }`}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.18em] text-oro-medio uppercase">
            <span className="relative grid size-6 shrink-0 place-items-center">
              <span
                aria-hidden
                className="absolute inset-0 rotate-45 rounded-[2px] border border-oro-profundo bg-noche/80"
              />
              <span className="relative font-display text-[10px] text-oro">
                VS
              </span>
            </span>
            Su rival
          </span>
          <span className="mt-1 block truncate font-display text-[22px] leading-[1.2] text-crema uppercase transition-colors group-hover:text-oro sm:text-[26px]">
            {rival.nombre}
          </span>
          <span className="mt-1.5 flex items-center gap-2 font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
            <Bandera pais={rival.pais} className="h-2.5 w-[15px]" />
            {BANDERAS[rival.pais].nombre}
            <span className="text-oro-medio">· Ver su ficha</span>
          </span>
        </span>
      </Link>

      <div className="grid grid-cols-2 border-t border-linea">
        <a
          href="#pronostico"
          className="flex items-center justify-center gap-2 bg-oro px-3 py-3 font-cond text-[12px] font-bold tracking-[0.14em] text-noche uppercase transition-colors hover:bg-oro-claro"
        >
          Votar pronóstico
        </a>
        <a
          href="#combate"
          className="group flex items-center justify-center gap-2 border-l border-linea px-3 py-3 font-cond text-[12px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:bg-oro-tinte"
        >
          Ver el combate
          <IconoFlechaAbajo
            size={14}
            strokeWidth={2.4}
            className="transition-transform group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </div>
  );
}
