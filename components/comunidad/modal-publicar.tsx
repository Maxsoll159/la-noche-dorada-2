"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconoCerrar, IconoFlechaDerecha } from "@/assets/icons";
import { pedir } from "@/lib/api/cliente";
import type { PronosticoPublico, RespuestaPronostico } from "@/lib/api/tipos";
import { FormularioPublicar } from "./formulario-publicar";

// Desde la sección de Pronósticos: escribe la descripción, publica y lleva a
// la página del pronóstico en la comunidad.
export function ModalPublicar({ onCerrar }: { onCerrar: () => void }) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const [mio, setMio] = useState<PronosticoPublico | null | undefined>(
    undefined,
  );

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!el.open) el.showModal();
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  useEffect(() => {
    let vivo = true;
    pedir<RespuestaPronostico>("/api/comunidad/mio")
      .then((r) => {
        if (vivo) setMio(r.pronostico);
      })
      .catch(() => {
        if (vivo) setMio(null);
      });
    return () => {
      vivo = false;
    };
  }, []);

  return (
    <dialog
      ref={dialogo}
      aria-labelledby="titulo-publicar"
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
      className="m-auto w-[min(92vw,560px)] entrada rounded-sm border border-oro-profundo bg-carbon p-0 text-crema shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop:bg-noche/80 backdrop:backdrop-blur-sm"
    >
      <header className="flex items-start justify-between gap-4 border-b border-linea bg-[#08080b] px-5 py-4">
        <div className="min-w-0">
          <p
            id="titulo-publicar"
            className="font-display text-[20px] leading-tight text-oro-claro uppercase"
          >
            {mio ? "Actualiza tu publicación" : "Publica en la comunidad"}
          </p>
          <p className="mt-0.5 font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
            Tus votos de hoy, con una descripción si quieres
          </p>
        </div>
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar"
          className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-linea text-tenue transition-colors hover:border-oro hover:text-oro"
        >
          <IconoCerrar size={16} strokeWidth={2.4} />
        </button>
      </header>

      <div className="flex flex-col gap-4 px-5 py-5">
        {mio === undefined ? (
          <div className="h-[120px] animate-pulse rounded-sm bg-linea/40" />
        ) : (
          <FormularioPublicar
            idCampo="descripcion-pronostico-modal"
            mio={mio}
            onPublicado={(p) => router.push(`/comunidad/${p.id}`)}
          />
        )}
        <Link
          href="/comunidad"
          className="flex w-fit items-center gap-1.5 font-cond text-[11px] font-bold tracking-[0.14em] text-oro-medio uppercase transition-colors hover:text-oro"
        >
          Ver la comunidad
          <IconoFlechaDerecha size={12} strokeWidth={2.6} />
        </Link>
      </div>
    </dialog>
  );
}
