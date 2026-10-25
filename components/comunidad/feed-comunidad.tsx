"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { IconoFlechaDerecha, IconoPersonas, IconoTrofeo } from "@/assets/icons";
import { pedir } from "@/lib/api/cliente";
import {
  ORDENES_COMUNIDAD,
  type OrdenComunidad,
  type PronosticoPublico,
  type RespuestaComunidad,
  type RespuestaPronostico,
} from "@/lib/api/tipos";
import { PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { iniciarSesion, useUsuario } from "@/lib/sesion";
import { BotonesAcceso } from "@/components/pronosticos/boton-acceso";
import { FormularioPublicar } from "./formulario-publicar";
import { TarjetaPronostico } from "./tarjeta-pronostico";

const ETIQUETA: Record<OrdenComunidad, string> = {
  recientes: "Recientes",
  populares: "Populares",
  comentados: "Más comentados",
};

const numero = new Intl.NumberFormat("es-PE");

function Esqueleto() {
  return (
    <ul aria-hidden className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex animate-pulse flex-col gap-4 rounded-md border border-linea bg-carbon p-5"
        >
          <span className="flex items-center gap-3">
            <span className="size-11 rounded-full bg-linea" />
            <span className="h-3 w-1/2 rounded-full bg-linea" />
          </span>
          <span className="h-3 w-full rounded-full bg-linea/70" />
          <span className="grid grid-cols-8 gap-1">
            {Array.from({ length: 8 }, (_, j) => (
              <span
                key={j}
                className="aspect-[3/4] rounded-[3px] bg-linea/60"
              />
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Bloque de arriba: invita a entrar, a publicar o muestra la publicación
// propia para actualizarla o quitarla.
function Publicar({
  mio,
  listoMio,
  onCambio,
}: {
  mio: PronosticoPublico | null;
  listoMio: boolean;
  onCambio: (p: PronosticoPublico | null) => void;
}) {
  const { usuario, listo } = useUsuario();

  return (
    <div
      id="publicar"
      className="relative isolate scroll-mt-28 overflow-hidden rounded-md border border-oro-profundo bg-[linear-gradient(135deg,#1f180a_0%,#120f09_45%,#0d0c0b_100%)] p-4 shadow-[0_24px_60px_-30px_rgba(212,175,55,0.6)] sm:p-6"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgba(212,175,55,0.03)_0_1px,transparent_1px_12px)]"
      />
      {!listo || (usuario && !listoMio) ? (
        <div className="h-[92px] animate-pulse rounded-sm bg-linea/40" />
      ) : !usuario ? (
        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:text-left">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-oro-profundo bg-noche/60 text-oro">
            <IconoTrofeo size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-[20px] leading-tight tracking-wide text-crema uppercase sm:text-[24px]">
              Publica tus pronósticos
            </p>
            <p className="mt-1 font-cond text-[12px] font-semibold tracking-[0.12em] text-tenue uppercase">
              Entra con Google o Discord, vota y comparte tu quiniela con la
              comunidad
            </p>
          </div>
          <BotonesAcceso
            onEntrar={(proveedor) => iniciarSesion(proveedor, "/comunidad")}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p className="font-display text-[20px] leading-tight tracking-wide text-crema uppercase sm:text-[24px]">
              {mio ? "Tu pronóstico está publicado" : "Publica tus pronósticos"}
            </p>
            {mio ? (
              <Link
                href={`/comunidad/${mio.id}`}
                className="flex items-center gap-1.5 font-cond text-[11px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:text-oro-claro"
              >
                Ver mi publicación
                <IconoFlechaDerecha size={12} strokeWidth={2.6} />
              </Link>
            ) : (
              <Link
                href="/#pronosticos"
                className="flex items-center gap-1.5 font-cond text-[11px] font-bold tracking-[0.14em] text-oro-medio uppercase transition-colors hover:text-oro"
              >
                Revisar mis votos
                <IconoFlechaDerecha size={12} strokeWidth={2.6} />
              </Link>
            )}
          </div>
          <p className="-mt-2 font-cond text-[12px] font-semibold tracking-[0.12em] text-tenue uppercase">
            {mio
              ? "Si cambiaste votos, al actualizar se publican los nuevos"
              : "Se publican los votos que ya hiciste, con una descripción si quieres"}
          </p>
          <FormularioPublicar
            key={mio?.id ?? "nuevo"}
            mio={mio}
            onPublicado={onCambio}
            onQuitado={() => onCambio(null)}
          />
        </div>
      )}
    </div>
  );
}

export function FeedComunidad() {
  const { usuario, listo } = useUsuario();
  const [orden, setOrden] = useState<OrdenComunidad>("recientes");
  const [pronosticos, setPronosticos] = useState<PronosticoPublico[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mio, setMio] = useState<PronosticoPublico | null>(null);
  const [listoMio, setListoMio] = useState(false);

  const cargar = useCallback(
    async (desde: number) => {
      try {
        const r = await pedir<RespuestaComunidad>(
          `/api/comunidad?orden=${orden}&desde=${desde}`,
        );
        setTotal(r.total);
        setHayMas(r.hayMas);
        setPronosticos((prev) => {
          if (desde === 0) return r.pronosticos;
          const vistos = new Set(prev.map((p) => p.id));
          return [...prev, ...r.pronosticos.filter((p) => !vistos.has(p.id))];
        });
        setError(null);
      } catch {
        setError("No pudimos cargar la comunidad. Recarga la página.");
      }
    },
    [orden],
  );

  // La primera página se pide cuando ya se sabe si hay sesión, para que
  // venga con `propio` y la reacción de cada uno. Cambiar el orden la repite.
  const idUsuario = usuario?.id;
  useEffect(() => {
    if (!listo) return;
    let vivo = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCargando(true);
    cargar(0).then(() => {
      if (vivo) setCargando(false);
    });
    return () => {
      vivo = false;
    };
  }, [cargar, listo, idUsuario]);

  useEffect(() => {
    if (!listo) return;
    if (!idUsuario) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMio(null);
      setListoMio(true);
      return;
    }
    let vivo = true;
    setListoMio(false);
    pedir<RespuestaPronostico>("/api/comunidad/mio")
      .then((r) => {
        if (vivo) setMio(r.pronostico);
      })
      .catch(() => {
        if (vivo) setMio(null);
      })
      .finally(() => {
        if (vivo) setListoMio(true);
      });
    return () => {
      vivo = false;
    };
  }, [listo, idUsuario]);

  const alCambiarMio = (p: PronosticoPublico | null) => {
    setMio(p);
    cargar(0);
  };

  const verMas = async () => {
    setCargandoMas(true);
    await cargar(pronosticos.length);
    setCargandoMas(false);
  };

  return (
    <div className="flex w-full flex-col gap-8">
      {PRONOSTICOS_ACTIVOS && (
        <Publicar mio={mio} listoMio={listoMio} onCambio={alCambiarMio} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="flex items-center gap-2.5 font-display text-[20px] tracking-wide text-crema uppercase sm:text-[22px]">
          <span className="text-oro">
            <IconoPersonas size={22} />
          </span>
          {total === null
            ? "Pronósticos publicados"
            : `${numero.format(total)} ${total === 1 ? "pronóstico publicado" : "pronósticos publicados"}`}
        </p>
        <div
          role="tablist"
          aria-label="Ordenar"
          className="flex flex-wrap gap-1.5"
        >
          {ORDENES_COMUNIDAD.map((o) => {
            const activo = o === orden;
            return (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={activo}
                onClick={() => setOrden(o)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 font-cond text-[11px] leading-none font-bold tracking-[0.14em] uppercase transition-colors ${
                  activo
                    ? "border-oro bg-oro text-noche"
                    : "border-linea bg-noche/60 text-tenue hover:border-oro-profundo hover:text-oro"
                }`}
              >
                {ETIQUETA[o]}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p
          role="status"
          className="rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-4 py-2.5 text-center font-cond text-[12px] font-semibold tracking-[0.1em] text-[#ffb4b4] uppercase"
        >
          {error}
        </p>
      )}

      {cargando ? (
        <Esqueleto />
      ) : pronosticos.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-oro-profundo/60 px-6 py-12 text-center">
          <span className="text-oro-profundo">
            <IconoTrofeo size={36} strokeWidth={1.5} />
          </span>
          <p className="font-display text-[22px] tracking-wide text-crema uppercase">
            Todavía nadie publicó sus pronósticos
          </p>
          <p className="font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
            Sé la primera persona en compartir tu quiniela
          </p>
        </div>
      ) : (
        <>
          <ul
            aria-label="Pronósticos de la comunidad"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {pronosticos.map((p) => (
              <li key={p.id}>
                <TarjetaPronostico p={p} />
              </li>
            ))}
          </ul>
          {hayMas && (
            <button
              type="button"
              onClick={verMas}
              disabled={cargandoMas}
              className="mx-auto cursor-pointer rounded-sm border border-oro-profundo px-6 py-2.5 font-cond text-[12px] font-bold tracking-[0.16em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte disabled:cursor-wait disabled:opacity-60"
            >
              {cargandoMas ? "Cargando…" : "Ver más pronósticos"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
