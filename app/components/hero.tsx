import Image from "next/image";
import { EVENTO, PREVENTAS } from "@/lib/evento";
import { CuentaRegresiva } from "./cuenta-regresiva";

/**
 * Brasas doradas del fondo. Posición, tamaño, duración, retardo y deriva
 * lateral fijos (no aleatorios) para que servidor y navegador pinten lo
 * mismo. Quince alcanzan para dar atmósfera sin ensuciar el logo.
 */
const BRASAS: readonly { x: string; s: number; dur: string; ret: string; deriva: string }[] = [
  { x: "4%", s: 3, dur: "13s", ret: "0s", deriva: "18px" },
  { x: "11%", s: 2, dur: "17s", ret: "3s", deriva: "-14px" },
  { x: "19%", s: 4, dur: "15s", ret: "7s", deriva: "22px" },
  { x: "27%", s: 2, dur: "19s", ret: "1s", deriva: "-8px" },
  { x: "34%", s: 3, dur: "14s", ret: "9s", deriva: "12px" },
  { x: "42%", s: 2, dur: "21s", ret: "5s", deriva: "-20px" },
  { x: "50%", s: 3, dur: "16s", ret: "11s", deriva: "6px" },
  { x: "57%", s: 2, dur: "18s", ret: "2s", deriva: "-16px" },
  { x: "64%", s: 4, dur: "13s", ret: "8s", deriva: "24px" },
  { x: "71%", s: 2, dur: "20s", ret: "4s", deriva: "-10px" },
  { x: "78%", s: 3, dur: "15s", ret: "12s", deriva: "14px" },
  { x: "85%", s: 2, dur: "17s", ret: "6s", deriva: "-22px" },
  { x: "91%", s: 3, dur: "14s", ret: "10s", deriva: "8px" },
  { x: "96%", s: 2, dur: "19s", ret: "13s", deriva: "-12px" },
  { x: "47%", s: 2, dur: "22s", ret: "15s", deriva: "16px" },
];

// Fecha y hora primero: en móvil comparten línea y la sede baja a la segunda.
const META = [
  { icono: "calendario", texto: EVENTO.fechaLarga.toUpperCase() },
  { icono: "reloj", texto: EVENTO.hora.toUpperCase() },
  { icono: "pin", texto: `${EVENTO.sede.toUpperCase()} · LIMA` },
];

function Icono({ nombre }: { nombre: string }) {
  const comun = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (nombre === "calendario")
    return (
      <svg {...comun}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </svg>
    );
  if (nombre === "pin")
    return (
      <svg {...comun}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  return (
    <svg {...comun}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function Hero() {
  return (
    // min-h-svh: el hero ocupa la pantalla entera (la primera vista es solo
    // él) y el contenido se centra en ese alto. Si en una pantalla baja no
    // entra, crece y se hace scroll: nunca se recorta.
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* Cartel oficial de fondo, encuadrado para que su propio logo quede
          fuera del recorte y no compita con el logo del hero. */}
      <div aria-hidden className="absolute inset-0 -z-30">
        <Image
          src="/cartel-oficial.webp"
          alt=""
          fill
          // Next 16 retiró `priority`: el cartel carga con prioridad normal
          // pero sin diferir, y el `preload` se reserva para el logo, que es
          // el LCP real.
          loading="eager"
          sizes="100vw"
          // El 25% deja fuera la fila de nombres del cartel (arriba) y su
          // propio lettering (abajo); queda solo la banda de peleadores.
          style={{ objectPosition: "center 25%" }}
          // zoom-lento: el cartel respira en un ciclo de casi un minuto.
          className="zoom-lento object-cover opacity-85"
        />
      </div>
      {/* Brasas subiendo desde el pie del hero, entre el cartel y el velo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        {BRASAS.map((b, i) => (
          <span
            key={i}
            style={
              {
                left: b.x,
                width: b.s,
                height: b.s,
                "--dur": b.dur,
                "--retardo": b.ret,
                "--deriva": b.deriva,
              } as React.CSSProperties
            }
            className="brasa absolute -bottom-2 rounded-full bg-oro-claro shadow-[0_0_8px_2px_rgba(247,227,161,0.55)]"
          />
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-noche/90 via-noche/80 to-noche"
      />
      {/* Sombra radial que despega el logo del fondo y resplandor dorado */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(11,11,13,0.9)_0%,rgba(11,11,13,0.7)_45%,rgba(11,11,13,0)_100%)]"
      />
      <div
        aria-hidden
        className="respirar absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_40%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_100%)]"
      />

      {/* El pt deja libre la altura del header fijo (88 px) */}
      {/* En móvil todo va más apretado: el hero medía 1060 px y el primer
          botón quedaba fuera de la pantalla. */}
      <div className="mx-auto flex w-full max-w-contenido flex-1 flex-col items-center justify-center gap-4 px-6 pt-28 pb-14 text-center sm:gap-5 sm:pt-32 sm:pb-16 lg:gap-3 lg:px-14 lg:pt-28 lg:pb-20">
        {/* El hero está sobre el pliegue, así que entra con animación y retardo
            escalonado en vez de esperar al observador de scroll. */}
        {/* whitespace-nowrap y filetes cortos en móvil: a 390 px la línea se
            partía en dos con los filetes colgando a los lados. */}
        <p
          style={{ animationDelay: "180ms" }}
          className="entrada flex items-center gap-2.5 whitespace-nowrap font-cond text-[12px] font-semibold uppercase tracking-[0.22em] text-oro sm:gap-3.5 sm:text-[13px] sm:tracking-[0.38em]"
        >
          <span aria-hidden className="h-px w-6 bg-oro-profundo sm:w-16" />
          {EVENTO.edicion} · Lima, Perú
          <span aria-hidden className="h-px w-6 bg-oro-profundo sm:w-16" />
        </p>

        <h1 className="sr-only">
          {EVENTO.nombre} — {EVENTO.fechaLarga} en el {EVENTO.sede}
        </h1>
        <Image
          src="/marca/logo-noche-dorada.webp"
          alt={EVENTO.nombre}
          width={455}
          height={406}
          // Es el LCP de la home: se precarga desde el <head>.
          preload
          // Dos retardos: el de la entrada y el del flotado, que arranca
          // recién cuando la entrada termina (260ms + 850ms).
          style={{ animationDelay: "260ms, 1110ms" }}
          // En lg el tope baja a 400: con 520 el hero pasaba de los 900 px de
          // alto de un portátil y los botones quedaban bajo el pliegue.
          className="entrada-flotante w-[72%] max-w-[520px] drop-shadow-[0_18px_60px_rgba(0,0,0,0.6)] sm:w-full lg:max-w-[400px]"
        />

        {/* En móvil el lema parte en dos líneas a propósito, por el segundo
            punto: si se dejaba al azar, el punto quedaba huérfano al final de
            la primera línea. */}
        <p
          style={{ animationDelay: "420ms" }}
          className="entrada font-cond text-[15px] font-semibold uppercase leading-snug tracking-[0.22em] text-oro-claro sm:text-[17px] sm:tracking-[0.3em]"
        >
          16 creadores · 8 combates
          <span aria-hidden className="hidden sm:inline">
            {" "}·{" "}
          </span>
          <span className="block sm:inline">Una sola noche</span>
        </p>

        <ul
          style={{ animationDelay: "520ms" }}
          className="entrada flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-3 sm:pt-1"
        >
          {META.map((m, i) => (
            <li key={m.texto} className="flex items-center gap-6">
              {i > 0 && (
                <span aria-hidden className="hidden h-3.5 w-px bg-linea sm:block" />
              )}
              <span className="flex items-center gap-2 font-cond text-[13px] font-semibold uppercase tracking-[0.08em] sm:text-[15px] sm:tracking-[0.09em]">
                <span className="text-oro">
                  <Icono nombre={m.icono} />
                </span>
                {m.texto}
              </span>
            </li>
          ))}
        </ul>

        <div
          style={{ animationDelay: "620ms" }}
          className="entrada flex w-full flex-col items-center gap-3 pt-4"
        >
          <p className="flex items-center gap-3 font-cond text-[11px] font-semibold uppercase tracking-[0.3em] text-oro-medio">
            <span aria-hidden className="h-px w-6 bg-oro-profundo" />
            Faltan
            <span aria-hidden className="h-px w-6 bg-oro-profundo" />
          </p>
          <CuentaRegresiva inicioISO={EVENTO.inicioISO} />
        </div>

        {/* Estado de la venta, con pulso: es el dato que empuja a comprar
            hoy y no mañana. Sale de PREVENTAS, el mismo origen de la tabla
            de precios. */}
        <p
          style={{ animationDelay: "660ms" }}
          className="entrada flex items-center gap-2.5 rounded-full border border-oro-profundo/70 bg-noche/60 px-4 py-2 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro backdrop-blur-sm"
        >
          <span aria-hidden className="latido inline-block size-[7px] rounded-full bg-oro shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
          {PREVENTAS.actual.nombre} abierta
          <span className="hidden text-tenue sm:inline">
            · hasta el {PREVENTAS.actual.hasta}
          </span>
        </p>

        {/* Llamadas a la acción en el propio hero: en móvil la compra vivía
            solo dentro del menú y no había nada que tocar sobre el pliegue. */}
        <div
          style={{ animationDelay: "700ms" }}
          className="entrada flex w-full items-stretch gap-3 pt-1 sm:w-auto sm:items-center"
        >
          {/* A media anchura cada uno en móvil: apilados sumaban 120 px. */}
          <a
            href={EVENTO.entradasUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2.5 rounded-sm bg-oro px-4 py-3.5 font-cond text-[13px] font-bold uppercase tracking-[0.12em] text-noche shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro sm:flex-none sm:px-8 sm:py-4 sm:text-[15px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">Entradas</span>
            <span className="hidden sm:inline">Comprar entradas</span>
            <svg
              aria-hidden
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
          <a
            href="#pronosticos"
            className="flex flex-1 items-center justify-center rounded-sm border border-oro-profundo px-4 py-3.5 font-cond text-[13px] font-bold uppercase tracking-[0.12em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte sm:flex-none sm:px-8 sm:py-4 sm:text-[15px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">Pronósticos</span>
            <span className="hidden sm:inline">Armar mis pronósticos</span>
          </a>
        </div>

      </div>

      {/* Indicador de scroll, solo en escritorio y pegado al borde inferior
          de la pantalla. Va en un envoltorio propio porque `entrada` anima
          transform y pisaría el centrado horizontal del enlace. */}
      <div className="hidden lg:absolute lg:bottom-5 lg:left-1/2 lg:block lg:-translate-x-1/2">
        <a
          href="#combates"
          style={{ animationDelay: "820ms" }}
          className="entrada group flex flex-col items-center gap-1.5 font-cond text-[11px] font-semibold uppercase tracking-[0.28em] text-oro-medio transition-colors hover:text-oro"
        >
          Desliza para ver la cartelera
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="flotar text-oro"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
