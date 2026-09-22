"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconoExterno } from "@/assets/icons";
import { EVENTO, NAV } from "@/lib/evento";

function Etiqueta({
  children,
  esquina = false,
}: {
  children: string;
  esquina?: boolean;
}) {
  return (
    <span
      className={`rounded-full border border-oro-profundo bg-oro-tinte px-2 py-[3px] font-cond text-[11px] leading-none font-bold tracking-[0.12em] whitespace-nowrap text-oro uppercase ${
        esquina ? "absolute -top-5 -right-10" : ""
      }`}
    >
      {children}
    </span>
  );
}

export function SiteHeader() {
  const [bajando, setBajando] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const barra = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let encolado = false;

    const pintar = () => {
      encolado = false;
      setBajando(window.scrollY > 24);

      const el = barra.current;
      if (!el) return;
      const alcance =
        document.documentElement.scrollHeight - window.innerHeight;
      const hecho = alcance > 0 ? Math.min(1, window.scrollY / alcance) : 0;
      el.style.transform = `scaleX(${hecho})`;
    };

    const alSc = () => {
      if (encolado) return;
      encolado = true;
      requestAnimationFrame(pintar);
    };

    pintar();
    window.addEventListener("scroll", alSc, { passive: true });
    window.addEventListener("resize", alSc, { passive: true });
    return () => {
      window.removeEventListener("scroll", alSc);
      window.removeEventListener("resize", alSc);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTecla);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTecla);
    };
  }, [abierto]);

  const opaco = bajando || abierto;

  return (
    <>
      <div
        aria-hidden
        onClick={() => setAbierto(false)}
        className={`fixed inset-0 z-40 bg-noche/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          opaco
            ? "border-linea bg-noche/95 backdrop-blur"
            : "border-transparent bg-transparent"
        }`}
      >
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-noche/80 to-transparent transition-opacity duration-300 ${
            opaco ? "opacity-0" : "opacity-100"
          }`}
        />

        <div className="relative mx-auto flex max-w-contenido items-center justify-between gap-6 px-6 py-3 lg:px-14">
          <Link
            href="/"
            className="shrink-0"
            aria-label={EVENTO.nombre}
            onClick={() => setAbierto(false)}
          >
            <Image
              src="/marca/logo-noche-dorada.webp"
              alt={EVENTO.nombre}
              width={455}
              height={406}
              loading="eager"
              sizes="72px"
              className="h-14 w-auto lg:h-16"
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative font-cond text-[14px] font-semibold tracking-[0.1em] text-tenue uppercase transition-colors hover:text-oro xl:text-[15px] xl:tracking-[0.11em]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={EVENTO.entradasUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 rounded-sm bg-oro px-5 py-2.5 font-cond text-[14px] font-bold tracking-[0.13em] text-noche uppercase transition-colors hover:bg-oro-claro lg:block"
          >
            Comprar entradas
          </a>

          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            className="grid size-11 cursor-pointer place-items-center rounded-sm border border-linea text-oro transition-colors hover:border-oro lg:hidden"
          >
            <span className="relative block h-4 w-6">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  aria-hidden
                  className={`absolute left-0 block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                    abierto
                      ? i === 1
                        ? "top-1/2 -translate-y-1/2 opacity-0"
                        : `top-1/2 -translate-y-1/2 ${i === 0 ? "rotate-45" : "-rotate-45"}`
                      : i === 0
                        ? "top-0"
                        : i === 1
                          ? "top-1/2 -translate-y-1/2"
                          : "bottom-0"
                  }`}
                />
              ))}
            </span>
          </button>
        </div>

        <span
          ref={barra}
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-oro-profundo via-oro to-oro-claro"
        />

        <div
          id="menu-movil"
          hidden={!abierto}
          className="border-t border-linea bg-noche lg:hidden"
        >
          <nav className="mx-auto flex max-w-contenido flex-col px-6 py-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className="flex items-center gap-2.5 border-b border-linea/70 py-4 font-cond text-[17px] font-semibold tracking-[0.12em] text-crema uppercase transition-colors last:border-0 hover:text-oro"
              >
                {item.label}
                {item.tag && <Etiqueta>{item.tag}</Etiqueta>}
              </a>
            ))}
            <a
              href={EVENTO.entradasUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setAbierto(false)}
              className="my-4 flex items-center justify-center gap-2 rounded-sm bg-oro px-5 py-4 font-cond text-[15px] font-bold tracking-[0.13em] text-noche uppercase"
            >
              Comprar entradas
              <IconoExterno size={17} strokeWidth={2.2} />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
