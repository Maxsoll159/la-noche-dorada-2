"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  COMBATES,
  PRONOSTICOS_ACTIVOS,
  type Combate,
} from "@/lib/evento";

const CLAVE = "nd2:quiniela";
type Votos = Record<string, "a" | "b">;

const inicial: Votos = PRONOSTICOS_ACTIVOS
  ? Object.fromEntries(
      COMBATES.filter((c) => c.votado).map((c) => [c.n, c.votado!]),
    )
  : {};

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

function Trofeo() {
  return (
    <svg
      aria-hidden
      width="30"
      height="30"
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

function Lado({
  nombre,
  foto,
  pct,
  lidera,
  izquierda,
}: {
  nombre: string;
  foto: string;
  pct: number | null;
  lidera: boolean;
  izquierda: boolean;
}) {
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
        className={`relative block h-[96px] w-[52px] shrink-0 overflow-hidden rounded-sm border sm:h-[128px] sm:w-[68px] ${
          lidera ? "border-2 border-oro" : "border-linea opacity-70"
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
            lidera ? "text-oro" : "text-tenue"
          }`}
        >
          {pct === null ? "—" : `${pct}%`}
        </p>
        <p
          className={`w-full font-display text-[13px] uppercase leading-tight break-words hyphens-auto sm:text-[20px] ${
            lidera ? "text-oro-claro" : "text-crema"
          }`}
        >
          {nombre}
        </p>
      </div>
    </div>
  );
}

function Card({
  c,
  voto,
  onVotar,
}: {
  c: Combate;
  voto?: "a" | "b";
  onVotar: (lado: "a" | "b") => void;
}) {
  const activo = PRONOSTICOS_ACTIVOS;

  // El voto propio mueve la barra 2 puntos hacia el elegido, para que la
  // interacción se sienta sin falsear el conteo de la comunidad.
  const pctA = Math.min(
    98,
    Math.max(2, c.pctA + (voto === "a" ? 2 : voto === "b" ? -2 : 0)),
  );
  // Bloqueado no hay conteo que mostrar: barra al centro y porcentajes en raya.
  const anchoA = activo ? pctA : 50;

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
          {activo ? (
            <>
              <span
                aria-hidden
                className={`inline-block size-[7px] rounded-full ${
                  voto ? "bg-oro" : "bg-[#3a3a44]"
                }`}
              />
              <span className={voto ? "text-oro" : "text-tenue"}>
                {voto ? "Ya votaste" : "Votación abierta"}
              </span>
            </>
          ) : (
            <span className="text-oro-profundo">Próximamente</span>
          )}
        </p>
      </header>

      <div className="flex items-center gap-2 px-3 py-5 sm:gap-5 sm:px-7 sm:py-6">
        <Lado
          nombre={c.a.nombre}
          foto={c.a.foto}
          pct={activo ? pctA : null}
          lidera={activo && pctA >= 50}
          izquierda
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
          pct={activo ? 100 - pctA : null}
          lidera={activo && pctA < 50}
          izquierda={false}
        />
      </div>

      <div className="flex h-2.5 w-full overflow-hidden bg-[#2a2a31]">
        <span
          style={{ width: `${anchoA}%` }}
          className={`block transition-[width] duration-500 ${
            !activo
              ? "bg-[#3a3a44]"
              : pctA >= 50
                ? "bg-gradient-to-r from-oro-profundo to-oro-claro"
                : "bg-[#3a3a44]"
          }`}
        />
        <span
          className={`block flex-1 transition-[width] duration-500 ${
            !activo
              ? "bg-[#2a2a31]"
              : pctA < 50
                ? "bg-gradient-to-l from-oro-profundo to-oro-claro"
                : "bg-[#3a3a44]"
          }`}
        />
      </div>

      <footer className="bg-[#08080b] px-3 py-5 sm:px-7">
        {!activo ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {(["a", "b"] as const).map((lado) => (
              <button
                key={lado}
                type="button"
                disabled
                title="La votación se habilita en la segunda fase"
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
              onClick={() => onVotar(voto)}
              className="cursor-pointer font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-tenue underline transition-colors hover:text-oro"
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
                onClick={() => onVotar(lado)}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-oro-profundo px-3 py-3.5 text-center font-cond text-[12px] font-bold uppercase leading-tight tracking-[0.08em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte"
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
  const [votos, setVotos] = useState<Votos>(inicial);

  // La quiniela vive en el navegador hasta que exista backend de votación.
  useEffect(() => {
    if (!activo) return;
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setVotos(JSON.parse(guardado));
    } catch {
      /* modo privado o storage bloqueado: seguimos con el estado inicial */
    }
  }, [activo]);

  const votar = (n: string, lado: "a" | "b") => {
    if (!activo) return;
    setVotos((prev) => {
      const siguiente = { ...prev };
      if (siguiente[n] === lado) delete siguiente[n];
      else siguiente[n] = lado;
      try {
        localStorage.setItem(CLAVE, JSON.stringify(siguiente));
      } catch {
        /* sin persistencia disponible */
      }
      return siguiente;
    });
  };

  const hechos = Object.keys(votos).length;

  return (
    <div className="flex w-full flex-col items-center gap-7">
      {activo ? (
        <div className="flex w-full flex-col items-center gap-6 rounded-sm border border-oro-profundo bg-oro-tinte px-7 py-6 lg:flex-row lg:gap-9">
          <div className="flex items-center gap-4">
            <span className="text-oro">
              <Trofeo />
            </span>
            <div>
              <p className="font-display text-[22px] uppercase leading-tight text-oro-claro">
                Tu quiniela
              </p>
              <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.16em] text-tenue">
                {hechos} de {COMBATES.length} combates pronosticados
              </p>
            </div>
          </div>
          <ol className="flex flex-1 items-center gap-1.5" aria-hidden>
            {COMBATES.map((c) => (
              <li
                key={c.n}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  votos[c.n] ? "bg-oro" : "bg-[#2a2a31]"
                }`}
              />
            ))}
          </ol>
          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-oro px-6 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.14em] text-noche transition-colors hover:bg-oro-claro"
          >
            Compartir quiniela
          </button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-5 rounded-sm border border-oro-profundo bg-oro-tinte px-7 py-8 text-center sm:flex-row sm:text-left">
          <span className="text-oro">
            <Candado />
          </span>
          <div className="flex-1">
            <p className="font-display text-[22px] uppercase leading-tight text-oro-claro">
              La votación abre en la segunda fase
            </p>
            <p className="font-cond text-[13px] font-semibold uppercase tracking-[0.14em] text-tenue">
              Podrás armar tu quiniela de los ocho combates y compartirla
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-oro bg-noche/60 px-4 py-2 font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro">
            Próximamente
          </span>
        </div>
      )}

      <div className="grid w-full gap-5 lg:grid-cols-2">
        {COMBATES.map((c) => (
          <Card
            key={c.n}
            c={c}
            voto={votos[c.n]}
            onVotar={(lado) => votar(c.n, lado)}
          />
        ))}
      </div>

      <p className="text-center font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-oro-profundo">
        {activo
          ? "Porcentajes de demostración · La votación real se activa al publicar · Un voto por combate"
          : "Los pronósticos de la comunidad se habilitan en la segunda fase del sitio"}
      </p>
    </div>
  );
}
