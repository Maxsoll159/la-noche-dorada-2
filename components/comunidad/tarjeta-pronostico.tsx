"use client";

import Image from "next/image";
import Link from "next/link";
import { IconoComentario, IconoFlechaDerecha } from "@/assets/icons";
import type { PronosticoPublico } from "@/lib/api/tipos";
import {
  METODO,
  eleccionesDe,
  metodosDeCodigo,
  votosDeCodigo,
  type Eleccion,
} from "@/lib/compartir";
import { COMBATES } from "@/lib/evento";
import { haceCuanto } from "@/lib/formato";
import { AvatarUsuario } from "@/components/ui/avatar-usuario";
import { Bandera } from "@/components/ui/bandera";
import { Reacciones } from "./reacciones";

const numero = new Intl.NumberFormat("es-PE");

// Del combate 01 al estelar, como se leen en la noche.
export function eleccionesDeCodigo(codigo: string): Eleccion[] {
  const votos = votosDeCodigo(codigo) ?? {};
  const metodos = metodosDeCodigo(codigo) ?? {};
  return eleccionesDe(votos, metodos).sort((x, y) =>
    x.combate.n.localeCompare(y.combate.n),
  );
}

// Rejilla de 4 × 2 con el elegido de cada combate: cara, nombre, bandera y el
// método si lo pronosticó. El estelar va con marco dorado.
export function RejillaElecciones({ elecciones }: { elecciones: Eleccion[] }) {
  return (
    <ul className="grid grid-cols-4 gap-1.5 sm:gap-2">
      {elecciones.map(({ combate, elegido, metodo }) => (
        <li
          key={combate.n}
          className={`group/loseta relative isolate aspect-[3/4] overflow-hidden rounded-[4px] ${
            elegido
              ? `bg-[#0e0e12] ring-1 ring-inset ${
                  combate.estelar
                    ? "shadow-[0_0_18px_-6px_rgba(212,175,55,0.6)] ring-oro"
                    : "ring-oro-profundo/60"
                }`
              : "bg-noche/50 ring-1 ring-linea ring-inset"
          }`}
        >
          {elegido ? (
            <>
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 ${
                  combate.estelar
                    ? "bg-[radial-gradient(95%_75%_at_50%_0%,rgba(212,175,55,0.35)_0%,rgba(14,14,18,0)_75%)]"
                    : "bg-[radial-gradient(95%_75%_at_50%_0%,rgba(212,175,55,0.16)_0%,rgba(14,14,18,0)_75%)]"
                }`}
              />
              <span className="absolute inset-x-0 top-[10%] bottom-0">
                <Image
                  src={elegido.cuerpo ?? elegido.foto}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 100px, (min-width: 640px) 22vw, 24vw"
                  className={`object-contain object-bottom transition-transform duration-500 group-hover/loseta:scale-[1.05] ${
                    elegido.cuerpo
                      ? "brightness-125 contrast-[1.06] saturate-105"
                      : "object-cover object-top"
                  }`}
                />
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-noche via-noche/85 to-transparent"
              />
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 px-1 pb-1.5 text-center">
                <span className="flex max-w-full items-center gap-1">
                  <Bandera
                    pais={elegido.pais}
                    className="h-2 w-[12px] shrink-0"
                  />
                  <span
                    className={`truncate font-display text-[11px] leading-tight uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-[12px] ${
                      combate.estelar ? "text-oro-claro" : "text-crema"
                    }`}
                  >
                    {elegido.nombre}
                  </span>
                </span>
                {metodo && (
                  <span className="rounded-full border border-oro-profundo bg-noche/85 px-1.5 py-[2px] font-cond text-[9px] leading-none font-bold tracking-[0.12em] text-oro uppercase">
                    {METODO[metodo].corto}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-1 text-center">
              <span className="font-display text-[20px] leading-none text-linea">
                —
              </span>
              <span className="font-cond text-[9px] leading-tight font-bold tracking-[0.12em] text-humo uppercase">
                Sin voto
              </span>
            </span>
          )}
          <span
            aria-hidden
            className={`absolute top-0 left-0 grid h-[18px] min-w-[18px] place-items-center rounded-br-[4px] px-1 font-display text-[11px] leading-none ${
              elegido
                ? combate.estelar
                  ? "bg-oro text-noche"
                  : "bg-oro-profundo text-crema"
                : "bg-linea text-tenue"
            }`}
          >
            {combate.n}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TarjetaPronostico({ p }: { p: PronosticoPublico }) {
  const elecciones = eleccionesDeCodigo(p.codigo);
  const hechos = elecciones.filter((e) => e.elegido).length;
  const completo = hechos === COMBATES.length;
  const ruta = `/comunidad/${p.id}`;

  return (
    <article
      className={`group relative isolate flex h-full flex-col overflow-hidden rounded-md border transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(212,175,55,0.45)] ${
        p.propio
          ? "border-oro bg-[linear-gradient(180deg,#1d170a_0%,#110e08_55%,#0d0c0a_100%)]"
          : "border-linea bg-[linear-gradient(180deg,#16161c_0%,#101015_100%)] hover:border-oro-profundo"
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent to-transparent transition-colors duration-500 ${
          p.propio ? "via-oro-claro" : "via-oro/0 group-hover:via-oro"
        }`}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(212,175,55,0.14)_0%,rgba(212,175,55,0)_100%)]"
      />

      <header className="flex items-center gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
        <AvatarUsuario
          nombre={p.autor_nombre}
          url={p.autor_avatar}
          className="size-11 sm:size-12"
        />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-display text-[17px] leading-tight text-crema uppercase sm:text-[18px]">
              {p.autor_nombre}
            </span>
            {p.propio && (
              <span className="rounded-full bg-oro px-2 py-0.5 font-cond text-[10px] leading-none font-bold tracking-[0.16em] text-noche uppercase">
                Tú
              </span>
            )}
          </p>
          <p className="mt-0.5 font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase">
            <time dateTime={p.actualizado_en}>
              {haceCuanto(p.actualizado_en)}
            </time>
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 font-cond text-[11px] leading-none font-bold tracking-[0.14em] uppercase ${
            completo
              ? "border-oro bg-oro-tinte text-oro"
              : "border-linea bg-noche/60 text-tenue"
          }`}
        >
          {hechos}/{COMBATES.length}
        </span>
      </header>

      <ol
        aria-hidden
        className="mx-4 mt-3 flex items-center gap-1 sm:mx-5"
        title={`${hechos} de ${COMBATES.length} combates pronosticados`}
      >
        {elecciones.map((e) => (
          <li
            key={e.combate.n}
            className={`h-1 flex-1 rounded-full ${
              e.elegido ? "bg-oro" : "bg-linea"
            }`}
          />
        ))}
      </ol>

      {p.descripcion ? (
        <blockquote className="mx-4 mt-4 line-clamp-3 border-l-2 border-oro-profundo pl-3 text-[15px] leading-relaxed break-words whitespace-pre-line text-crema/90 sm:mx-5">
          {p.descripcion}
        </blockquote>
      ) : (
        <p className="mx-4 mt-4 font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase sm:mx-5">
          Sin descripción · Que hablen los puños
        </p>
      )}

      <Link
        href={ruta}
        aria-label={`Ver los pronósticos de ${p.autor_nombre}`}
        className="mx-4 mt-4 block sm:mx-5"
      >
        <RejillaElecciones elecciones={elecciones} />
      </Link>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-linea/70 bg-noche/40 px-4 py-3 sm:px-5">
        <Reacciones
          id={p.id}
          meGusta={p.meGusta}
          noMeGusta={p.noMeGusta}
          reaccion={p.reaccion}
          compacto
        />
        <Link
          href={ruta}
          className="group/ver flex items-center gap-2 rounded-full border border-oro-profundo px-3 py-1.5 font-cond text-[11px] leading-none font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro hover:text-noche"
        >
          <IconoComentario size={14} strokeWidth={2.2} />
          <span className="tabular-nums">{numero.format(p.comentarios)}</span>
          <span className="hidden sm:inline">
            {p.comentarios === 1 ? "comentario" : "comentarios"}
          </span>
          <IconoFlechaDerecha
            size={12}
            strokeWidth={2.6}
            className="transition-transform group-hover/ver:translate-x-0.5"
          />
        </Link>
      </footer>
    </article>
  );
}
