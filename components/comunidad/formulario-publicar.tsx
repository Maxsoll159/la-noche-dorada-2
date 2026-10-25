"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { IconoEnviar, IconoFlechaDerecha } from "@/assets/icons";
import { ErrorApi, mensajeDe, pedir } from "@/lib/api/cliente";
import {
  MAX_DESCRIPCION as MAXIMO,
  type PronosticoPublico,
  type RespuestaPronostico,
} from "@/lib/api/tipos";
import { marcarSinSesion } from "@/lib/sesion";

// Publica (o actualiza) el pronóstico propio con su descripción. El código
// de la quiniela lo arma el servidor con los votos reales.
export function FormularioPublicar({
  mio,
  onPublicado,
  onQuitado,
  idCampo = "descripcion-pronostico",
}: {
  mio: PronosticoPublico | null;
  onPublicado: (p: PronosticoPublico) => void;
  onQuitado?: () => void;
  idCampo?: string;
}) {
  const [texto, setTexto] = useState(mio?.descripcion ?? "");
  const [enviando, setEnviando] = useState(false);
  const [quitando, setQuitando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sinVotos, setSinVotos] = useState(false);

  const publicar = async (e: FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    setEnviando(true);
    setError(null);
    setSinVotos(false);
    try {
      const { pronostico } = await pedir<RespuestaPronostico>(
        "/api/comunidad",
        { method: "POST", json: { descripcion: texto.trim() || null } },
      );
      if (pronostico) onPublicado(pronostico);
    } catch (err) {
      if (err instanceof ErrorApi && err.status === 401) marcarSinSesion();
      if (err instanceof ErrorApi && err.status === 409) setSinVotos(true);
      setError(mensajeDe(err));
    } finally {
      setEnviando(false);
    }
  };

  const quitar = async () => {
    setQuitando(true);
    setError(null);
    try {
      await pedir<void>("/api/comunidad", { method: "DELETE" });
      setConfirmando(false);
      setTexto("");
      onQuitado?.();
    } catch (err) {
      if (err instanceof ErrorApi && err.status === 401) marcarSinSesion();
      setError(mensajeDe(err));
    } finally {
      setQuitando(false);
    }
  };

  const usados = texto.length;

  return (
    <form onSubmit={publicar} className="flex flex-col gap-3">
      <label htmlFor={idCampo} className="sr-only">
        Descripción de tus pronósticos
      </label>
      <textarea
        id={idCampo}
        value={texto}
        onChange={(e) => setTexto(e.target.value.slice(0, MAXIMO))}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey))
            e.currentTarget.form?.requestSubmit();
        }}
        maxLength={MAXIMO}
        rows={3}
        placeholder="Gente, estos son mis pronósticos…"
        className="field-sizing-content min-h-[84px] w-full resize-none rounded-sm border border-linea bg-noche/70 px-4 py-3 text-[15px] leading-relaxed text-crema placeholder:text-tenue/70 focus:border-oro-profundo focus:outline-none sm:text-[16px]"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="h-1 w-24 overflow-hidden rounded-full bg-linea sm:w-32"
          >
            <span
              style={{ width: `${(usados / MAXIMO) * 100}%` }}
              className={`block h-full rounded-full transition-[width] duration-200 ${
                usados > MAXIMO - 40 ? "bg-oro-claro" : "bg-oro-profundo"
              }`}
            />
          </span>
          <span
            className={`font-cond text-[11px] font-semibold tracking-[0.1em] tabular-nums ${
              usados > MAXIMO - 40 ? "text-oro" : "text-tenue"
            }`}
          >
            {usados}/{MAXIMO}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {mio &&
            onQuitado &&
            (confirmando ? (
              <span className="flex items-center gap-3 font-cond text-[11px] font-bold tracking-[0.14em] uppercase">
                <span className="text-tenue">¿Quitar tu publicación?</span>
                <button
                  type="button"
                  disabled={quitando}
                  onClick={quitar}
                  className="cursor-pointer rounded-sm border border-[#7a2b2b] px-2.5 py-1 text-[#ffb4b4] transition-colors hover:bg-[#7a2b2b] hover:text-white disabled:cursor-wait disabled:opacity-50"
                >
                  Sí, quitar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="cursor-pointer text-tenue transition-colors hover:text-crema"
                >
                  Cancelar
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="cursor-pointer font-cond text-[11px] font-bold tracking-[0.14em] text-tenue uppercase transition-colors hover:text-oro"
              >
                Quitar publicación
              </button>
            ))}
          <button
            type="submit"
            disabled={enviando}
            className="group flex shrink-0 cursor-pointer items-center gap-2 rounded-sm bg-oro px-5 py-2.5 font-cond text-[13px] font-bold tracking-[0.14em] text-noche uppercase shadow-[0_8px_22px_-8px_rgba(212,175,55,0.6)] transition-colors hover:bg-oro-claro disabled:cursor-wait disabled:opacity-60"
          >
            {enviando
              ? "Publicando…"
              : mio
                ? "Actualizar publicación"
                : "Publicar en la comunidad"}
            <IconoEnviar
              size={15}
              strokeWidth={2.2}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>
      </div>

      {error && (
        <p
          role="status"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-4 py-2.5 font-cond text-[12px] font-semibold tracking-[0.1em] text-[#ffb4b4] uppercase"
        >
          {error}
          {sinVotos && (
            <Link
              href="/#pronosticos"
              className="flex items-center gap-1 text-oro underline underline-offset-2 transition-colors hover:text-oro-claro"
            >
              Ir a votar
              <IconoFlechaDerecha size={12} strokeWidth={2.6} />
            </Link>
          )}
        </p>
      )}
    </form>
  );
}
