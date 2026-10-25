"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  IconoComentario,
  IconoCompartir,
  IconoFlechaDerecha,
} from "@/assets/icons";
import { pedir } from "@/lib/api/cliente";
import type { PronosticoPublico, RespuestaPronostico } from "@/lib/api/tipos";
import {
  metodosDeCodigo,
  textoCompartir,
  votosDeCodigo,
} from "@/lib/compartir";
import { COMBATES, EVENTO } from "@/lib/evento";
import { ModalCompartir } from "@/components/pronosticos/modal-compartir";
import { Reacciones } from "./reacciones";

// Reacciones y compartir en el detalle. El servidor pinta el pronóstico con
// los contadores públicos; aquí se pide la versión con sesión para saber si
// es propio y qué reacción tiene la persona.
export function AccionesPronostico({
  inicial,
}: {
  inicial: PronosticoPublico;
}) {
  const [p, setP] = useState(inicial);
  const [compartiendo, setCompartiendo] = useState(false);

  useEffect(() => {
    let vivo = true;
    pedir<RespuestaPronostico>(`/api/comunidad/${inicial.id}`)
      .then((r) => {
        if (vivo && r.pronostico) setP(r.pronostico);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, [inicial.id]);

  const votos = votosDeCodigo(p.codigo) ?? {};
  const metodos = metodosDeCodigo(p.codigo) ?? {};
  const hechos = Object.keys(votos).length;

  // Mucha gente no baja: el botón lleva al formulario y lo deja listo para
  // escribir (o al bloque de entrar, si no hay sesión).
  const irAComentar = () => {
    const seccion = document.getElementById("comentarios");
    if (!seccion) return;
    seccion.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => {
      seccion.querySelector<HTMLTextAreaElement>("textarea")?.focus({
        preventScroll: true,
      });
    }, 650);
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <Reacciones
        id={p.id}
        meGusta={p.meGusta}
        noMeGusta={p.noMeGusta}
        reaccion={p.reaccion}
      />
      <div className="flex flex-wrap items-center gap-3">
        {p.propio && (
          <Link
            href="/comunidad#publicar"
            className="flex items-center gap-1.5 font-cond text-[11px] font-bold tracking-[0.14em] text-oro-medio uppercase transition-colors hover:text-oro"
          >
            Editar mi publicación
            <IconoFlechaDerecha size={12} strokeWidth={2.6} />
          </Link>
        )}
        <button
          type="button"
          onClick={irAComentar}
          className="group relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-sm border border-oro bg-oro-tinte px-5 py-2.5 font-cond text-[12px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:bg-oro hover:text-noche"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 brillo-boton bg-gradient-to-r from-transparent via-oro-claro/40 to-transparent group-hover:hidden"
          />
          <IconoComentario size={14} strokeWidth={2.2} className="relative" />
          <span className="relative">
            {p.comentarios === 0
              ? "Sé el primero en comentar"
              : `Comentar · ${p.comentarios}`}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setCompartiendo(true)}
          className="flex cursor-pointer items-center gap-2 rounded-sm bg-oro px-5 py-2.5 font-cond text-[12px] font-bold tracking-[0.14em] text-noche uppercase transition-colors hover:bg-oro-claro"
        >
          <IconoCompartir size={14} strokeWidth={2.2} />
          Compartir
        </button>
      </div>

      {/* Va al body: el encabezado crea su propio contexto de apilamiento y
          el modal quedaría debajo de lo que viene después en la página. */}
      {compartiendo &&
        createPortal(
          <ModalCompartir
            codigo={p.codigo}
            ruta={`/comunidad/${p.id}`}
            texto={textoCompartir({
              votos,
              metodos,
              encabezado: p.propio
                ? `Mis pronósticos para ${EVENTO.nombre}:`
                : `Los pronósticos de ${p.autor_nombre} para ${EVENTO.nombre}:`,
            })}
            resumen={`${hechos} de ${COMBATES.length} combates elegidos`}
            onCerrar={() => setCompartiendo(false)}
          />,
          document.body,
        )}
    </div>
  );
}
