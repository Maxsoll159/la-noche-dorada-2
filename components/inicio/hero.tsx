import Image from "next/image";
import {
  IconoCalendario,
  IconoChevronAbajo,
  IconoExterno,
  IconoPin,
  IconoReloj,
} from "@/assets/icons";
import { EVENTO, PREVENTAS } from "@/lib/evento";
import { LOGO } from "@/lib/imagenes";
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
          quality={50}
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
        className="absolute inset-0 -z-20 bg-gradient-to-b from-noche/90 via-noche/80 to-noche sm:from-noche/85 sm:via-noche/65"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(46%_58%_at_50%_52%,rgba(11,11,13,0.9)_0%,rgba(11,11,13,0.65)_55%,rgba(11,11,13,0)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 respirar bg-[radial-gradient(45%_40%_at_50%_40%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_100%)]"
      />

      <div className="mx-auto flex w-full max-w-contenido flex-1 flex-col items-center justify-center gap-6 px-6 pt-28 pb-14 text-center sm:gap-7 sm:pt-32 sm:pb-16 lg:gap-6 lg:px-14 lg:pt-28 lg:pb-20">
        <h1 className="sr-only">
          {EVENTO.nombre} — {EVENTO.fechaLarga} en el {EVENTO.sede}
        </h1>
        <Image
          {...LOGO}
          alt={EVENTO.nombre}
          preload
          fetchPriority="high"
          style={{ animationDelay: "180ms, 1030ms" }}
          className="w-[72%] max-w-[520px] entrada-flotante drop-shadow-[0_18px_60px_rgba(0,0,0,0.6)] sm:w-full lg:max-w-[400px]"
        />

        <div
          style={{ animationDelay: "380ms" }}
          className="flex entrada flex-col items-center gap-3 sm:gap-3.5"
        >
          <p className="font-cond text-[15px] leading-snug font-semibold tracking-[0.22em] text-oro-claro uppercase sm:text-[17px] sm:tracking-[0.3em]">
            16 creadores · 8 combates
            <span aria-hidden className="hidden sm:inline">
              {" "}
              ·{" "}
            </span>
            <span className="block sm:inline">Una sola noche</span>
          </p>

          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-x-6">
            {META.map((m, i) => (
              <li key={m.texto} className="flex items-center gap-6">
                {i > 0 && (
                  <span
                    aria-hidden
                    className="hidden h-3.5 w-px bg-linea sm:block"
                  />
                )}
                <span className="flex items-center gap-2 font-cond text-[13px] font-semibold tracking-[0.08em] text-crema/90 uppercase sm:text-[15px] sm:tracking-[0.09em]">
                  <span className="text-oro">
                    <m.Icono size={17} />
                  </span>
                  {m.texto}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={{ animationDelay: "540ms" }} className="w-full entrada">
          <CuentaRegresiva inicioISO={EVENTO.inicioISO} />
        </div>

        <div
          style={{ animationDelay: "680ms" }}
          className="flex w-full entrada flex-col items-center gap-3"
        >
          <div className="flex w-full items-stretch gap-3 sm:w-auto sm:items-center">
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
              className="flex flex-1 items-center justify-center rounded-sm border border-oro/70 bg-noche/60 px-4 py-3.5 font-cond text-[13px] font-bold tracking-[0.12em] text-oro-claro uppercase backdrop-blur-sm transition-colors hover:border-oro hover:bg-oro-tinte sm:flex-none sm:px-8 sm:py-4 sm:text-[15px] sm:tracking-[0.14em]"
            >
              <span className="sm:hidden">Pronósticos</span>
              <span className="hidden sm:inline">Armar mis pronósticos</span>
            </a>
          </div>
          <p className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.16em] text-oro-medio uppercase">
            <span
              aria-hidden
              className="inline-block size-[6px] latido rounded-full bg-oro shadow-[0_0_10px_rgba(212,175,55,0.9)]"
            />
            {PREVENTAS.actual.nombre} abierta
            <span className="text-tenue">
              · hasta el {PREVENTAS.actual.hasta}
            </span>
          </p>
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
