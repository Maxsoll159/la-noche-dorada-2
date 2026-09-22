"use client";

import { useState } from "react";
import { IconoRecargar } from "@/assets/icons";
import { COMBATES, PELEADORES, fichaDe } from "@/lib/evento";
import { NotaAprox } from "@/components/peleador/ficha-tape";
import { POR_SLUG, type Lado } from "./constantes";
import { Escenario } from "./escenario";
import { Ficha, FichaComparada } from "./fichas";
import { Parrilla } from "./parrilla";
import { RotuloCruce } from "./rotulo-cruce";
import { Turnos } from "./turnos";

export function CaraACara() {
  const [duelo, setDuelo] = useState({
    a: COMBATES[0].a.slug,
    b: COMBATES[0].b.slug,
  });
  const [turno, setTurno] = useState<Lado>("a");

  const izq = POR_SLUG.get(duelo.a) ?? COMBATES[0].a;
  const der = POR_SLUG.get(duelo.b) ?? COMBATES[0].b;

  const oficial =
    COMBATES.find(
      (c) =>
        (c.a.slug === izq.slug && c.b.slug === der.slug) ||
        (c.a.slug === der.slug && c.b.slug === izq.slug),
    ) ?? null;

  const elegir = (slug: string) => {
    setDuelo((prev) => {
      const ocupaLaOtra = turno === "a" ? prev.b === slug : prev.a === slug;
      if (ocupaLaOtra) return { a: prev.b, b: prev.a };
      return turno === "a" ? { a: slug, b: prev.b } : { a: prev.a, b: slug };
    });
    setTurno((t) => (t === "a" ? "b" : "a"));
  };

  const volverAlOficial = () => {
    const ficha = fichaDe(izq.slug);
    if (!ficha) return;
    setDuelo({ a: ficha.peleador.slug, b: ficha.rival.slug });
    setTurno("a");
  };

  const alAzar = () => {
    const uno = PELEADORES[Math.floor(Math.random() * PELEADORES.length)];
    const otros = PELEADORES.filter((p) => p.slug !== uno.slug);
    const dos = otros[Math.floor(Math.random() * otros.length)];
    setDuelo({ a: uno.slug, b: dos.slug });
    setTurno("a");
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative w-full overflow-hidden">
        <Escenario izq={izq} der={der} oficial={oficial} />

        <div className="relative z-20 -mt-12 px-2 pb-3 sm:-mt-20 sm:px-6 sm:pb-5 lg:pb-6">
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[calc((100%-800px)/2)] items-center justify-center lg:flex">
            <Ficha peleador={izq} lado="a" className="pointer-events-auto" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc((100%-800px)/2)] items-center justify-center lg:flex">
            <Ficha peleador={der} lado="b" className="pointer-events-auto" />
          </div>
          <Parrilla
            izq={izq}
            der={der}
            turno={turno}
            onElegir={elegir}
            onAzar={alAzar}
          />
          <div className="mt-3 sm:mt-4">
            <Turnos izq={izq} der={der} turno={turno} onTurno={setTurno} />
          </div>
          <div className="mt-3 sm:mt-4 lg:hidden">
            <FichaComparada
              izq={izq}
              der={der}
              clave={`${izq.slug}-${der.slug}`}
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <RotuloCruce
              oficial={oficial}
              izq={izq}
              der={der}
              className="w-fit rounded-sm border border-oro-profundo bg-oro-tinte px-3.5 py-1.5 text-center font-cond text-[11px] font-bold tracking-[0.18em] text-oro uppercase lg:hidden"
            />
            {!oficial && (
              <button
                type="button"
                onClick={volverAlOficial}
                className="flex w-fit cursor-pointer items-center gap-2 rounded-sm border border-oro-medio bg-noche px-4 py-2 font-cond text-[12px] font-bold tracking-[0.16em] text-oro-claro uppercase transition-colors hover:border-oro hover:bg-oro hover:text-noche"
              >
                <IconoRecargar size={12} strokeWidth={2.6} />
                Su combate real
              </button>
            )}
          </div>
        </div>
      </div>

      <NotaAprox />
    </div>
  );
}
