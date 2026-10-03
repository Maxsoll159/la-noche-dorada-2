"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IconoCerrar, IconoFlechaDerecha } from "@/assets/icons";
import { HITO } from "@/lib/evento";
import { LOGO } from "@/lib/imagenes";
import { Estrellas } from "@/components/ui/estrellas";

// Modal que celebra el hito en la portada. Aparece cuando la pantalla de
// carga ya se fue, cuenta hasta la cifra y, al llegar, suelta confeti dorado.
// Se muestra una vez por dispositivo: al cerrarlo se guarda la cifra, así que
// cambiarla en `HITO` lo vuelve a mostrar.
const CLAVE = "nd2:hito";
const ESPERA_MS = 700;
const ARRANQUE_MS = 900;
const DURACION_MS = 1900;
const SALIDA_MS = 380;

const numero = new Intl.NumberFormat("es-PE");
const suave = (t: number) => 1 - Math.pow(1 - t, 3);

// Confeti: posición, tamaño, giro y tiempos fijos para que cada pieza caiga
// distinta sin depender de Math.random en el render.
const COLORES = ["#f7e3a1", "#d4af37", "#b08a34", "#f5eedc"];
const CONFETI = Array.from({ length: 36 }, (_, i) => {
  const semilla = (i * 37) % 100;
  return {
    left: `${(i * 53) % 100}%`,
    ancho: 5 + (semilla % 4),
    alto: 9 + ((semilla * 3) % 6),
    color: COLORES[i % COLORES.length],
    dur: `${4.6 + (semilla % 7) * 0.3}s`,
    retardo: `${(semilla % 9) * 90}ms`,
    deriva: `${((semilla % 5) - 2) * 26}px`,
    giro: `${360 + (semilla % 4) * 180}deg`,
  };
});

function yaVisto() {
  try {
    return localStorage.getItem(CLAVE) === String(HITO.cifra);
  } catch {
    return false;
  }
}

function marcarVisto() {
  try {
    localStorage.setItem(CLAVE, String(HITO.cifra));
  } catch {}
}

function Escuadra({ x, y }: { x: "left" | "right"; y: "top" | "bottom" }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-7 border-oro ${
        x === "left" ? "left-3 border-l-2" : "right-3 border-r-2"
      } ${y === "top" ? "top-3 border-t-2" : "bottom-3 border-b-2"}`}
    />
  );
}

export function Hito() {
  const [fase, setFase] = useState<"oculto" | "visible" | "saliendo">("oculto");
  const [valor, setValor] = useState(0);
  const [celebrando, setCelebrando] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  // Espera a que la pantalla de carga se vaya y entonces abre el modal.
  useEffect(() => {
    if (!HITO.activo || yaVisto()) return;
    const raiz = document.documentElement;
    let temporizador: ReturnType<typeof setTimeout> | undefined;
    let obs: MutationObserver | undefined;

    const mostrar = () => {
      temporizador = setTimeout(() => setFase("visible"), ESPERA_MS);
    };

    if ("cargando" in raiz.dataset) {
      obs = new MutationObserver(() => {
        if ("cargando" in raiz.dataset) return;
        obs?.disconnect();
        mostrar();
      });
      obs.observe(raiz, {
        attributes: true,
        attributeFilter: ["data-cargando"],
      });
    } else {
      mostrar();
    }

    return () => {
      obs?.disconnect();
      clearTimeout(temporizador);
    };
  }, []);

  // Contador: sube hasta la cifra y al llegar arranca la celebración.
  useEffect(() => {
    if (fase !== "visible") return;
    // Con movimiento reducido el primer cuadro ya es el último.
    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cuadro = 0;
    const inicio = reducido
      ? performance.now() - DURACION_MS
      : performance.now() + ARRANQUE_MS;
    const pintar = (ahora: number) => {
      const t = Math.min(1, Math.max(0, (ahora - inicio) / DURACION_MS));
      setValor(Math.round(suave(t) * HITO.cifra));
      if (t < 1) cuadro = requestAnimationFrame(pintar);
      else setCelebrando(true);
    };
    cuadro = requestAnimationFrame(pintar);
    return () => cancelAnimationFrame(cuadro);
  }, [fase]);

  // Modal de verdad: bloquea el scroll, atrapa el foco y cierra con Escape.
  useEffect(() => {
    if (fase !== "visible") return;
    const previo = document.body.style.overflow;
    const enfocadoAntes = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    // El foco va al panel y no a la X: así no aparece el anillo de foco al
    // abrirse, y Tab sigue llegando primero a la X.
    panel.current?.focus({ preventScroll: true });

    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;
      const focables = panel.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      if (focables.length === 0) return;
      const primero = focables[0];
      const ultimo = focables[focables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener("keydown", alTecla);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTecla);
      enfocadoAntes?.focus();
    };
  }, [fase]);

  function cerrar() {
    marcarVisto();
    setFase("saliendo");
    setTimeout(() => setFase("oculto"), SALIDA_MS);
  }

  if (fase === "oculto") return null;
  const sale = fase === "saliendo";
  const entra = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-hito"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={cerrar}
        className={`absolute inset-0 cursor-default bg-noche/85 backdrop-blur-md ${
          sale ? "hito-telon-sale" : "hito-telon"
        }`}
      />

      <div
        ref={panel}
        tabIndex={-1}
        className={`relative w-full max-w-[520px] outline-none ${
          sale ? "hito-sale" : "hito-entra"
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(212,175,55,0.35),rgba(212,175,55,0))] blur-2xl transition-opacity duration-1000 ${
            celebrando ? "opacity-100" : "opacity-50"
          }`}
        />

        {/* La X asoma por fuera de la esquina para no pisar la escuadra */}
        <button
          ref={cerrarRef}
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          className="absolute -top-3 -right-2 z-30 grid size-10 cursor-pointer place-items-center rounded-full border border-oro-profundo bg-noche text-oro shadow-[0_8px_20px_rgba(0,0,0,0.7)] transition-colors hover:border-oro hover:bg-oro hover:text-noche sm:-top-4 sm:-right-4"
        >
          <IconoCerrar size={16} strokeWidth={2.4} />
        </button>

        <div
          className={`relative isolate overflow-hidden rounded-md border bg-[linear-gradient(170deg,#1f180a_0%,#110e08_42%,#0b0b0d_100%)] px-6 pt-9 pb-7 text-center shadow-[0_40px_120px_-30px_rgba(0,0,0,1),0_0_60px_-20px_rgba(212,175,55,0.6)] transition-[border-color] duration-700 sm:px-10 sm:pt-10 sm:pb-9 ${
            celebrando ? "border-oro" : "border-oro-profundo"
          }`}
        >
          <Estrellas />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[repeating-linear-gradient(135deg,rgba(212,175,55,0.035)_0_1px,transparent_1px_12px)]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro-claro to-transparent"
          />
          <Escuadra x="left" y="top" />
          <Escuadra x="right" y="top" />
          <Escuadra x="left" y="bottom" />
          <Escuadra x="right" y="bottom" />

          {/* Confeti dorado que cae al llegar a la cifra */}
          {celebrando && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
            >
              {CONFETI.map((c, i) => (
                <span
                  key={i}
                  style={
                    {
                      left: c.left,
                      width: c.ancho,
                      height: c.alto,
                      backgroundColor: c.color,
                      "--dur": c.dur,
                      "--retardo": c.retardo,
                      "--deriva": c.deriva,
                      "--giro": c.giro,
                    } as CSSProperties
                  }
                  className="absolute -top-4 confeti rounded-[1px]"
                />
              ))}
            </span>
          )}

          <div className="relative flex flex-col items-center gap-5">
            <Image
              {...LOGO}
              alt=""
              sizes="96px"
              style={entra(150)}
              className="w-[88px] entrada drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] sm:w-[96px]"
            />

            <p
              style={entra(260)}
              className="flex entrada items-center gap-3 font-cond text-[12px] font-bold tracking-[0.3em] text-oro uppercase"
            >
              <span aria-hidden className="h-px w-8 bg-oro-profundo" />
              Hito de la comunidad
              <span aria-hidden className="h-px w-8 bg-oro-profundo" />
            </p>

            <div
              style={entra(380)}
              className="flex entrada flex-col items-center"
            >
              <p
                aria-hidden
                className={`relative texto-oro -skew-x-6 font-display text-[96px] leading-none tabular-nums transition-[filter] duration-700 sm:text-[124px] ${
                  celebrando
                    ? "drop-shadow-[0_0_34px_rgba(212,175,55,0.8)]"
                    : "drop-shadow-[0_0_14px_rgba(212,175,55,0.25)]"
                }`}
              >
                {numero.format(valor)}
                <span className="text-[0.5em]">+</span>
              </p>
              <h2
                id="titulo-hito"
                className="-mt-1 text-[30px] leading-none tracking-wide text-crema sm:text-[38px]"
              >
                <span className="sr-only">
                  Más de {numero.format(HITO.cifra)}.{" "}
                </span>
                {HITO.titulo}
              </h2>
            </div>

            <p
              style={entra(500)}
              className="max-w-[26rem] entrada text-[16px] leading-relaxed text-tenue sm:text-[17px]"
            >
              <span className="font-semibold text-oro-claro">
                {HITO.texto}.
              </span>{" "}
              {HITO.detalle}
            </p>

            <div
              style={entra(620)}
              className="flex w-full entrada flex-col items-center gap-3"
            >
              <a
                href="#pronosticos"
                onClick={cerrar}
                className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-sm bg-oro px-6 py-4 font-cond text-[14px] font-bold tracking-[0.14em] text-noche uppercase shadow-[0_8px_26px_rgba(212,175,55,0.3)] transition-colors hover:bg-oro-claro sm:w-auto sm:px-10"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 brillo-boton bg-gradient-to-r from-transparent via-white/60 to-transparent"
                />
                <span className="relative">Súmate y vota</span>
                <IconoFlechaDerecha
                  size={15}
                  strokeWidth={2.4}
                  className="relative transition-transform group-hover:translate-x-0.5"
                />
              </a>
              <button
                type="button"
                onClick={cerrar}
                className="cursor-pointer py-1 font-cond text-[12px] font-bold tracking-[0.18em] text-tenue uppercase transition-colors hover:text-oro"
              >
                Seguir viendo la web
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
