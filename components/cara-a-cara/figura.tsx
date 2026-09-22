"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconoFlechaDerecha } from "@/assets/icons";
import { BANDERAS, type Peleador } from "@/lib/evento";
import { Bandera } from "@/components/ui/bandera";
import { SIZES_FIGURA, type Lado } from "./constantes";

function Cargando() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3.5 pb-[26%] lg:pb-0"
    >
      <span className="absolute inset-0 latido bg-[radial-gradient(40%_30%_at_50%_50%,rgba(212,175,55,0.32)_0%,rgba(212,175,55,0)_70%)]" />
      <span className="relative size-12 girar rounded-full border-[3px] border-oro-profundo/35 border-t-oro drop-shadow-[0_0_14px_rgba(212,175,55,0.75)] sm:size-16 sm:border-4" />
      <span className="relative rounded-sm border border-oro-profundo bg-noche/85 px-3.5 py-1.5 font-cond text-[12px] font-bold tracking-[0.24em] text-oro uppercase backdrop-blur-sm sm:text-[13px]">
        Cargando
      </span>
    </span>
  );
}

function SiluetaViva({ peleador }: { peleador: Peleador }) {
  const [cargada, setCargada] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (img.current?.complete) setCargada(true);
  }, []);

  return (
    <>
      {!cargada && <Cargando />}
      <Image
        ref={img}
        src={peleador.cuerpo ?? peleador.foto}
        alt={peleador.nombre}
        fill
        sizes={SIZES_FIGURA}
        fetchPriority="high"
        onLoad={() => setCargada(true)}
        onError={() => setCargada(true)}
        className={`object-contain object-bottom transition-[transform,opacity] duration-500 group-hover:scale-[1.03] ${
          cargada ? "opacity-100" : "opacity-0"
        } ${
          peleador.cuerpo
            ? "brightness-125 contrast-[1.06] saturate-105"
            : "brightness-110"
        }`}
      />
    </>
  );
}

export function Barrido({ claro = false }: { claro?: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 brillo-boton bg-gradient-to-r from-transparent to-transparent ${
        claro ? "via-white/75" : "via-oro/40"
      }`}
    />
  );
}

export function FlechaFicha({ className = "" }: { className?: string }) {
  return (
    <IconoFlechaDerecha size={12} strokeWidth={2.6} className={className} />
  );
}

export function Figura({ peleador, lado }: { peleador: Peleador; lado: Lado }) {
  const izq = lado === "a";
  return (
    <Link
      href={`/peleadores/${peleador.slug}`}
      aria-label={`Ver la ficha de ${peleador.nombre}`}
      className={`group absolute top-[15%] bottom-0 z-10 block w-[58%] sm:w-[52%] lg:w-[44%] ${
        izq
          ? "-left-[10%] sm:-left-[6%] lg:left-[5%]"
          : "-right-[10%] sm:-right-[6%] lg:right-[5%]"
      }`}
    >
      <div className="absolute inset-0">
        <span key={peleador.slug} className="absolute inset-0 cambio">
          <SiluetaViva peleador={peleador} />
        </span>
      </div>
    </Link>
  );
}

export function Rotulo({ peleador, lado }: { peleador: Peleador; lado: Lado }) {
  const izq = lado === "a";
  return (
    <div
      className={`absolute top-3 z-20 max-w-[46%] sm:top-5 ${
        izq ? "left-[3%]" : "right-[3%]"
      }`}
    >
      <Link
        key={peleador.slug}
        href={`/peleadores/${peleador.slug}`}
        className={`group flex cambio-texto flex-col gap-1 sm:gap-1.5 ${
          izq ? "items-start text-left" : "items-end text-right"
        }`}
      >
        <p className="flex items-center gap-1.5 rounded-sm border border-oro-profundo bg-noche/80 px-2 py-1 font-cond text-[11px] font-bold tracking-[0.14em] text-oro uppercase sm:gap-2 sm:px-2.5 sm:text-[11px]">
          <Bandera
            pais={peleador.pais}
            className="h-2.5 w-[15px] sm:h-3 sm:w-[19px]"
          />
          {BANDERAS[peleador.pais].nombre}
        </p>
        <h3 className="texto-oro -skew-x-6 text-[20px] leading-[1.08] break-words drop-shadow-[0_8px_22px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-[1.02] sm:text-[30px] lg:text-[36px]">
          {peleador.nombre}
        </h3>
        <span className="relative hidden pulso-ficha items-center gap-2 overflow-hidden rounded-sm bg-oro px-4 py-2 font-cond text-[12px] font-bold tracking-[0.16em] text-noche uppercase transition-colors duration-300 group-hover:bg-oro-claro lg:flex">
          <Barrido claro />
          <span className="relative">Ver su ficha</span>
          <FlechaFicha className="relative transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}
