"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BANDERAS,
  COMBATES,
  EVENTO,
  PELEADORES,
  edadEn,
  type Peleador,
} from "@/lib/evento";
import { Bandera } from "./bandera";

/** Coma decimal: la ficha se lee en español. */
const coma = (n: number, decimales: number) =>
  n.toFixed(decimales).replace(".", ",");

const marca = (p: Peleador) => (p.aprox ? "*" : "");

/**
 * Cada fila devuelve null cuando el dato no está publicado y la tabla pinta el
 * guion.
 */
const FILAS_TAPE: {
  etiqueta: string;
  valor: (p: Peleador) => string | null;
}[] = [
  {
    etiqueta: "Edad",
    valor: (p) =>
      p.nacimiento ? `${edadEn(p.nacimiento, EVENTO.inicioISO)}` : null,
  },
  {
    etiqueta: "Altura",
    valor: (p) => (p.altura ? `${coma(p.altura, 2)} m${marca(p)}` : null),
  },
  {
    etiqueta: "Peso",
    valor: (p) => (p.peso ? `${coma(p.peso, 1)} kg${marca(p)}` : null),
  },
];

/** Hay alturas y pesos que no salen de una balanza: se marcan con asterisco. */
const HAY_APROX = PELEADORES.some((p) => p.aprox);

/** slug de cada peleador -> número del combate en el que pelea */
const COMBATE_DE = new Map(
  COMBATES.flatMap((c) => [
    [c.a.slug, c.n],
    [c.b.slug, c.n],
  ]),
);

function Panel({ peleador, lado }: { peleador: Peleador; lado: "izq" | "der" }) {
  const esIzq = lado === "izq";
  return (
    // Alto fijo en vez de proporción: el recorte de origen es muy vertical
    // (250x470) y con la proporción exacta el panel se volvía altísimo.
    <div
      className={`relative h-[290px] overflow-hidden bg-[#0e0e12] sm:h-[410px] lg:h-[460px] ${
        // Sin el VS en el medio, la línea dorada es la que dice que estos dos
        // se enfrentan; en escritorio ese trabajo lo hace la columna central.
        esIzq ? "border-r border-oro-profundo lg:border-r-0" : ""
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_42%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
      />
      <Image
        key={peleador.slug}
        src={peleador.cuerpo ?? peleador.foto}
        alt={peleador.nombre}
        fill
        sizes="(min-width: 1024px) 420px, 100vw"
        // Los recortes ya salen normalizados desde el script: misma proporción,
        // silueta centrada y apoyada al pie. Por eso alcanza object-contain,
        // sin scale ni ajustes por foto — antes un scale fijo le cortaba la
        // cabeza a los que ya venían llenos de cuadro.
        // El brillo compensa que son tomas de estudio muy oscuras.
        className={
          peleador.cuerpo
            ? "object-contain object-bottom brightness-125 contrast-[1.06] saturate-105"
            : "object-cover object-top brightness-110"
        }
      />
      {/* Transparente a la altura de la cara y profundo al pie: ahí es donde
          la figura se disuelve, y necesita negro real para camuflar el corte. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.2)_0%,transparent_22%,transparent_56%,rgba(11,11,13,0.5)_76%,rgba(11,11,13,0.95)_100%)]"
      />
      <div
        aria-hidden
        className={`absolute inset-0 ${
          esIzq
            ? "bg-gradient-to-r from-transparent via-transparent to-[#0e0e12]/60"
            : "bg-gradient-to-l from-transparent via-transparent to-[#0e0e12]/60"
        }`}
      />
      {/* Marca del evento como sello en la esquina, por encima del recorte:
          detrás del peleador se transparentaba sobre la ropa oscura. */}
      <Image
        src="/marca/logo-noche-dorada.webp"
        alt=""
        aria-hidden
        width={455}
        height={406}
        sizes="90px"
        className="pointer-events-none absolute left-2.5 top-2.5 w-[42px] opacity-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] sm:left-4 sm:top-4 sm:w-[60px] lg:w-[72px]"
      />
      <div
        className={`absolute inset-x-3 bottom-3.5 flex flex-col gap-1.5 sm:inset-x-5 sm:bottom-6 sm:gap-2 ${
          esIzq ? "items-start" : "items-end"
        }`}
      >
        <p className="flex items-center gap-1.5 rounded-sm border border-oro-profundo bg-noche/80 px-2 py-1 font-cond text-[9px] font-bold uppercase tracking-[0.14em] text-oro sm:gap-2 sm:px-2.5 sm:text-[10px]">
          <Bandera
            pais={peleador.pais}
            className="h-2.5 w-[15px] sm:h-3 sm:w-[19px]"
          />
          {BANDERAS[peleador.pais].nombre}
        </p>
        <h3
          className={`text-[16px] leading-none text-crema sm:text-[26px] lg:text-[33px] ${
            esIzq ? "text-left" : "text-right"
          }`}
        >
          {peleador.nombre}
        </h3>
        <span aria-hidden className="h-[3px] w-8 bg-oro sm:w-11" />
      </div>
    </div>
  );
}

export function CaraACara() {
  // Guardamos el combate, no dos peleadores sueltos: al elegir a cualquiera
  // se arma automáticamente el enfrentamiento oficial con su contrincante.
  const [numero, setNumero] = useState(COMBATES[0].n);
  const combate = COMBATES.find((c) => c.n === numero) ?? COMBATES[0];

  return (
    <div className="flex w-full flex-col items-center gap-11">
      {/* En móvil quedan solo los dos peleadores enfrentados: el VS y la tabla
          se esconden porque a ese ancho la ficha ocupaba más que las fotos. */}
      <div className="grid w-full grid-cols-2 overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12] lg:grid-cols-[1fr_auto_1fr] lg:border-linea">
        <Panel peleador={combate.a} lado="izq" />

        <div className="hidden flex-col items-center justify-center gap-4 border-linea px-5 py-7 lg:flex lg:w-[292px] lg:border-x">
          <p className="font-display text-[56px] leading-none texto-oro">VS</p>
          <p className="text-center font-cond text-[10px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
            {combate.billing ?? `Combate ${combate.n}`} · 3 rounds
          </p>

          <dl className="w-full overflow-hidden rounded-sm border border-linea">
            {FILAS_TAPE.map((fila, i) => (
              <div
                key={fila.etiqueta}
                className={`flex items-center gap-2 px-3 py-1.5 ${
                  i % 2 === 0 ? "bg-[#131318]" : "bg-[#0f0f14]"
                } ${i < FILAS_TAPE.length - 1 ? "border-b border-linea" : ""}`}
              >
                {/* El dato conocido va en crema; el guion se queda apagado */}
                <dd
                  className={`flex-1 text-left font-display text-[15px] ${
                    fila.valor(combate.a) ? "text-crema" : "text-tenue"
                  }`}
                >
                  {fila.valor(combate.a) ?? "—"}
                </dd>
                <dt className="w-[74px] text-center font-cond text-[9px] font-bold uppercase tracking-[0.16em] text-oro">
                  {fila.etiqueta}
                </dt>
                <dd
                  className={`flex-1 text-right font-display text-[15px] ${
                    fila.valor(combate.b) ? "text-crema" : "text-tenue"
                  }`}
                >
                  {fila.valor(combate.b) ?? "—"}
                </dd>
              </div>
            ))}
          </dl>

          <p className="text-center font-cond text-[9px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-oro-profundo">
            {HAY_APROX
              ? "* Dato no oficial · El pesaje de la velada manda"
              : "Altura y peso del último pesaje oficial"}
          </p>
        </div>

        <Panel peleador={combate.b} lado="der" />
      </div>

      <div className="flex w-full flex-col items-center gap-5">
        <p className="text-center font-cond text-[12px] font-bold uppercase tracking-[0.26em] text-oro-profundo">
          Toca un peleador para ver su combate
        </p>
        {/* Hasta lg: los 16 en una sola línea con scroll lateral, con
            degradados a los costados que avisan que la tira sigue. En
            escritorio vuelven a las dos filas centradas, y el max-w fuerza
            8 por fila: sin el tope quedaban 13 en la primera y 3 en la otra. */}
        <div className="relative w-full">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-noche to-transparent lg:hidden"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-noche to-transparent lg:hidden"
          />
          <ul className="tira mx-auto flex w-full items-start gap-2.5 px-6 pb-3.5 sm:gap-3 lg:max-w-[644px] lg:flex-wrap lg:justify-center lg:px-0 lg:pb-0">
            {PELEADORES.map((p) => {
              const sel = COMBATE_DE.get(p.slug) === numero;
              return (
                <li
                  key={p.slug}
                  className="w-[62px] shrink-0 snap-center sm:w-[70px]"
                >
                  <button
                    type="button"
                    onClick={() => setNumero(COMBATE_DE.get(p.slug) ?? numero)}
                    aria-pressed={sel}
                    className="flex w-full cursor-pointer flex-col items-center gap-2 outline-none"
                  >
                    <span
                      className={`relative block aspect-[3/4] w-full overflow-hidden rounded-sm border transition ${
                        sel
                          ? "border-2 border-oro opacity-100"
                          : "border-linea opacity-55 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={p.foto}
                        alt=""
                        fill
                        sizes="70px"
                        className="object-cover object-top"
                      />
                    </span>
                    <span
                      className={`text-center font-cond text-[10px] font-semibold uppercase leading-tight tracking-[0.04em] ${
                        sel ? "text-oro" : "text-tenue"
                      }`}
                    >
                      {p.nombre}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
