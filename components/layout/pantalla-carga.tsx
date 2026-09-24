"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties } from "react";
import { CLAVE_INTRO } from "@/lib/carga";
import { EVENTO } from "@/lib/evento";
import { LOGO } from "@/lib/imagenes";

const MINIMO = 1600;
const MAXIMO = 6000;
const SALIDA = 900;

const TELON = "duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)]";

function Cielo() {
  return (
    <>
      <span className="carga-fondo absolute inset-0" />
      <span className="carga-estrellas" />
      <span className="carga-estrellas carga-estrellas-titilan" />
      <span className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,rgba(11,11,13,0)_0%,rgba(11,11,13,0.55)_70%,rgba(11,11,13,0.9)_100%)]" />
    </>
  );
}

export function PantallaCarga() {
  const [fase, setFase] = useState<"cargando" | "saliendo" | "fin">("cargando");
  const [mascara, setMascara] = useState<string | null>(null);

  useEffect(() => {
    const raiz = document.documentElement;
    if (!("cargando" in raiz.dataset)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFase("fin");
      return;
    }

    const inicio = performance.now();
    let salida: ReturnType<typeof setTimeout> | undefined;
    let fin: ReturnType<typeof setTimeout> | undefined;

    const terminar = () => {
      window.removeEventListener("load", listo);
      clearTimeout(tope);
      try {
        sessionStorage.setItem(CLAVE_INTRO, "1");
      } catch {}
      setFase("saliendo");
      delete raiz.dataset.cargando;
      fin = setTimeout(() => setFase("fin"), SALIDA);
    };

    const listo = () => {
      const falta = Math.max(0, MINIMO - (performance.now() - inicio));
      salida = setTimeout(terminar, falta);
    };

    const tope = setTimeout(terminar, MAXIMO);
    if (document.readyState === "complete") listo();
    else window.addEventListener("load", listo, { once: true });

    return () => {
      window.removeEventListener("load", listo);
      clearTimeout(tope);
      clearTimeout(salida);
      clearTimeout(fin);
    };
  }, []);

  if (fase === "fin") return null;
  const sale = fase === "saliendo";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Cargando ${EVENTO.nombre}`}
      className={`pantalla-carga fixed inset-0 z-[100] overflow-hidden ${
        sale ? "saliendo pointer-events-none" : ""
      }`}
    >
      {(["arriba", "abajo"] as const).map((mitad) => {
        const arriba = mitad === "arriba";
        return (
          <span
            key={mitad}
            aria-hidden
            className={`absolute inset-x-0 h-1/2 overflow-hidden bg-noche transition-transform ${TELON} ${
              arriba
                ? `top-0 ${sale ? "-translate-y-full" : ""}`
                : `bottom-0 ${sale ? "translate-y-full" : ""}`
            }`}
          >
            <span
              className={`absolute inset-x-0 h-[200%] ${arriba ? "top-0" : "bottom-0"}`}
            >
              <Cielo />
            </span>
            <span
              className={`absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-oro-claro to-transparent shadow-[0_0_14px_rgba(212,175,55,0.9)] transition-opacity duration-200 ${
                arriba ? "bottom-0" : "top-0"
              } ${sale ? "opacity-100" : "opacity-0"}`}
            />
          </span>
        );
      })}

      <span
        aria-hidden
        className={`absolute -top-[6%] -left-[14%] w-[62vw] max-w-[520px] transition-[transform,opacity] sm:-top-[8%] sm:-left-[6%] sm:w-[34vw] ${TELON} ${
          sale ? "-translate-x-1/3 -translate-y-1/3 opacity-0" : ""
        }`}
      >
        <Image
          src="/loading/roca1.webp"
          alt=""
          width={669}
          height={720}
          sizes="(min-width: 640px) 34vw, 62vw"
          className="carga-roca h-auto w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)]"
        />
      </span>
      <span
        aria-hidden
        className={`absolute -right-[12%] -bottom-[6%] w-[52vw] max-w-[420px] transition-[transform,opacity] sm:-right-[4%] sm:-bottom-[10%] sm:w-[28vw] ${TELON} ${
          sale ? "translate-x-1/3 translate-y-1/3 opacity-0" : ""
        }`}
      >
        <Image
          src="/loading/roca2.webp"
          alt=""
          width={560}
          height={720}
          sizes="(min-width: 640px) 28vw, 52vw"
          className="carga-roca carga-roca-lenta h-auto w-full drop-shadow-[0_30px_50px_rgba(0,0,0,0.8)]"
        />
      </span>

      <div
        className={`relative flex size-full flex-col items-center justify-center gap-8 transition-[opacity,transform] duration-500 ${
          sale ? "scale-110 opacity-0" : ""
        }`}
      >
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 respirar rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.2),rgba(212,175,55,0))]"
        />

        <div className="carga-logo relative w-[200px] sm:w-[240px]">
          <Image
            {...LOGO}
            alt=""
            loading="eager"
            fetchPriority="high"
            onLoad={(e) => setMascara(e.currentTarget.currentSrc)}
            className="h-auto w-full drop-shadow-[0_14px_40px_rgba(0,0,0,0.8)]"
          />
          {mascara && (
            <span
              aria-hidden
              style={{ "--mascara": `url("${mascara}")` } as CSSProperties}
              className="carga-brillo absolute inset-0"
            />
          )}
        </div>

        <div className="relative flex w-[220px] flex-col items-center gap-3 sm:w-[260px]">
          <span
            aria-hidden
            className="relative block h-[2px] w-full overflow-hidden rounded-full bg-linea"
          >
            <span
              className={`carga-barra absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-oro-profundo via-oro to-oro-claro shadow-[0_0_12px_rgba(212,175,55,0.8)] ${
                sale ? "w-full" : ""
              }`}
            />
          </span>
          <p className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.32em] text-oro-medio uppercase">
            <span
              aria-hidden
              className="inline-block size-[6px] latido rounded-full bg-oro"
            />
            Preparando el ring
          </p>
        </div>
      </div>
    </div>
  );
}
