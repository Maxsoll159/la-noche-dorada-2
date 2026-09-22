"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IconoChevronAbajo,
  IconoFlechaDerecha,
  IconoTrofeo,
} from "@/assets/icons";
import { BANDERAS, PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { rankingFavoritos, type Favorito } from "@/lib/favoritos";
import { useConteos } from "@/lib/votacion";
import { Bandera } from "@/components/ui/bandera";

const PODIO = [
  {
    puesto: 2,
    alto: "h-[190px] sm:h-[280px] lg:h-[320px]",
    medalla: "border-crema/60 bg-[#1b1b20] text-crema",
  },
  {
    puesto: 1,
    alto: "h-[230px] sm:h-[340px] lg:h-[390px]",
    medalla: "border-oro bg-oro text-noche",
  },
  {
    puesto: 3,
    alto: "h-[170px] sm:h-[250px] lg:h-[290px]",
    medalla: "border-oro-profundo bg-oro-tinte text-oro",
  },
] as const;

const VISIBLES = 8;

const porcentaje = (pct: number | null) => (pct === null ? "—" : `${pct}%`);

function TarjetaPodio({
  favorito,
  puesto,
  alto,
  medalla,
}: {
  favorito: Favorito;
  puesto: number;
  alto: string;
  medalla: string;
}) {
  const { peleador, rival } = favorito;
  const primero = puesto === 1;

  return (
    <Link
      href={`/peleadores/${peleador.slug}`}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-sm border transition duration-500 hover:-translate-y-1.5 ${alto} ${
        primero
          ? "resplandor border-oro bg-oro-tinte"
          : "border-oro-profundo/70 bg-carbon hover:border-oro"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_35%,rgba(212,175,55,0.22)_0%,rgba(212,175,55,0)_100%)]"
      />
      <span className="absolute inset-x-0 top-2 bottom-12 -z-10 sm:bottom-16">
        <Image
          src={peleador.cuerpo ?? peleador.foto}
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, 30vw"
          className="object-contain object-bottom brightness-110 contrast-[1.06] transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-noche via-noche/80 to-transparent"
      />

      <span
        className={`absolute top-2 left-2 grid size-8 place-items-center rounded-full border font-display text-[15px] leading-none sm:top-3 sm:left-3 sm:size-10 sm:text-[18px] ${medalla}`}
      >
        {puesto}
      </span>
      {primero && (
        <span className="absolute top-2.5 right-2.5 text-oro sm:top-3.5 sm:right-3.5">
          <IconoTrofeo size={22} />
        </span>
      )}

      <span className="flex flex-col items-center gap-1 px-2 pb-3 text-center sm:pb-4">
        <span
          className={`font-display leading-none tabular-nums ${
            primero
              ? "text-[30px] text-oro-claro sm:text-[46px]"
              : "text-[24px] text-crema sm:text-[36px]"
          }`}
        >
          {porcentaje(favorito.pct)}
        </span>
        <span className="flex max-w-full items-center gap-1.5 font-display text-[13px] leading-tight text-crema uppercase sm:text-[18px]">
          <Bandera
            pais={peleador.pais}
            className="hidden h-2.5 w-[15px] shrink-0 sm:inline-flex"
          />
          <span className="truncate">{peleador.nombre}</span>
        </span>
        <span className="hidden truncate font-cond text-[10px] font-bold tracking-[0.14em] text-tenue uppercase sm:block sm:text-[11px]">
          vs {rival.nombre}
        </span>
      </span>
    </Link>
  );
}

function FilaRanking({
  favorito,
  puesto,
}: {
  favorito: Favorito;
  puesto: number;
}) {
  const { peleador, rival, pct } = favorito;
  const lidera = pct !== null && pct >= 50;

  return (
    <li>
      <Link
        href={`/peleadores/${peleador.slug}`}
        className="group grid grid-cols-[28px_40px_minmax(0,1fr)_auto] items-center gap-3 rounded-sm border border-linea bg-carbon px-3 py-2.5 transition-colors hover:border-oro-profundo hover:bg-oro-tinte sm:grid-cols-[36px_44px_minmax(0,220px)_minmax(0,1fr)_56px] sm:gap-4 sm:px-4"
      >
        <span className="text-center font-display text-[18px] leading-none text-oro-medio tabular-nums sm:text-[22px]">
          {puesto}
        </span>
        <span className="relative block aspect-[3/4] w-full overflow-hidden rounded-sm border border-linea bg-[#0e0e12]">
          <Image
            src={peleador.foto}
            alt=""
            fill
            sizes="44px"
            className="object-cover object-top"
          />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 font-display text-[15px] leading-tight text-crema uppercase transition-colors group-hover:text-oro sm:text-[17px]">
            <Bandera pais={peleador.pais} className="h-2.5 w-[15px] shrink-0" />
            <span className="truncate">{peleador.nombre}</span>
          </span>
          <span className="block truncate font-cond text-[10px] font-bold tracking-[0.14em] text-tenue uppercase sm:text-[11px]">
            vs {rival.nombre} · {BANDERAS[rival.pais].nombre}
          </span>
        </span>
        <span
          aria-hidden
          className="hidden h-2 overflow-hidden rounded-full bg-linea sm:block"
        >
          <span
            style={{ width: `${pct ?? 0}%` }}
            className={`block h-full rounded-full transition-[width] duration-700 ${
              lidera
                ? "bg-gradient-to-r from-oro-profundo to-oro-claro"
                : "bg-humo"
            }`}
          />
        </span>
        <span
          className={`text-right font-display text-[18px] leading-none tabular-nums sm:text-[20px] ${
            lidera ? "text-oro" : "text-tenue"
          }`}
        >
          {porcentaje(pct)}
        </span>
      </Link>
    </li>
  );
}

export function Favoritos() {
  const { conteos, cargando, errorCarga } = useConteos(PRONOSTICOS_ACTIVOS);
  const [completo, setCompleto] = useState(false);

  if (!PRONOSTICOS_ACTIVOS) return null;

  const ranking = rankingFavoritos(conteos);
  const totalVotos = Object.values(conteos).reduce(
    (suma, c) => suma + c.votosA + c.votosB,
    0,
  );
  const hayVotos = totalVotos > 0;

  if (errorCarga) {
    return (
      <p className="text-center font-cond text-[13px] font-semibold tracking-[0.12em] text-tenue uppercase">
        No pudimos cargar el ranking. Recarga la página.
      </p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8">
      <p
        aria-live="polite"
        className="flex items-center justify-center gap-2 font-cond text-[12px] font-bold tracking-[0.18em] text-tenue uppercase"
      >
        <span
          aria-hidden
          className="inline-block size-[7px] latido rounded-full bg-oro shadow-[0_0_10px_rgba(212,175,55,0.9)]"
        />
        {cargando
          ? "Cargando el ranking"
          : hayVotos
            ? `${new Intl.NumberFormat("es-PE").format(totalVotos)} votos · se actualiza en vivo`
            : "Todavía no hay votos"}
      </p>

      {!cargando && (
        <>
          <ol
            aria-label="Podio de los más apoyados"
            className="mx-auto grid w-full max-w-[900px] grid-cols-3 items-end gap-2 sm:gap-4"
          >
            {PODIO.map(({ puesto, alto, medalla }) => (
              <li key={puesto}>
                <TarjetaPodio
                  favorito={ranking[puesto - 1]}
                  puesto={puesto}
                  alto={alto}
                  medalla={medalla}
                />
              </li>
            ))}
          </ol>

          <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-3">
            <ol
              id="ranking-completo"
              start={4}
              aria-label="Resto del ranking"
              className="grid w-full gap-2"
            >
              {ranking.slice(3, completo ? undefined : VISIBLES).map((f, i) => (
                <FilaRanking
                  key={f.peleador.slug}
                  favorito={f}
                  puesto={i + 4}
                />
              ))}
            </ol>
            {ranking.length > VISIBLES && (
              <button
                type="button"
                onClick={() => setCompleto((v) => !v)}
                aria-expanded={completo}
                aria-controls="ranking-completo"
                className="group flex cursor-pointer items-center gap-2 font-cond text-[12px] font-bold tracking-[0.18em] text-oro-medio uppercase transition-colors hover:text-oro"
              >
                {completo
                  ? "Ver menos"
                  : `Ver el ranking completo (${ranking.length})`}
                <IconoChevronAbajo
                  size={16}
                  strokeWidth={2.4}
                  className={`transition-transform duration-300 ${completo ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </>
      )}

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="font-cond text-[11px] font-semibold tracking-[0.16em] text-oro-medio uppercase">
          Porcentaje de apoyo de cada peleador en su propio combate
        </p>
        <a
          href="#pronosticos"
          className="group flex items-center gap-2 rounded-sm border border-oro-profundo px-5 py-3 font-cond text-[13px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte"
        >
          Vota por tu favorito
          <IconoFlechaDerecha
            size={14}
            strokeWidth={2.4}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  );
}
