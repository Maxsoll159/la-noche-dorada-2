import Image from "next/image";
import {
  IconoCalendario,
  IconoChevronAbajo,
  IconoExterno,
  IconoPin,
  IconoReloj,
} from "@/assets/icons";
import { EVENTO, PREVENTAS } from "@/lib/evento";
import { CuentaRegresiva } from "@/components/ui/cuenta-regresiva";

const BRASAS: readonly {
  x: string;
  s: number;
  dur: string;
  ret: string;
  deriva: string;
}[] = [
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

const META = [
  { Icono: IconoCalendario, texto: EVENTO.fechaLarga.toUpperCase() },
  { Icono: IconoReloj, texto: EVENTO.hora.toUpperCase() },
  { Icono: IconoPin, texto: `${EVENTO.sede.toUpperCase()} · LIMA` },
];

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-30">
        <Image
          src="/cartel-oficial-v2.webp"
          alt=""
          fill
          loading="eager"
          sizes="100vw"
          style={{ objectPosition: "center 25%" }}
          className="zoom-lento object-cover opacity-85"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
      >
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
            className="absolute -bottom-2 brasa rounded-full bg-oro-claro shadow-[0_0_8px_2px_rgba(247,227,161,0.55)]"
          />
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-noche/90 via-noche/80 to-noche"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(11,11,13,0.9)_0%,rgba(11,11,13,0.7)_45%,rgba(11,11,13,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 respirar bg-[radial-gradient(45%_40%_at_50%_40%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_100%)]"
      />

      <div className="mx-auto flex w-full max-w-contenido flex-1 flex-col items-center justify-center gap-4 px-6 pt-28 pb-14 text-center sm:gap-5 sm:pt-32 sm:pb-16 lg:gap-3 lg:px-14 lg:pt-28 lg:pb-20">
        <p
          style={{ animationDelay: "180ms" }}
          className="flex entrada items-center gap-2.5 font-cond text-[12px] font-semibold tracking-[0.22em] whitespace-nowrap text-oro uppercase sm:gap-3.5 sm:text-[13px] sm:tracking-[0.38em]"
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
          preload
          style={{ animationDelay: "260ms, 1110ms" }}
          className="w-[72%] max-w-[520px] entrada-flotante drop-shadow-[0_18px_60px_rgba(0,0,0,0.6)] sm:w-full lg:max-w-[400px]"
        />

        <p
          style={{ animationDelay: "420ms" }}
          className="entrada font-cond text-[15px] leading-snug font-semibold tracking-[0.22em] text-oro-claro uppercase sm:text-[17px] sm:tracking-[0.3em]"
        >
          16 creadores · 8 combates
          <span aria-hidden className="hidden sm:inline">
            {" "}
            ·{" "}
          </span>
          <span className="block sm:inline">Una sola noche</span>
        </p>

        <ul
          style={{ animationDelay: "520ms" }}
          className="flex entrada flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6 sm:gap-y-3 sm:pt-1"
        >
          {META.map((m, i) => (
            <li key={m.texto} className="flex items-center gap-6">
              {i > 0 && (
                <span
                  aria-hidden
                  className="hidden h-3.5 w-px bg-linea sm:block"
                />
              )}
              <span className="flex items-center gap-2 font-cond text-[13px] font-semibold tracking-[0.08em] uppercase sm:text-[15px] sm:tracking-[0.09em]">
                <span className="text-oro">
                  <m.Icono size={17} />
                </span>
                {m.texto}
              </span>
            </li>
          ))}
        </ul>

        <div
          style={{ animationDelay: "620ms" }}
          className="flex w-full entrada flex-col items-center gap-3 pt-4"
        >
          <p className="flex items-center gap-3 font-cond text-[11px] font-semibold tracking-[0.3em] text-oro-medio uppercase">
            <span aria-hidden className="h-px w-6 bg-oro-profundo" />
            Faltan
            <span aria-hidden className="h-px w-6 bg-oro-profundo" />
          </p>
          <CuentaRegresiva inicioISO={EVENTO.inicioISO} />
        </div>

        <p
          style={{ animationDelay: "660ms" }}
          className="flex entrada items-center gap-2.5 rounded-full border border-oro-profundo/70 bg-noche/60 px-4 py-2 font-cond text-[11px] font-bold tracking-[0.16em] text-oro uppercase backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="inline-block size-[7px] latido rounded-full bg-oro shadow-[0_0_10px_rgba(212,175,55,0.9)]"
          />
          {PREVENTAS.actual.nombre} abierta
          <span className="hidden text-tenue sm:inline">
            · hasta el {PREVENTAS.actual.hasta}
          </span>
        </p>

        <div
          style={{ animationDelay: "700ms" }}
          className="flex w-full entrada items-stretch gap-3 pt-1 sm:w-auto sm:items-center"
        >
          <a
            href={EVENTO.entradasUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2.5 rounded-sm bg-oro px-4 py-3.5 font-cond text-[13px] font-bold tracking-[0.12em] text-noche uppercase shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro sm:flex-none sm:px-8 sm:py-4 sm:text-[15px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">Entradas</span>
            <span className="hidden sm:inline">Comprar entradas</span>
            <IconoExterno size={17} strokeWidth={2.2} />
          </a>
          <a
            href="#pronosticos"
            className="flex flex-1 items-center justify-center rounded-sm border border-oro-profundo px-4 py-3.5 font-cond text-[13px] font-bold tracking-[0.12em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte sm:flex-none sm:px-8 sm:py-4 sm:text-[15px] sm:tracking-[0.14em]"
          >
            <span className="sm:hidden">Pronósticos</span>
            <span className="hidden sm:inline">Armar mis pronósticos</span>
          </a>
        </div>
      </div>

      <div className="hidden lg:absolute lg:bottom-5 lg:left-1/2 lg:block lg:-translate-x-1/2">
        <a
          href="#combates"
          style={{ animationDelay: "820ms" }}
          className="group flex entrada flex-col items-center gap-1.5 font-cond text-[11px] font-semibold tracking-[0.28em] text-oro-medio uppercase transition-colors hover:text-oro"
        >
          Desliza para ver la cartelera
          <IconoChevronAbajo size={20} className="flotar text-oro" />
        </a>
      </div>
    </section>
  );
}
