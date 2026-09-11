"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BANDERAS, COMBATES, PELEADORES, type Peleador } from "@/lib/evento";
import { Bandera } from "./bandera";
import { FichaTape, NotaAprox } from "./ficha-tape";

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
    // Toda la foto es el enlace a la ficha. Alto fijo en vez de proporción:
    // el recorte de origen es muy vertical (250x470) y con la proporción
    // exacta el panel se volvía altísimo.
    <Link
      href={`/peleadores/${peleador.slug}`}
      aria-label={`Ver la ficha de ${peleador.nombre}`}
      className={`group relative block h-[290px] overflow-hidden bg-[#0e0e12] sm:h-[410px] lg:h-[460px] ${
        // Sin el VS en el medio, la línea dorada es la que dice que estos dos
        // se enfrentan; en escritorio ese trabajo lo hace la columna central.
        esIzq ? "border-r border-oro-profundo lg:border-r-0" : ""
      }`}
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_42%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
      />
      {/* El nodo con `key` tiene que ser HIJO ÚNICO de su envoltorio: si
          convive con hermanos sin key, React no da de baja el anterior y los
          peleadores se van apilando uno encima de otro a cada cambio.
          La key remonta el nodo y eso vuelve a disparar la animación. */}
      <div className="absolute inset-0">
      <span key={peleador.slug} className="cambio absolute inset-0">
      <Image
        src={peleador.cuerpo ?? peleador.foto}
        alt={peleador.nombre}
        fill
        sizes="(min-width: 1024px) 420px, 100vw"
        // Los recortes ya salen normalizados desde el script: misma proporción,
        // silueta centrada y apoyada al pie. Por eso alcanza object-contain,
        // sin scale ni ajustes por foto — antes un scale fijo le cortaba la
        // cabeza a los que ya venían llenos de cuadro.
        // El brillo compensa que son tomas de estudio muy oscuras.
        className={`transition-transform duration-500 group-hover:scale-[1.04] ${
          peleador.cuerpo
            ? "object-contain object-bottom brightness-125 contrast-[1.06] saturate-105"
            : "object-cover object-top brightness-110"
        }`}
      />
      </span>
      </div>
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
      {/* Haz dorado barriendo el marco. Va en su propio contenedor porque la
          máscara recorta al contorno y el degradado gira dentro de ella. */}
      <span aria-hidden className="marco-vivo">
        <span className="marco-vivo-haz" />
      </span>
      <span aria-hidden className="marco-vivo">
        <span className="marco-vivo-haz marco-vivo-opuesto" />
      </span>
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
      {/* Mismo motivo que arriba: el nodo con key va solo. */}
      <div className="absolute inset-x-3 bottom-3.5 sm:inset-x-5 sm:bottom-6">
      <div
        key={peleador.slug}
        className={`cambio-texto flex flex-col gap-1.5 sm:gap-2 ${
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
        {/* Ya no es un enlace: el enlace es el panel entero. Se pinta como
            botón para que se vea que la foto lleva a algún sitio. */}
        <span className="mt-1 flex items-center gap-2 rounded-sm border border-oro bg-oro-tinte px-3 py-1.5 font-cond text-[10px] font-bold uppercase tracking-[0.14em] text-oro transition-colors duration-300 group-hover:bg-oro group-hover:text-noche sm:px-3.5 sm:py-2 sm:text-[11px]">
          Ver ficha
          <svg
            aria-hidden
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
      </div>
    </Link>
  );
}

export function CaraACara() {
  // Guardamos el combate, no dos peleadores sueltos: al elegir a cualquiera
  // se arma automáticamente el enfrentamiento oficial con su contrincante.
  const [numero, setNumero] = useState(COMBATES[0].n);
  const combate = COMBATES.find((c) => c.n === numero) ?? COMBATES[0];

  return (
    <div className="flex w-full flex-col items-center gap-11">
      <div className="flex w-full flex-col gap-4">
        {/* En móvil la columna central no entra en la rejilla: el VS y la
            ficha salen de ahí, y la ficha reaparece completa justo debajo. */}
        <div className="grid w-full grid-cols-2 overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12] lg:grid-cols-[1fr_auto_1fr] lg:border-linea">
          <Panel peleador={combate.a} lado="izq" />

          <div className="hidden flex-col items-center justify-center gap-4 border-linea px-5 py-7 lg:flex lg:w-[292px] lg:border-x">
            {/* El VS no lleva key: es lo único que no cambia entre combates y
                reanimarlo solo haría parpadear el centro del panel. */}
            <p className="font-display text-[56px] leading-none texto-oro">VS</p>
            <div className="w-full">
            <div
              key={combate.n}
              className="cambio-texto flex w-full flex-col items-center gap-4"
            >
              <p className="text-center font-cond text-[10px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                {combate.billing ?? `Combate ${combate.n}`} · 3 rounds
              </p>
              <FichaTape combate={combate} />
              <NotaAprox />
            </div>
            </div>
          </div>

          <Panel peleador={combate.b} lado="der" />
        </div>

        {/* La misma ficha en móvil. El dato existe para 12 de los 16 y hasta
            ahora solo aparecía a partir de lg, que es justo donde NO está la
            mayor parte del tráfico de un evento como este. */}
        <div className="lg:hidden">
          <div
            key={combate.n}
            className="cambio-texto flex flex-col items-center gap-2.5"
          >
            <p className="text-center font-cond text-[10px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
              {combate.billing ?? `Combate ${combate.n}`} · 3 rounds
            </p>
            <FichaTape combate={combate} />
            <NotaAprox />
          </div>
        </div>
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
