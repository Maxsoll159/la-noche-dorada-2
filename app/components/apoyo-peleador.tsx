"use client";

import Link from "next/link";
import {
  COMBATES,
  PRONOSTICOS_ACTIVOS,
  type Combate,
  type Peleador,
} from "@/lib/evento";
import { estaAbierto, useVotacion, type Lado } from "@/lib/votacion";
import { LadoVoto, RomboVS } from "./pronosticos";

/**
 * Puesto del peleador en el apoyo de toda la cartelera.
 *
 * Solo entran los combates que ya tienen al menos un voto: uno sin votos no
 * tiene porcentaje, y meterlo como 50/50 falsearía el orden.
 */
function puestoEnElCartel(
  conteos: Record<string, { pctA: number | null }>,
  slug: string,
) {
  const lista: { slug: string; pct: number }[] = [];
  for (const c of COMBATES) {
    const k = conteos[c.n];
    if (!k || k.pctA === null) continue;
    lista.push({ slug: c.a.slug, pct: k.pctA });
    lista.push({ slug: c.b.slug, pct: 100 - k.pctA });
  }
  lista.sort((x, y) => y.pct - x.pct);
  const i = lista.findIndex((x) => x.slug === slug);
  return i === -1 ? null : { puesto: i + 1, total: lista.length };
}

/**
 * La votación de este combate dentro de la ficha, armada con las mismas
 * losetas que la sección de pronósticos de la home: tocar la foto vota, el
 * porcentaje va arriba y el nombre al pie. Este peleador siempre a la
 * izquierda; el número y el color del lado son los oficiales del combate,
 * así coinciden con la home y con el cara a cara.
 */
export function ApoyoPeleador({
  combate,
  peleador,
  rival,
  lado,
}: {
  combate: Combate;
  peleador: Peleador;
  rival: Peleador;
  lado: Lado;
}) {
  const activo = PRONOSTICOS_ACTIVOS;
  const { usuario, conteos, votos, cargando, enviando, error, votar } =
    useVotacion(activo);
  const conteo = conteos[combate.n];
  const ladoRival: Lado = lado === "a" ? "b" : "a";

  // Los conteos guardan siempre el porcentaje del lado A; el del lado B es el
  // complemento, así los dos suman 100 exacto aunque el redondeo no cuadre.
  const pctA = activo && conteo ? conteo.pctA : null;
  const pctDe = (l: Lado) =>
    pctA === null ? null : l === "a" ? pctA : 100 - pctA;
  const lidera = (l: Lado) => {
    const p = pctDe(l);
    return p !== null && (l === "a" ? p >= 50 : p > 50);
  };

  const totalVotos = conteo ? conteo.votosA + conteo.votosB : 0;
  const ganador = activo ? (conteo?.ganador ?? null) : null;
  const abierto = activo && estaAbierto(conteo);
  // Sin conteo todavía no sabemos si el combate sigue abierto, así que no se
  // puede dejar votar a ciegas.
  const esperando = activo && !conteo;
  const puedeVotar = activo && !esperando && abierto && !ganador;
  const miVoto = votos[combate.n];
  const enviandoEste = enviando === combate.n;
  const rank = conteo ? puestoEnElCartel(conteos, peleador.slug) : null;
  const nombre = (l: Lado) => combate[l].nombre;

  // `l` es el lado oficial (con el que se vota) y `donde` es la columna en la
  // que se pinta. Aquí no coinciden: el peleador de la ficha va siempre a la
  // izquierda, toque el lado que le toque en el cartel.
  const loseta = (p: Peleador, l: Lado, donde: Lado) => (
    <LadoVoto
      peleador={p}
      lado={l}
      posicion={donde}
      pct={pctDe(l)}
      lidera={lidera(l)}
      resultado={ganador ? (ganador === l ? "gano" : "perdio") : undefined}
      votado={miVoto === l}
      otroVotado={miVoto !== undefined && miVoto !== l}
      puedeVotar={puedeVotar}
      enviando={enviandoEste}
      onVotar={() => votar(combate.n, l)}
    />
  );

  const pctPropio = pctDe(lado);

  return (
    // Ancho tope: a los 1200 del contenido las losetas cuadradas medían
    // 530 px de alto y el módulo se comía la pantalla entera.
    <article className="mx-auto w-full max-w-[780px] overflow-hidden rounded-sm border border-oro-profundo bg-oro-tinte">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-oro-profundo/40 bg-noche/40 px-4 py-3 sm:px-6">
        <p className="font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro">
          {ganador ? "Resultado final" : "Pronóstico de la comunidad"}
        </p>
        <p className="flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-tenue">
          <span
            aria-hidden
            className={`inline-block size-[7px] rounded-full ${
              ganador || miVoto ? "bg-oro" : "bg-humo"
            }`}
          />
          {!activo
            ? "Próximamente"
            : cargando
              ? "Cargando"
              : ganador
                ? "Combate resuelto"
                : !abierto
                  ? "Votación cerrada"
                  : pctPropio === null
                    ? "Sin votos todavía"
                    : `${totalVotos} ${totalVotos === 1 ? "voto" : "votos"}`}
        </p>
      </header>

      {/* Las dos losetas son los botones; el rombo del VS va sobre la junta */}
      <div className="relative grid grid-cols-2 gap-1.5 p-1.5 sm:gap-2 sm:p-2">
        {loseta(peleador, lado, "a")}
        <RomboVS />
        {loseta(rival, ladoRival, "b")}
      </div>

      <div
        role="img"
        aria-label={
          pctPropio === null
            ? "Todavía sin votos"
            : `${pctPropio} % para ${peleador.nombre}, ${100 - pctPropio} % para ${rival.nombre}`
        }
        className="flex h-2 w-full overflow-hidden bg-[#2a2a31]"
      >
        <span
          style={{ width: `${pctPropio ?? 50}%` }}
          className={`block transition-[width] duration-500 ${
            lidera(lado)
              ? "bg-gradient-to-r from-oro-profundo to-oro-claro"
              : "bg-humo"
          }`}
        />
        <span
          className={`block flex-1 transition-[width] duration-500 ${
            lidera(ladoRival)
              ? "bg-gradient-to-l from-oro-profundo to-oro-claro"
              : "bg-humo"
          }`}
        />
      </div>

      {error && (
        <p
          role="status"
          className="border-t border-[#7a2b2b] bg-[#1c0d0d] px-4 py-2.5 text-center font-cond text-[12px] font-semibold uppercase tracking-[0.12em] text-[#ffb4b4]"
        >
          {error}
        </p>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 bg-noche/40 px-4 py-3 font-cond text-[11px] font-semibold uppercase tracking-[0.12em] text-tenue sm:px-6">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {ganador ? (
            <span className="text-oro-claro">
              {miVoto
                ? miVoto === ganador
                  ? "Acertaste"
                  : `Votaste por ${nombre(miVoto)}`
                : `Ganó ${nombre(ganador)}`}
            </span>
          ) : !activo ? (
            <span>La votación se habilita en la segunda fase</span>
          ) : !abierto && !esperando ? (
            <span>La votación de este combate ya cerró</span>
          ) : miVoto ? (
            <>
              <span className="text-oro-claro">Votaste por {nombre(miVoto)}</span>
              <button
                type="button"
                disabled={enviandoEste}
                onClick={() => votar(combate.n, miVoto)}
                className="cursor-pointer underline transition-colors hover:text-oro disabled:cursor-wait disabled:opacity-50"
              >
                Quitar voto
              </button>
            </>
          ) : (
            <>
              <span>Toca un lado para votar</span>
              {!usuario && (
                <span className="text-oro-medio">Te pediremos entrar con Google</span>
              )}
            </>
          )}
        </span>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {rank && (
            <span className="text-oro-medio">
              {rank.puesto}.º más apoyado de {rank.total}
            </span>
          )}
          {/* Salida a la votación completa de la home: desde aquí solo se ve
              este combate, y allí están los ocho. */}
          <Link
            href="/#pronosticos"
            className="flex items-center gap-1.5 font-bold text-oro transition-colors hover:text-oro-claro"
          >
            Ver los {COMBATES.length} combates
            <svg
              aria-hidden
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </span>
      </footer>
    </article>
  );
}
