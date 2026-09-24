"use client";

import Link from "next/link";
import { IconoFlechaDerecha } from "@/assets/icons";
import {
  COMBATES,
  PRONOSTICOS_ACTIVOS,
  type Combate,
  type Peleador,
} from "@/lib/evento";
import { METODO } from "@/lib/compartir";
import { estaAbierto, useVotacion, type Lado } from "@/lib/votacion";
import { LadoVoto } from "./lado-voto";
import { RomboVS } from "./rombo-vs";
import { SelectorMetodo } from "./selector-metodo";

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
  const {
    usuario,
    conteos,
    votos,
    metodos,
    cargando,
    enviando,
    enviandoMetodo,
    error,
    votar,
    elegirMetodo,
  } = useVotacion(activo);
  const conteo = conteos[combate.n];
  const ladoRival: Lado = lado === "a" ? "b" : "a";

  const pctA = activo && conteo ? conteo.pctA : null;
  const pctDe = (l: Lado) =>
    pctA === null ? null : l === "a" ? pctA : 100 - pctA;
  const lidera = (l: Lado) => {
    const p = pctDe(l);
    return p !== null && (l === "a" ? p >= 50 : p > 50);
  };

  const totalVotos = conteo ? conteo.votosA + conteo.votosB : 0;
  const ganador = activo ? (conteo?.ganador ?? null) : null;
  const resuelto = activo && (conteo?.resuelto ?? false);
  const metodoReal = activo ? (conteo?.metodo ?? null) : null;
  const abierto = activo && estaAbierto(conteo);
  const esperando = activo && !conteo;
  const puedeVotar = activo && !esperando && abierto && !resuelto;
  const miVoto = votos[combate.n];
  const miMetodo = metodos[combate.n];
  const conMetodo = (m: typeof metodoReal | undefined) =>
    m ? ` · ${METODO[m].nombre}` : "";
  const enviandoEste = enviando === combate.n;
  const rank = conteo ? puestoEnElCartel(conteos, peleador.slug) : null;
  const nombre = (l: Lado) => combate[l].nombre;

  const loseta = (p: Peleador, l: Lado, donde: Lado) => (
    <LadoVoto
      sizes="(min-width: 832px) 380px, calc(50vw - 34px)"
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
    <article className="mx-auto w-full max-w-[780px] overflow-hidden rounded-sm border border-oro-profundo bg-oro-tinte">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-oro-profundo/40 bg-noche/40 px-4 py-3 sm:px-6">
        <p className="font-cond text-[11px] font-bold tracking-[0.2em] text-oro uppercase">
          {resuelto ? "Resultado final" : "Pronóstico de la comunidad"}
        </p>
        <p className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.14em] text-tenue uppercase">
          <span
            aria-hidden
            className={`inline-block size-[7px] rounded-full ${
              resuelto || miVoto ? "bg-oro" : "bg-humo"
            }`}
          />
          {!activo
            ? "Próximamente"
            : cargando
              ? "Cargando"
              : resuelto
                ? "Combate resuelto"
                : !abierto
                  ? "Votación cerrada"
                  : pctPropio === null
                    ? "Sin votos todavía"
                    : `${totalVotos} ${totalVotos === 1 ? "voto" : "votos"}`}
        </p>
      </header>

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

      {activo &&
        conteo &&
        (puedeVotar ||
          Object.values(conteo.votosMetodo).some((n) => n > 0)) && (
          <div className="bg-noche/40">
            <SelectorMetodo
              metodo={miVoto ? miMetodo : undefined}
              votos={conteo.votosMetodo}
              puedeElegir={puedeVotar && !!miVoto}
              abierto={puedeVotar}
              enviando={enviandoMetodo === combate.n}
              onElegir={(m) => elegirMetodo(combate.n, m)}
            />
          </div>
        )}

      {error && (
        <p
          role="status"
          className="border-t border-[#7a2b2b] bg-[#1c0d0d] px-4 py-2.5 text-center font-cond text-[12px] font-semibold tracking-[0.12em] text-[#ffb4b4] uppercase"
        >
          {error}
        </p>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 bg-noche/40 px-4 py-3 font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase sm:px-6">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {resuelto ? (
            <>
              <span className="text-oro-claro">
                {ganador
                  ? `Ganó ${nombre(ganador)}${conMetodo(metodoReal)}`
                  : "Terminó en empate"}
              </span>
              {miVoto && (
                <span
                  className={
                    miVoto === ganador ||
                    (metodoReal !== null && miMetodo === metodoReal)
                      ? "text-oro"
                      : ""
                  }
                >
                  {miVoto === ganador && miMetodo === metodoReal
                    ? "Acertaste ganador y método"
                    : miVoto === ganador
                      ? "Acertaste el ganador"
                      : metodoReal !== null && miMetodo === metodoReal
                        ? "Acertaste el método"
                        : `Votaste por ${nombre(miVoto)}${conMetodo(miMetodo)}`}
                </span>
              )}
            </>
          ) : !activo ? (
            <span>La votación se habilita en la segunda fase</span>
          ) : !abierto && !esperando ? (
            <span>
              {miVoto
                ? `Cerró · Votaste por ${nombre(miVoto)}${conMetodo(miMetodo)}`
                : "La votación de este combate ya cerró"}
            </span>
          ) : miVoto ? (
            <>
              <span className="text-oro-claro">
                Votaste por {nombre(miVoto)}
              </span>
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
                <span className="text-oro-medio">
                  Te pediremos entrar con Google
                </span>
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
          <Link
            href="/#pronosticos"
            className="flex items-center gap-1.5 font-bold text-oro transition-colors hover:text-oro-claro"
          >
            Ver los {COMBATES.length} combates
            <IconoFlechaDerecha size={13} strokeWidth={2.4} />
          </Link>
        </span>
      </footer>
    </article>
  );
}
