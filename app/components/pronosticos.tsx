"use client";

import Image from "next/image";
import { useState } from "react";
import {
  COMBATES,
  EVENTO,
  PRONOSTICOS_ACTIVOS,
  type Combate,
} from "@/lib/evento";
import {
  estaAbierto,
  puntaje,
  useVotacion,
  type Conteo,
  type Lado,
} from "@/lib/votacion";

function Candado({ className = "size-[26px]" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`shrink-0 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function Trofeo({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="30"
      height="30"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M6 4h12v5a6 6 0 0 1-12 0V4Z" />
      <path d="M9 21h6M12 15v6" />
    </svg>
  );
}

function IconoVoto() {
  return (
    <svg
      aria-hidden
      width="16"
      height="16"
      className="shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 12 2 2 4-4" />
      <path d="M3 17V9l9-6 9 6v8l-9 4-9-4Z" />
    </svg>
  );
}

/** La G de Google, con sus cuatro colores de marca. */
function LogoGoogle({ className = "size-[18px]" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={`shrink-0 ${className}`}>
      <path
        fill="#4285F4"
        d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.6h7.1c4.2-3.8 6.6-9.5 6.6-16.3Z"
      />
      <path
        fill="#34A853"
        d="M24 46c6 0 11-2 14.6-5.2l-7.1-5.6c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.8C7.9 41.2 15.4 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.6 28.2a13.2 13.2 0 0 1 0-8.4v-5.8H4.3a22 22 0 0 0 0 20l7.3-5.8Z"
      />
      <path
        fill="#EA4335"
        d="M24 9.5c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 2.9 30 1 24 1 15.4 1 7.9 5.8 4.3 12.9l7.3 5.8C13.3 13.4 18.2 9.5 24 9.5Z"
      />
    </svg>
  );
}

function BotonGoogle({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-crema px-6 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.13em] text-noche transition-colors hover:bg-white"
    >
      <LogoGoogle />
      {children}
    </button>
  );
}

/**
 * Jugador 1 a la izquierda, jugador 2 a la derecha: los mismos acentos de la
 * parrilla del cara a cara, para que las dos secciones se lean como una.
 */
const NUMERO: Record<Lado, { n: number; fondo: string; tinte: string }> = {
  a: {
    n: 1,
    fondo: "bg-lado-a",
    // Resplandor del color del lado detrás de la cabeza, que se apaga hacia
    // el pie de la loseta.
    tinte: "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(226,54,44,0.32)_0%,rgba(16,16,21,0)_75%)]",
  },
  b: {
    n: 2,
    fondo: "bg-lado-b",
    tinte: "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(47,123,230,0.32)_0%,rgba(16,16,21,0)_75%)]",
  },
};

/**
 * Un lado del combate, y a la vez su botón de voto: una loseta con la foto de
 * estudio del peleador, el porcentaje arriba (mirando al VS) y el nombre al
 * pie, como en una pantalla de selección. La loseta entera se toca. Antes era
 * una fila de foto chica, número y texto que se leía como una tabla.
 * Se exporta porque la ficha de peleador arma su módulo de pronóstico con las
 * mismas piezas.
 */
export function LadoVoto({
  peleador,
  lado,
  pct,
  lidera,
  resultado,
  votado,
  otroVotado,
  puedeVotar,
  enviando,
  onVotar,
}: {
  peleador: Combate["a"];
  lado: Lado;
  pct: number | null;
  lidera: boolean;
  /** Solo cuando el combate ya tiene ganador cargado. */
  resultado?: "gano" | "perdio";
  votado: boolean;
  /** El usuario ya votó, pero por el otro lado: este se atenúa. */
  otroVotado: boolean;
  puedeVotar: boolean;
  enviando: boolean;
  onVotar: () => void;
}) {
  const izquierda = lado === "a";
  // Con resultado manda el resultado; antes, quién va arriba en la votación.
  const destacado = resultado ? resultado === "gano" : lidera;
  // Se atenúa el que perdió y, mientras se vota, el lado que NO elegiste.
  const apagado = resultado === "perdio" || (otroVotado && puedeVotar);
  return (
    <button
      type="button"
      disabled={!puedeVotar || enviando}
      onClick={onVotar}
      aria-pressed={votado}
      aria-label={
        votado
          ? `Votaste por ${peleador.nombre}. Volver a tocar quita el voto`
          : `Votar por ${peleador.nombre}`
      }
      // Alta en móvil (4/5) y cuadrada desde sm. Apaisada no sirve: los
      // recortes de estudio son verticales y con la cabeza pegada al borde de
      // arriba, así que en una caja ancha se cortaban las cabezas.
      className={`group relative isolate block aspect-[4/5] w-full overflow-hidden rounded-sm bg-carbon outline-none transition duration-300 sm:aspect-square ${
        votado
          ? "ring-2 ring-inset ring-oro"
          : puedeVotar
            ? "cursor-pointer ring-1 ring-inset ring-linea hover:ring-oro-profundo"
            : "ring-1 ring-inset ring-linea"
      } ${apagado ? "opacity-55 hover:opacity-100" : ""} disabled:cursor-default`}
    >
      {/* Resplandor del color del lado, detrás de la cabeza */}
      <span aria-hidden className={`absolute inset-0 -z-10 ${NUMERO[lado].tinte}`} />

      {/* La foto de estudio, entera y apoyada al pie (contain): los recortes
          vienen sin aire sobre la cabeza y cualquier cover la cortaba. La
          caja arranca un poco más abajo del borde para que la cabeza tenga
          margen y la franja de arriba quede para el porcentaje. Si no hay
          recorte de estudio, el retrato del arte va a cover. */}
      <span className="absolute inset-x-0 bottom-0 top-[12%] sm:top-[9%]">
        <Image
          src={peleador.cuerpo ?? peleador.foto}
          alt=""
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"
          className={`transition-transform duration-500 group-hover:scale-[1.04] ${
            peleador.cuerpo
              ? "object-contain object-bottom brightness-125 contrast-[1.06] saturate-105"
              : "object-cover object-top"
          } ${resultado === "perdio" ? "grayscale" : ""}`}
        />
      </span>

      {/* Fundido al pie para que el nombre se lea sobre la foto */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-noche via-noche/75 to-transparent"
      />

      {/* Número del lado en la esquina exterior, como en la parrilla */}
      <span
        aria-hidden
        className={`absolute top-0 grid size-5 place-items-center font-display text-[12px] leading-none text-white ${
          izquierda ? "left-0" : "right-0"
        } ${NUMERO[lado].fondo}`}
      >
        {NUMERO[lado].n}
      </span>

      {/* Porcentaje en la esquina interior: los dos miran al VS */}
      <span
        className={`absolute top-2 font-display text-[28px] leading-none tabular-nums drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)] sm:top-3 sm:text-[38px] ${
          izquierda ? "right-3 sm:right-4" : "left-3 sm:left-4"
        } ${destacado ? "text-oro" : "text-tenue"}`}
      >
        {pct === null ? "—" : `${pct}%`}
      </span>

      {/* Nombre y etiqueta al pie, hacia el borde exterior */}
      <span
        className={`absolute inset-x-0 bottom-0 flex flex-col gap-1.5 px-3 pb-3 sm:px-4 sm:pb-4 ${
          izquierda ? "items-start text-left" : "items-end text-right"
        }`}
      >
        <span
          className={`font-display text-[15px] uppercase leading-tight break-words sm:text-[19px] ${
            destacado || votado ? "text-oro-claro" : "text-crema"
          }`}
        >
          {peleador.nombre}
        </span>
        {resultado === "gano" ? (
          <span className="rounded-full bg-oro px-2.5 py-[3px] font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-noche">
            Ganó
          </span>
        ) : votado ? (
          <span className="flex items-center gap-1 rounded-sm bg-oro px-2.5 py-1 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-noche">
            <IconoVoto />
            Tu voto
          </span>
        ) : puedeVotar ? (
          // La etiqueta es lo que dice "esto se toca": la loseta entera es el
          // botón, pero hacía falta la palabra.
          <span className="flex items-center gap-1 rounded-sm border border-oro bg-noche/70 px-2.5 py-1 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro backdrop-blur-sm transition-colors group-hover:bg-oro group-hover:text-noche">
            <IconoVoto />
            {otroVotado ? "Cambiar" : "Votar"}
          </span>
        ) : null}
      </span>
    </button>
  );
}

/** Rombo del VS montado sobre la junta de las dos losetas. */
export function RomboVS() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 z-10 grid size-[36px] -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-[46px]"
    >
      <span className="absolute inset-0 rotate-45 rounded-[3px] border border-oro bg-noche shadow-[0_0_18px_rgba(0,0,0,0.85)]" />
      <span className="relative font-display text-[12px] text-oro sm:text-[14px]">
        VS
      </span>
    </span>
  );
}

function Card({
  c,
  conteo,
  voto,
  enviando,
  onVotar,
}: {
  c: Combate;
  conteo?: Conteo;
  voto?: Lado;
  enviando: boolean;
  onVotar: (lado: Lado) => void;
}) {
  const activo = PRONOSTICOS_ACTIVOS;
  // Sin un solo voto no hay porcentaje que enseñar: un 50/50 inventado sería
  // mentira, así que los dos lados van en raya y la barra queda gris.
  const pctA = activo && conteo ? conteo.pctA : null;
  const anchoA = pctA ?? 50;
  const lideraA = pctA !== null && pctA >= 50;
  const lideraB = pctA !== null && pctA < 50;
  const abierto = activo && estaAbierto(conteo);
  // Todavía no llegó el conteo de la base: los botones no deben dejar votar
  // contra un combate del que no sabemos si sigue abierto.
  const esperando = activo && !conteo;
  // Con el ganador cargado la card deja de ser una votación y pasa a ser un
  // resultado: manda sobre cualquier otro estado.
  const ganador = activo ? (conteo?.ganador ?? null) : null;
  const acerto = ganador !== null && voto === ganador;
  const puedeVotar = activo && !esperando && abierto && !ganador;

  const nombre = (lado: Lado) => c[lado].nombre;

  return (
    <article
      className={`overflow-hidden rounded-sm border ${
        c.estelar ? "border-oro bg-oro-tinte" : "border-linea bg-carbon"
      }`}
    >
      {/* flex-wrap y tracking más corto en móvil: los tres rótulos juntos no
          entran en una card de 312 px y se salían del borde. */}
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-linea bg-[#08080b] px-3 py-2.5 sm:px-5">
        <p className="flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.12em] sm:gap-2.5 sm:text-[11px] sm:tracking-[0.22em]">
          <span className="text-oro">Combate {c.n}</span>
          {c.billing && (
            <>
              <span aria-hidden className="size-[3px] rounded-full bg-oro-profundo" />
              <span className="text-oro-medio">{c.billing}</span>
            </>
          )}
        </p>
        <p className="flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.14em]">
          {!activo ? (
            <span className="text-oro-medio">Próximamente</span>
          ) : esperando ? (
            <span className="text-tenue">Cargando</span>
          ) : (
            <>
              <span
                aria-hidden
                className={`inline-block size-[7px] rounded-full ${
                  ganador || voto ? "bg-oro" : "bg-humo"
                }`}
              />
              <span className={ganador || voto ? "text-oro" : "text-tenue"}>
                {ganador
                  ? "Resultado final"
                  : !abierto
                    ? "Votación cerrada"
                    : voto
                      ? "Ya votaste"
                      : "Votación abierta"}
              </span>
            </>
          )}
        </p>
      </header>

      {/* Los dos lados son los botones; el rombo del VS va montado sobre la
          junta, no en una columna propia que robaba ancho a las losetas. */}
      <div className="relative grid grid-cols-2 gap-1.5 p-1.5 sm:gap-2 sm:p-2">
        <LadoVoto
          peleador={c.a}
          lado="a"
          pct={pctA}
          lidera={lideraA}
          resultado={ganador ? (ganador === "a" ? "gano" : "perdio") : undefined}
          votado={voto === "a"}
          otroVotado={voto === "b"}
          puedeVotar={puedeVotar}
          enviando={enviando}
          onVotar={() => onVotar("a")}
        />
        <RomboVS />
        <LadoVoto
          peleador={c.b}
          lado="b"
          pct={pctA === null ? null : 100 - pctA}
          lidera={lideraB}
          resultado={ganador ? (ganador === "b" ? "gano" : "perdio") : undefined}
          votado={voto === "b"}
          otroVotado={voto === "a"}
          puedeVotar={puedeVotar}
          enviando={enviando}
          onVotar={() => onVotar("b")}
        />
      </div>

      <div
        role="img"
        aria-label={
          pctA === null
            ? "Todavía sin votos"
            : `${pctA} % para ${c.a.nombre}, ${100 - pctA} % para ${c.b.nombre}`
        }
        className="flex h-2 w-full overflow-hidden bg-[#2a2a31]"
      >
        <span
          style={{ width: `${anchoA}%` }}
          className={`block transition-[width] duration-500 ${
            lideraA
              ? "bg-gradient-to-r from-oro-profundo to-oro-claro"
              : "bg-humo"
          }`}
        />
        <span
          className={`block flex-1 transition-[width] duration-500 ${
            lideraB
              ? "bg-gradient-to-l from-oro-profundo to-oro-claro"
              : "bg-humo"
          }`}
        />
      </div>

      {/* Una sola línea de estado, y solo cuando hay algo que decir: la
          card abierta y sin voto no lleva pie, la ayuda de uso va una vez
          encima de la rejilla y no ocho veces. */}
      {(ganador || !activo || esperando || !abierto || voto) && (
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#08080b] px-3 py-2.5 font-cond text-[11px] font-semibold uppercase tracking-[0.12em] text-tenue sm:px-5">
        {ganador ? (
          <>
            <span className="flex items-center gap-2 text-oro-claro">
              <span className="text-oro">
                <Trofeo className="size-[15px]" />
              </span>
              Ganó {nombre(ganador)}
            </span>
            {/* Sin voto no hay veredicto que dar: la card solo informa. */}
            {voto && (
              <span className={acerto ? "text-oro" : "text-tenue"}>
                {acerto ? "Acertaste" : `Votaste por ${nombre(voto)}`}
              </span>
            )}
          </>
        ) : !activo ? (
          <span className="flex items-center gap-2">
            <Candado className="size-[14px]" />
            La votación se habilita en la segunda fase
          </span>
        ) : esperando ? (
          <span>Cargando la votación</span>
        ) : !abierto ? (
          <span className="flex items-center gap-2">
            <Candado className="size-[14px]" />
            La votación de este combate ya cerró
          </span>
        ) : voto ? (
          <>
            <span className="text-oro-claro">Votaste por {nombre(voto)}</span>
            <span className="flex items-center gap-3">
              <span>Toca el otro lado para cambiar</span>
              <button
                type="button"
                disabled={enviando}
                onClick={() => onVotar(voto)}
                className="cursor-pointer underline transition-colors hover:text-oro disabled:cursor-wait disabled:opacity-50"
              >
                Quitar voto
              </button>
            </span>
          </>
        ) : null}
      </footer>
      )}
    </article>
  );
}

export function Pronosticos() {
  const activo = PRONOSTICOS_ACTIVOS;
  const { usuario, conteos, votos, cargando, enviando, error, votar, entrar, salir } =
    useVotacion(activo);
  const [copiado, setCopiado] = useState(false);

  const hechos = Object.keys(votos).length;
  // En cuanto la organización carga ganadores, el módulo deja de contar
  // "cuántos elegiste" y pasa a contar "cuántos acertaste".
  const { resueltos, aciertos } = puntaje(conteos, votos);
  const hayResultados = resueltos > 0;

  const compartir = async () => {
    const elegidos = COMBATES.filter((c) => votos[c.n]).map((c) => {
      const nombre = votos[c.n] === "a" ? c.a.nombre : c.b.nombre;
      const ganador = conteos[c.n]?.ganador;
      // Una marca por línea cuando ya hay resultado, para que lo compartido
      // se lea solo sin tener que abrir el sitio.
      const marca = !ganador ? "" : votos[c.n] === ganador ? " ✅" : " ❌";
      return `${c.n} · ${nombre}${marca}`;
    });
    const texto = [
      hayResultados
        ? `Acerté ${aciertos} de ${resueltos} en ${EVENTO.nombre}:`
        : `Mis pronósticos para ${EVENTO.nombre}:`,
      ...elegidos,
      `${window.location.origin}/#pronosticos`,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({ title: EVENTO.nombre, text: texto });
      } else {
        await navigator.clipboard.writeText(texto);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2200);
      }
    } catch {
      /* el usuario canceló el diálogo de compartir, o no dio permiso */
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-7">
      {!activo ? (
        <div className="flex w-full flex-col items-center gap-4 rounded-sm border border-oro-profundo bg-oro-tinte px-4 py-6 text-center sm:flex-row sm:gap-5 sm:px-7 sm:py-8 sm:text-left">
          <span className="text-oro">
            <Candado />
          </span>
          <div className="flex-1">
            <p className="font-display text-[19px] uppercase leading-tight text-oro-claro sm:text-[22px]">
              La votación abre en la segunda fase
            </p>
            <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.12em] text-tenue sm:text-[13px] sm:tracking-[0.14em]">
              Podrás elegir a tu favorito en los ocho combates y compartirlo
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-oro bg-noche/60 px-4 py-2 font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro">
            Próximamente
          </span>
        </div>
      ) : !usuario ? (
        <div className="flex w-full flex-col items-center gap-5 rounded-sm border border-oro-profundo bg-oro-tinte px-4 py-6 text-center sm:px-7 sm:py-8 lg:flex-row lg:gap-6 lg:text-left">
          <span className="text-oro">
            <Trofeo />
          </span>
          <div className="flex-1">
            <p className="font-display text-[19px] uppercase leading-tight text-oro-claro sm:text-[22px]">
              Arma tus pronósticos
            </p>
            <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.12em] text-tenue sm:text-[13px] sm:tracking-[0.14em]">
              Entra con Google y elige a tu favorito en los ocho combates
            </p>
          </div>
          <BotonGoogle onClick={entrar}>Entrar con Google</BotonGoogle>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {/* Hasta lg va apilada y a lo ancho: el trofeo con el conteo arriba,
              la barra de los ocho combates en medio y el botón abajo a ancho
              completo. En una fila los tres bloques no entran sin que el
              contador se parta y la barra quede en un hilo. */}
          <div className="flex w-full flex-col items-center gap-5 rounded-sm border border-oro-profundo bg-oro-tinte px-4 py-5 sm:px-7 sm:py-6 lg:flex-row lg:gap-9">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <span className="shrink-0 text-oro">
                <Trofeo />
              </span>
              <div>
                <p className="font-display text-[19px] uppercase leading-tight text-oro-claro sm:text-[22px]">
                  {hayResultados ? "Tu puntaje" : "Tus pronósticos"}
                </p>
                <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-tenue sm:tracking-[0.16em]">
                  {hayResultados
                    ? `Acertaste ${aciertos} de ${resueltos} combates resueltos`
                    : `${hechos} de ${COMBATES.length} combates elegidos`}
                </p>
              </div>
            </div>
            <ol className="flex w-full flex-1 items-center gap-1.5" aria-hidden>
              {COMBATES.map((c) => {
                const ganador = conteos[c.n]?.ganador;
                const fallado = ganador && votos[c.n] && votos[c.n] !== ganador;
                return (
                  <li
                    key={c.n}
                    className={`h-2 flex-1 rounded-full transition-colors ${
                      fallado
                        ? "bg-[#7a2b2b]"
                        : votos[c.n]
                          ? "bg-oro"
                          : "bg-[#2a2a31]"
                    }`}
                  />
                );
              })}
            </ol>
            <button
              type="button"
              onClick={compartir}
              disabled={hechos === 0}
              className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-oro px-6 py-3.5 font-cond text-[13px] font-bold uppercase tracking-[0.14em] text-noche transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10 sm:py-3"
            >
              {copiado ? "Copiados" : "Compartir"}
            </button>
          </div>

          <p className="flex flex-wrap items-center justify-end gap-3 font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-tenue">
            <span className="flex items-center gap-2">
              {usuario.user_metadata.avatar_url && (
                <Image
                  src={usuario.user_metadata.avatar_url}
                  alt=""
                  width={22}
                  height={22}
                  unoptimized
                  className="rounded-full border border-oro-profundo"
                />
              )}
              {usuario.user_metadata.full_name ?? usuario.email}
            </span>
            <button
              type="button"
              onClick={salir}
              className="cursor-pointer underline transition-colors hover:text-oro"
            >
              Cerrar sesión
            </button>
          </p>
        </div>
      )}

      {error && (
        <p
          role="status"
          className="w-full rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-5 py-3 text-center font-cond text-[13px] font-semibold uppercase tracking-[0.12em] text-[#ffb4b4]"
        >
          {error}
        </p>
      )}

      {/* La ayuda de uso, una sola vez para las ocho cards */}
      {activo && !cargando && (
        <p className="-mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-tenue">
          <span>Toca un lado para votar</span>
          {!usuario && (
            <span className="flex items-center gap-1.5 text-oro-medio">
              <LogoGoogle className="size-[12px]" />
              Te pediremos entrar con Google
            </span>
          )}
        </p>
      )}

      <div className="grid w-full gap-4 sm:gap-5 lg:grid-cols-2">
        {COMBATES.map((c) => (
          <Card
            key={c.n}
            c={c}
            conteo={conteos[c.n]}
            voto={votos[c.n]}
            enviando={enviando === c.n}
            onVotar={(lado) => votar(c.n, lado)}
          />
        ))}
      </div>

      <p className="text-center font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-oro-medio">
        {!activo
          ? "Los pronósticos de la comunidad se habilitan en la segunda fase del sitio"
          : cargando
            ? "Cargando los pronósticos de la comunidad"
            : resueltos === COMBATES.length
              ? `Resultados finales de ${EVENTO.nombre} · Los porcentajes son lo que pronosticó la comunidad`
              : hayResultados
                ? `${resueltos} de ${COMBATES.length} combates resueltos · El resto sigue abierto`
                : "Un voto por combate · Puedes cambiarlo hasta que cierre cada combate · Nadie ve a quién votaste"}
      </p>
    </div>
  );
}
