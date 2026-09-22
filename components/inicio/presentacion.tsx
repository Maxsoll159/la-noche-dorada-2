"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconoCerrar, IconoPlay } from "@/assets/icons";
import { PRESENTACION } from "@/lib/evento";

const { videoId, titulo, canal, inicio } = PRESENTACION;
const EN_YOUTUBE = `https://www.youtube.com/watch?v=${videoId}&t=${inicio}s`;
const EMBED =
  `https://www.youtube-nocookie.com/embed/${videoId}` +
  `?autoplay=1&start=${inicio}&rel=0&modestbranding=1`;

function VisorVideo({ onCerrar }: { onCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!el.open) el.showModal();
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="titulo-presentacion"
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[min(92vw,1100px)] entrada overflow-visible bg-transparent p-0 text-crema backdrop:bg-noche/90 backdrop:backdrop-blur-sm"
    >
      <div className="flex flex-col gap-4">
        <header className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-cond text-[11px] font-bold tracking-[0.24em] text-oro uppercase">
              La gala
            </p>
            <h3
              id="titulo-presentacion"
              className="truncate text-[20px] tracking-wide text-crema sm:text-[26px]"
            >
              {titulo}
            </h3>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar el video"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-crema/40 text-crema transition-colors hover:border-oro hover:bg-oro hover:text-noche"
          >
            <IconoCerrar size={20} strokeWidth={2.2} />
          </button>
        </header>

        <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-oro-profundo bg-noche shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
          <iframe
            src={EMBED}
            title={titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        </div>

        <p className="text-center font-cond text-[11px] font-semibold tracking-[0.16em] text-oro-medio uppercase">
          Video de {canal} ·{" "}
          <a
            href={EN_YOUTUBE}
            target="_blank"
            rel="noreferrer"
            className="underline transition-colors hover:text-oro"
          >
            Verlo en YouTube
          </a>
        </p>
      </div>
    </dialog>
  );
}

export function Presentacion() {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative w-full overflow-hidden rounded-sm border border-oro-profundo bg-noche">
        <div className="relative aspect-video w-full">
          <button
            type="button"
            onClick={() => setAbierto(true)}
            aria-haspopup="dialog"
            aria-label={`Reproducir: ${titulo}`}
            className="group absolute inset-0 size-full cursor-pointer"
          >
            <Image
              src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover opacity-70 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-90"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(11,11,13,0.45)_0%,rgba(11,11,13,0.85)_100%)]"
            />
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 grid size-[68px] -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-[92px]"
            >
              <span className="absolute inset-0 rotate-45 rounded-[4px] border-2 border-oro bg-noche/80 transition-colors duration-300 group-hover:bg-oro-tinte" />
              <IconoPlay className="relative ml-1 w-[26px] fill-oro transition-transform duration-300 group-hover:scale-110 sm:w-[34px]" />
            </span>
            <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-linear-to-t from-noche to-transparent px-5 pt-12 pb-4 text-center sm:pb-6">
              <span className="font-display text-[17px] leading-tight text-crema uppercase sm:text-[24px]">
                {titulo}
              </span>
              <span className="font-cond text-[11px] font-bold tracking-[0.2em] text-oro uppercase sm:text-[12px]">
                Gala de presentación · La cartelera y los careos
              </span>
            </span>
          </button>
        </div>

        <span aria-hidden className="marco-vivo">
          <span className="marco-vivo-haz" />
        </span>
        <span aria-hidden className="marco-vivo">
          <span className="marco-vivo-haz marco-vivo-opuesto" />
        </span>
      </div>

      <p className="text-center font-cond text-[11px] font-semibold tracking-[0.16em] text-oro-medio uppercase">
        Video de {canal} ·{" "}
        <a
          href={EN_YOUTUBE}
          target="_blank"
          rel="noreferrer"
          className="underline transition-colors hover:text-oro"
        >
          Verlo en YouTube
        </a>
      </p>

      {abierto && <VisorVideo onCerrar={() => setAbierto(false)} />}
    </div>
  );
}
