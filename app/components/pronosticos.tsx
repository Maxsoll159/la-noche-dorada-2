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
const NUMERO: Record<Lado, { n: number; fondo: string }> = {
  a: { n: 1, fondo: "bg-lado-a" },
  b: { n: 2, fondo: "bg-lado-b" },
};

/**
 * Un lado del combate, y a la vez su botón de voto: foto, porcentaje y
 * nombre en una sola pieza. Antes había dos botones grandes aparte en el pie
 * de la card, y con ocho cards la sección se hacía interminable en móvil.
 */
function LadoVoto({
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
      // Panel propio, sin borde: el borde se clavaba en el rombo del VS y en
      // la barra. El fondo suave y la etiqueta "Votar" ya dicen que se toca.
      className={`group relative m-2 flex min-w-0 flex-col items-center gap-2 rounded-sm px-2 py-3 text-center transition-colors sm:m-3 sm:flex-row sm:gap-4 sm:px-4 sm:py-4 sm:text-left ${
        izquierda ? "" : "sm:flex-row-reverse sm:text-right"
      } ${
        votado
          ? "bg-oro/15 ring-2 ring-inset ring-oro"
          : otroVotado && puedeVotar
            ? "cursor-pointer bg-white/[0.035] opacity-55 hover:opacity-100 hover:bg-oro-tinte"
            : puedeVotar
              ? "cursor-pointer bg-white/[0.035] hover:bg-oro-tinte"
              : "cursor-default"
      } disabled:cursor-default`}
    >
      {/* Foto con el número del lado, como en la parrilla del cara a cara */}
      <span
        className={`relative block h-[84px] w-[46px] shrink-0 overflow-hidden rounded-sm border transition sm:h-[100px] sm:w-[54px] ${
          resultado === "perdio"
            ? "border-linea opacity-40 grayscale"
            : votado || destacado
              ? "border-2 border-oro"
              : "border-linea opacity-70 group-hover:opacity-100"
        }`}
      >
        <Image
          src={peleador.foto}
          alt=""
          fill
          sizes="(min-width: 640px) 54px, 46px"
          className="object-cover object-top"
        />
        <span
          aria-hidden
          className={`absolute left-0 top-0 grid size-4 place-items-center font-display text-[10px] leading-none text-white ${NUMERO[lado].fondo}`}
        >
          {NUMERO[lado].n}
        </span>
      </span>
      <span
        className={`flex w-full min-w-0 flex-col items-center gap-0.5 sm:w-auto sm:flex-1 ${
          izquierda ? "sm:items-start" : "sm:items-end"
        }`}
      >
        <span
          className={`font-display text-[26px] leading-none tabular-nums sm:text-[36px] ${
            destacado ? "text-oro" : "text-tenue"
          }`}
        >
          {pct === null ? "—" : `${pct}%`}
        </span>
        <span
          className={`w-full font-display text-[12px] uppercase leading-tight break-words hyphens-auto sm:text-[16px] ${
            destacado || votado ? "text-oro-claro" : "text-crema"
          }`}
        >
          {peleador.nombre}
        </span>
        {resultado === "gano" ? (
          <span className="mt-1 rounded-full bg-oro px-2 py-[2px] font-cond text-[9px] font-bold uppercase tracking-[0.16em] text-noche">
            Ganó
          </span>
        ) : votado ? (
          <span className="mt-1 flex items-center gap-1 rounded-sm bg-oro px-2.5 py-1 font-cond text-[9px] font-bold uppercase tracking-[0.16em] text-noche">
            <IconoVoto />
            Tu voto
          </span>
        ) : puedeVotar ? (
          // La etiqueta es lo que dice "esto se toca": el lado entero es el
          // botón, pero hacía falta la palabra.
          <span className="mt-1 flex items-center gap-1 rounded-sm border border-oro px-2.5 py-1 font-cond text-[9px] font-bold uppercase tracking-[0.16em] text-oro transition-colors group-hover:bg-oro group-hover:text-noche">
            <IconoVoto />
            {otroVotado ? "Cambiar" : "Votar"}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function Card({
  c,
  conteo,
  voto,
  enviando,
  conSesion,
  onVotar,
}: {
  c: Combate;
  conteo?: Conteo;
  voto?: Lado;
  enviando: boolean;
  /** Sin sesión, el primer toque manda a Google: se avisa antes. */
  conSesion: boolean;
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
        <p className="flex items-center gap-2 font-cond text-[10px] font-bold uppercase tracking-[0.12em] sm:gap-2.5 sm:text-[11px] sm:tracking-[0.22em]">
          <span className="text-oro">Combate {c.n}</span>
          {c.billing && (
            <>
              <span aria-hidden className="size-[3px] rounded-full bg-oro-profundo" />
              <span className="text-oro-profundo">{c.billing}</span>
            </>
          )}
        </p>
        <p className="flex items-center gap-2 font-cond text-[10px] font-bold uppercase tracking-[0.1em] sm:text-[11px] sm:tracking-[0.14em]">
          {!activo ? (
            <span className="text-oro-profundo">Próximamente</span>
          ) : esperando ? (
            <span className="text-tenue">Cargando</span>
          ) : (
            <>
              <span
                aria-hidden
                className={`inline-block size-[7px] rounded-full ${
                  ganador || voto ? "bg-oro" : "bg-[#3a3a44]"
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

      {/* Los dos lados son los botones; el rombo del VS va en medio. */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch">
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
        {/* Con margen: el rombo gira 45° y sus puntas sobresalen de su caja, así
            que sin aire se clavaban en los paneles de los lados. */}
        <span className="relative mx-1 grid size-[34px] shrink-0 place-items-center self-center sm:mx-2 sm:size-[48px]">
          <span
            aria-hidden
            className="absolute inset-0 rotate-45 rounded-[3px] border border-oro bg-noche/90"
          />
          <span className="relative font-display text-[12px] text-oro sm:text-[15px]">
            VS
          </span>
        </span>
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
              : "bg-[#3a3a44]"
          }`}
        />
        <span
          className={`block flex-1 transition-[width] duration-500 ${
            lideraB
              ? "bg-gradient-to-l from-oro-profundo to-oro-claro"
              : "bg-[#3a3a44]"
          }`}
        />
      </div>

      {/* Una sola línea de estado en vez de dos botones grandes */}
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#08080b] px-3 py-2.5 font-cond text-[10px] font-semibold uppercase tracking-[0.12em] text-tenue sm:px-5 sm:text-[11px]">
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
        ) : (
          <>
            <span>Toca un lado para votar</span>
            {!conSesion && (
              <span className="flex items-center gap-1.5 text-oro-profundo">
                <LogoGoogle className="size-[11px]" />
                Te pediremos entrar con Google
              </span>
            )}
          </>
        )}
      </footer>
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

      <div className="grid w-full gap-5 lg:grid-cols-2">
        {COMBATES.map((c) => (
          <Card
            key={c.n}
            c={c}
            conteo={conteos[c.n]}
            voto={votos[c.n]}
            enviando={enviando === c.n}
            conSesion={!!usuario}
            onVotar={(lado) => votar(c.n, lado)}
          />
        ))}
      </div>

      <p className="text-center font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-oro-profundo">
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
