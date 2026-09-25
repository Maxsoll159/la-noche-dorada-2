"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconoCandado,
  IconoCompartir,
  IconoTrofeo,
  LogoGoogle,
} from "@/assets/icons";
import { COMBATES, EVENTO, PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { puntaje, useVotacion } from "@/lib/votacion";
import { codigoDeVotos, textoCompartir } from "@/lib/compartir";
import { BotonGoogle } from "./boton-google";
import { CardPronostico } from "./card-pronostico";
import { ModalCompartir } from "./modal-compartir";

export function Pronosticos() {
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
    entrar,
    salir,
  } = useVotacion(activo);
  const [compartiendo, setCompartiendo] = useState(false);

  const hechos = Object.keys(votos).length;
  const { resueltos, aciertos, aciertosMetodo } = puntaje(
    conteos,
    votos,
    metodos,
  );
  const hayResultados = resueltos > 0;
  const textoPuntaje = `Acertaste ${aciertos} de ${resueltos} combates resueltos${
    aciertosMetodo > 0
      ? ` · ${aciertosMetodo} ${aciertosMetodo === 1 ? "método" : "métodos"}`
      : ""
  }`;

  const codigo = codigoDeVotos(votos, metodos);

  return (
    <div className="flex w-full flex-col items-center gap-7">
      {!activo ? (
        <div className="flex w-full flex-col items-center gap-4 rounded-sm border border-oro-profundo bg-oro-tinte px-4 py-6 text-center sm:flex-row sm:gap-5 sm:px-7 sm:py-8 sm:text-left">
          <span className="text-oro">
            <IconoCandado className="size-[26px] shrink-0" />
          </span>
          <div className="flex-1">
            <p className="font-display text-[19px] leading-tight text-oro-claro uppercase sm:text-[22px]">
              La votación abre en la segunda fase
            </p>
            <p className="font-cond text-[12px] font-semibold tracking-[0.12em] text-tenue uppercase sm:text-[13px] sm:tracking-[0.14em]">
              Podrás elegir a tu favorito en los ocho combates y compartirlo
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-oro bg-noche/60 px-4 py-2 font-cond text-[11px] font-bold tracking-[0.2em] text-oro uppercase">
            Próximamente
          </span>
        </div>
      ) : !usuario ? (
        <div className="relative isolate w-full overflow-hidden rounded-md border border-oro-profundo bg-[linear-gradient(135deg,#1f180a_0%,#120f09_45%,#0d0c0b_100%)] shadow-[0_24px_60px_-30px_rgba(212,175,55,0.6)]">
          <span aria-hidden className="marco-vivo">
            <span className="marco-vivo-haz" />
          </span>
          <span
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-[420px] -translate-x-1/2 respirar rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.22),rgba(212,175,55,0))] lg:left-24"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgba(212,175,55,0.03)_0_1px,transparent_1px_12px)]"
          />

          <div className="flex flex-col items-center gap-5 px-5 py-7 text-center sm:px-8 sm:py-9 lg:flex-row lg:gap-8 lg:text-left">
            <span className="relative grid size-16 shrink-0 place-items-center sm:size-[72px]">
              <span
                aria-hidden
                className="absolute inset-0 rotate-45 rounded-[6px] border border-oro bg-[linear-gradient(135deg,#2a2010_0%,#0b0b0d_75%)] shadow-[0_0_28px_rgba(212,175,55,0.35)]"
              />
              <IconoTrofeo size={30} className="relative text-oro-claro" />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <p className="font-display text-[26px] leading-[1.05] text-crema uppercase sm:text-[34px]">
                Arma tus pronósticos{" "}
                <span className="relative inline-block overflow-hidden">
                  <span className="texto-oro drop-shadow-[0_0_18px_rgba(212,175,55,0.45)]">
                    y compártelos
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 brillo-boton bg-gradient-to-r from-transparent via-white/35 to-transparent"
                  />
                </span>
              </p>
              <p className="font-cond text-[12px] font-semibold tracking-[0.12em] text-tenue uppercase sm:text-[13px] sm:tracking-[0.14em]">
                Entra con Google y elige a tu favorito en los ocho combates
              </p>
            </div>

            <div className="relative shrink-0">
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1.5 latido rounded-md bg-oro/25 blur-md"
              />
              <div className="relative">
                <BotonGoogle onClick={entrar}>Entrar con Google</BotonGoogle>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-4">
          <div className="flex w-full flex-col items-center gap-5 rounded-sm border border-oro-profundo bg-oro-tinte px-4 py-5 sm:px-7 sm:py-6 lg:flex-row lg:gap-9">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <span className="shrink-0 text-oro">
                <IconoTrofeo size={30} />
              </span>
              <div>
                <p className="font-display text-[19px] leading-tight text-oro-claro uppercase sm:text-[22px]">
                  {hayResultados ? "Tu puntaje" : "Tus pronósticos"}
                </p>
                <p className="font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase sm:tracking-[0.16em]">
                  {hayResultados
                    ? textoPuntaje
                    : `${hechos} de ${COMBATES.length} combates elegidos`}
                </p>
              </div>
            </div>
            <ol className="flex w-full flex-1 items-center gap-1.5" aria-hidden>
              {COMBATES.map((c) => {
                const conteo = conteos[c.n];
                const fallado =
                  conteo?.resuelto &&
                  votos[c.n] &&
                  votos[c.n] !== conteo.ganador;
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
              onClick={() => setCompartiendo(true)}
              disabled={hechos === 0}
              className="flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-sm bg-oro px-6 py-3.5 font-cond text-[13px] font-bold tracking-[0.14em] text-noche uppercase transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-10 sm:py-3"
            >
              <IconoCompartir
                size={15}
                strokeWidth={2.2}
                className="shrink-0"
              />
              Compartir
            </button>
          </div>

          <p className="flex flex-wrap items-center justify-end gap-3 font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
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
          className="w-full rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-5 py-3 text-center font-cond text-[13px] font-semibold tracking-[0.12em] text-[#ffb4b4] uppercase"
        >
          {error}
        </p>
      )}

      {activo && !cargando && (
        <p className="-mb-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
          <span>Toca un lado para votar</span>
          {!usuario && (
            <span className="flex items-center gap-1.5 text-oro-medio">
              <LogoGoogle className="size-[12px] shrink-0" />
              Te pediremos entrar con Google
            </span>
          )}
        </p>
      )}

      <div className="grid w-full gap-4 sm:gap-5 lg:grid-cols-2">
        {COMBATES.map((c) => (
          <CardPronostico
            key={c.n}
            c={c}
            conteo={conteos[c.n]}
            voto={votos[c.n]}
            metodo={metodos[c.n]}
            enviando={enviando === c.n}
            enviandoMetodo={enviandoMetodo === c.n}
            onVotar={(lado) => votar(c.n, lado)}
            onMetodo={(m) => elegirMetodo(c.n, m)}
          />
        ))}
      </div>

      <p className="text-center font-cond text-[12px] font-semibold tracking-[0.2em] text-oro-medio uppercase">
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

      {compartiendo && (
        <ModalCompartir
          codigo={codigo}
          texto={textoCompartir({
            votos,
            metodos,
            resultados: conteos,
            aciertos,
            resueltos,
          })}
          resumen={
            hayResultados
              ? textoPuntaje
              : `${hechos} de ${COMBATES.length} combates elegidos`
          }
          onCerrar={() => setCompartiendo(false)}
        />
      )}
    </div>
  );
}
