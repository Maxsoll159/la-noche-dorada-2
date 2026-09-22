"use client";

import Image from "next/image";
import { useState } from "react";
import { IconoPlay } from "@/assets/icons";
import { PRESENTACION } from "@/lib/evento";

export function Presentacion() {
  const [reproduciendo, setReproduciendo] = useState(false);

  const { videoId, titulo, canal, inicio } = PRESENTACION;
  const enYoutube = `https://www.youtube.com/watch?v=${videoId}&t=${inicio}s`;
  const embed =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&start=${inicio}&rel=0&modestbranding=1`;

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative w-full overflow-hidden rounded-sm border border-oro-profundo bg-noche">
        <div className="relative aspect-video w-full">
          {reproduciendo ? (
            <iframe
              src={embed}
              title={titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setReproduciendo(true)}
              aria-label={`Reproducir: ${titulo}`}
              className="group absolute inset-0 size-full cursor-pointer"
            >
              <Image
                src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
                alt=""
                fill
                sizes="(min-width: 1024px) 1200px, 100vw"
                className="object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
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
          )}
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
          href={enYoutube}
          target="_blank"
          rel="noreferrer"
          className="underline transition-colors hover:text-oro"
        >
          Verlo en YouTube
        </a>
      </p>
    </div>
  );
}
