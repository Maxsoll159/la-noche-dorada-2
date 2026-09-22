import Image from "next/image";
import type { CSSProperties } from "react";
import type { Peleador } from "@/lib/evento";

export function RetratoPeleador({
  peleador,
  style,
}: {
  peleador: Peleador;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className="group relative w-full max-w-[380px] entrada self-center overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12] transition-colors duration-300 hover:border-oro lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-[430px] lg:max-w-none"
    >
      <div className="relative h-[380px] w-full sm:h-[490px] lg:h-[560px]">
        <Image
          src={peleador.cuerpo ?? peleador.foto}
          alt={peleador.nombre}
          fill
          preload
          sizes="(min-width: 1024px) 430px, 380px"
          className={`object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04] ${
            peleador.cuerpo
              ? "brightness-125 contrast-[1.06] saturate-105"
              : "brightness-110"
          }`}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.35)_0%,transparent_26%,transparent_62%,rgba(11,11,13,0.5)_84%,rgba(11,11,13,0.95)_100%)]"
        />
        <Escuadras />
      </div>

      <span aria-hidden className="marco-vivo">
        <span className="marco-vivo-haz" />
      </span>
      <span aria-hidden className="marco-vivo">
        <span className="marco-vivo-haz marco-vivo-opuesto" />
      </span>
    </div>
  );
}

function Escuadras() {
  const comun = "pointer-events-none absolute size-7 border-oro";
  return (
    <>
      <span
        aria-hidden
        className={`${comun} top-2.5 left-2.5 border-t-2 border-l-2`}
      />
      <span
        aria-hidden
        className={`${comun} top-2.5 right-2.5 border-t-2 border-r-2`}
      />
      <span
        aria-hidden
        className={`${comun} bottom-2.5 left-2.5 border-b-2 border-l-2`}
      />
      <span
        aria-hidden
        className={`${comun} right-2.5 bottom-2.5 border-r-2 border-b-2`}
      />
    </>
  );
}
