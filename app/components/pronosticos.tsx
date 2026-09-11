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

function Candado() {
  return (
    <svg
      aria-hidden
      width="26"
      height="26"
      className="shrink-0"
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
function LogoGoogle() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 48 48" className="shrink-0">
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

function Lado({
  nombre,
  foto,
  pct,
  lidera,
  izquierda,
  resultado,
}: {
  nombre: string;
  foto: string;
  pct: number | null;
  lidera: boolean;
  izquierda: boolean;
  /** Solo cuando el combate ya tiene ganador cargado. */
  resultado?: "gano" | "perdio";
}) {
  // Con resultado manda el resultado; antes, quién va arriba en la votación.
  const destacado = resultado ? resultado === "gano" : lidera;
  return (
    // En móvil la foto va encima del nombre. En fila no cabe: descontando la
    // foto y el rombo del VS quedan menos de 20 px de ancho para el texto, y
    // nombres como "JH de la Cruz 777" se parten letra por letra.
    <div
      className={`flex min-w-0 flex-1 flex-col items-center gap-2 text-center sm:flex-row sm:gap-5 sm:text-left ${
        izquierda
          ? "sm:justify-start"
          : "sm:flex-row-reverse sm:justify-start sm:text-right"
      }`}
    >
      <span
        className={`relative block h-[96px] w-[52px] shrink-0 overflow-hidden rounded-sm border transition sm:h-[128px] sm:w-[68px] ${
          resultado === "perdio"
            ? "border-linea opacity-40 grayscale"
            : destacado
              ? "border-2 border-oro"
              : "border-linea opacity-70"
        }`}
      >
        <Image
          src={foto}
          alt={nombre}
          fill
          sizes="(min-width: 640px) 68px, 52px"
          className="object-cover object-top"
        />
      </span>
      <div
        className={`flex w-full min-w-0 flex-col items-center gap-1 sm:w-auto sm:flex-1 ${
          izquierda ? "sm:items-start" : "sm:items-end"
        }`}
      >
        <p
          className={`font-display text-[27px] leading-none tabular-nums sm:text-[44px] ${
            destacado ? "text-oro" : "text-tenue"
          }`}
        >
          {pct === null ? "—" : `${pct}%`}
        </p>
        <p
          className={`w-full font-display text-[13px] uppercase leading-tight break-words hyphens-auto sm:text-[20px] ${
            destacado ? "text-oro-claro" : "text-crema"
          }`}
        >
          {nombre}
        </p>
        {resultado === "gano" && (
          <span className="mt-0.5 rounded-full bg-oro px-2.5 py-[3px] font-cond text-[10px] font-bold uppercase tracking-[0.16em] text-noche">
            Ganó
          </span>
        )}
      </div>
    </div>
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
  const bloqueado = !activo || esperando || !abierto;
  // Con el ganador cargado la card deja de ser una votación y pasa a ser un
  // resultado: manda sobre cualquier otro estado.
  const ganador = activo ? (conteo?.ganador ?? null) : null;
  const acerto = ganador !== null && voto === ganador;

  return (
    <article
      className={`overflow-hidden rounded-sm border ${
        c.estelar ? "border-oro bg-oro-tinte" : "border-linea bg-carbon"
      }`}
    >
      {/* flex-wrap y tracking más corto en móvil: los tres rótulos juntos no
          entran en una card de 312 px y se salían del borde. */}
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 border-b border-linea bg-[#08080b] px-3 py-3 sm:px-7">
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
          ) : ganador ? (
            <>
              <span
                aria-hidden
                className="inline-block size-[7px] rounded-full bg-oro"
              />
              <span className="text-oro">Resultado final</span>
            </>
          ) : (
            <>
              <span
                aria-hidden
                className={`inline-block size-[7px] rounded-full ${
                  voto ? "bg-oro" : "bg-[#3a3a44]"
                }`}
              />
              <span className={voto ? "text-oro" : "text-tenue"}>
                {!abierto ? "Votación cerrada" : voto ? "Ya votaste" : "Votación abierta"}
              </span>
            </>
          )}
        </p>
      </header>

      <div className="flex items-center gap-2 px-3 py-5 sm:gap-5 sm:px-7 sm:py-6">
        <Lado
          nombre={c.a.nombre}
          foto={c.a.foto}
          pct={pctA}
          lidera={lideraA}
          izquierda
          resultado={
            ganador ? (ganador === "a" ? "gano" : "perdio") : undefined
          }
        />
        <span className="relative grid size-[42px] shrink-0 place-items-center sm:size-[68px]">
          <span
            aria-hidden
            className="absolute inset-0 rotate-45 rounded-[3px] border border-oro bg-noche/90"
          />
          <span className="relative font-display text-[13px] text-oro sm:text-[19px]">
            VS
          </span>
        </span>
        <Lado
          nombre={c.b.nombre}
          foto={c.b.foto}
          pct={pctA === null ? null : 100 - pctA}
          lidera={lideraB}
          izquierda={false}
          resultado={
            ganador ? (ganador === "b" ? "gano" : "perdio") : undefined
          }
        />
      </div>

      <div className="flex h-2.5 w-full overflow-hidden bg-[#2a2a31]">
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

      <footer className="bg-[#08080b] px-3 py-5 sm:px-7">
        {ganador ? (
          <div
            className={`flex flex-wrap items-center justify-between gap-3 rounded-sm border px-4 py-3 ${
              acerto ? "border-oro bg-[#1f1808]" : "border-linea bg-carbon"
            }`}
          >
            <p className="flex items-center gap-2.5 font-cond text-[13px] font-bold uppercase tracking-[0.12em] text-oro-claro">
              <span className="text-oro">
                <Trofeo className="size-[19px]" />
              </span>
              Ganó {ganador === "a" ? c.a.nombre : c.b.nombre}
            </p>
            {/* Sin voto no hay veredicto que dar: la card solo informa. */}
            {voto && (
              <span
                className={`font-cond text-[11px] font-bold uppercase tracking-[0.14em] ${
                  acerto ? "text-oro" : "text-tenue"
                }`}
              >
                {acerto ? "Acertaste" : `Votaste por ${voto === "a" ? c.a.nombre : c.b.nombre}`}
              </span>
            )}
          </div>
        ) : bloqueado ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(["a", "b"] as const).map((lado) => (
              <button
                key={lado}
                type="button"
                disabled
                title={
                  !activo
                    ? "La votación se habilita en la segunda fase"
                    : esperando
                      ? "Cargando la votación"
                      : "La votación de este combate ya cerró"
                }
                className="flex items-center justify-center gap-2 rounded-sm border border-linea px-3 py-3.5 text-center font-cond text-[12px] font-bold uppercase leading-tight tracking-[0.08em] text-tenue opacity-50"
              >
                <Candado />
                Votar por {c[lado].nombre}
              </button>
            ))}
          </div>
        ) : voto ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-oro bg-[#1f1808] px-4 py-3">
            <p className="flex items-center gap-2.5 font-cond text-[13px] font-bold uppercase tracking-[0.12em] text-oro-claro">
              <span className="text-oro">
                <IconoVoto />
              </span>
              Votaste por {voto === "a" ? c.a.nombre : c.b.nombre}
            </p>
            <button
              type="button"
              disabled={enviando}
              onClick={() => onVotar(voto)}
              className="cursor-pointer font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-tenue underline transition-colors hover:text-oro disabled:cursor-wait disabled:opacity-50"
            >
              Cambiar voto
            </button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {(["a", "b"] as const).map((lado) => (
              <button
                key={lado}
                type="button"
                disabled={enviando}
                onClick={() => onVotar(lado)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-oro-profundo px-3 py-3.5 text-center font-cond text-[12px] font-bold uppercase leading-tight tracking-[0.08em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte disabled:cursor-wait disabled:opacity-50"
              >
                <IconoVoto />
                Votar por {c[lado].nombre}
              </button>
            ))}
          </div>
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
      window.location.origin,
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
                : `Un voto por combate · Puedes cambiarlo hasta el ${EVENTO.fechaLarga.toLowerCase()} · Nadie ve a quién votaste`}
      </p>
    </div>
  );
}
