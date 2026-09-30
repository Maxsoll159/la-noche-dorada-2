"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IconoCerrar, IconoEnviar } from "@/assets/icons";
import { MASCOTA } from "@/lib/mascota/config";

type Mensaje = { rol: "usuario" | "mascota"; texto: string };

const SUGERENCIAS = [
  "¿Quién gana el estelar?",
  "¿Cuándo es la velada?",
  "¿Dónde la veo en vivo?",
  "¿Cuánto cuestan las entradas?",
];

const MAX_PREGUNTA = 300;

function Avatar({ tamano }: { tamano: number }) {
  return (
    <Image
      src={MASCOTA.imagen}
      alt=""
      width={tamano}
      height={tamano}
      sizes={`${tamano}px`}
      className="size-full object-contain"
    />
  );
}

export function ChatMascota() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    { rol: "mascota", texto: MASCOTA.saludo },
  ]);
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  // En móvil la burbuja "Pregúntale al Calvo" se muestra unos segundos y se esconde.
  const [llamado, setLlamado] = useState<"visible" | "saliendo" | "oculto">(
    "visible",
  );
  const entrada = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const salir = setTimeout(() => setLlamado("saliendo"), 7000);
    const ocultar = setTimeout(() => setLlamado("oculto"), 7500);
    return () => {
      clearTimeout(salir);
      clearTimeout(ocultar);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    entrada.current?.focus();
    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alTecla);
    return () => window.removeEventListener("keydown", alTecla);
  }, [abierto]);

  useEffect(() => {
    lista.current?.scrollTo({ top: lista.current.scrollHeight });
  }, [mensajes]);

  async function preguntar(pregunta: string) {
    const limpia = pregunta.trim().slice(0, MAX_PREGUNTA);
    if (!limpia || pensando) return;

    // El saludo es solo de la web: a OpenAI va la conversación real.
    const historial = [
      ...mensajes.slice(1),
      { rol: "usuario", texto: limpia },
    ] as Mensaje[];
    setMensajes((prev) => [
      ...prev,
      { rol: "usuario", texto: limpia },
      { rol: "mascota", texto: "" },
    ]);
    setTexto("");
    setPensando(true);

    const escribir = (parte: string) =>
      setMensajes((prev) => {
        const copia = [...prev];
        const ultimo = copia[copia.length - 1];
        copia[copia.length - 1] = { ...ultimo, texto: ultimo.texto + parte };
        return copia;
      });

    try {
      const res = await fetch("/api/mascota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensajes: historial }),
      });
      if (!res.body) throw new Error("sin respuesta");
      const lector = res.body.getReader();
      const decodificador = new TextDecoder();
      for (;;) {
        const { value, done } = await lector.read();
        if (done) break;
        escribir(decodificador.decode(value, { stream: true }));
      }
    } catch {
      escribir("Pucha, se cayó la señal. Intenta de nuevo, causa.");
    } finally {
      setPensando(false);
      entrada.current?.focus();
    }
  }

  const soloSaludo = mensajes.length === 1;

  return (
    <>
      {abierto && (
        <section
          id="chat-mascota"
          aria-label={`Chat con ${MASCOTA.nombre}`}
          className="cambio fixed inset-x-3 top-[5.75rem] bottom-[5.5rem] z-40 flex flex-col overflow-hidden rounded-md border border-oro-profundo bg-carbon shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9),0_0_40px_-18px_rgba(212,175,55,0.5)] sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-32 sm:max-h-[min(560px,calc(100dvh-9.5rem))] sm:w-[370px]"
        >
          <header className="flex items-center gap-3 border-b border-linea bg-oro-tinte px-4 py-3">
            <span className="size-11 shrink-0">
              <Avatar tamano={44} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[18px] leading-tight text-oro-claro uppercase">
                {MASCOTA.nombre}
              </p>
              <p className="font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
                Opina con chacota · no es consejo de apuesta
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar el chat"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-tenue transition-colors hover:bg-noche hover:text-oro"
            >
              <IconoCerrar size={18} />
            </button>
          </header>

          <ol
            ref={lista}
            aria-live="polite"
            className="flex flex-1 flex-col gap-2.5 overflow-y-auto px-3 py-4"
          >
            {mensajes.map((m, i) =>
              m.rol === "usuario" ? (
                <li
                  key={i}
                  className="max-w-[85%] self-end rounded-lg rounded-br-sm bg-oro px-3.5 py-2.5 text-[15px] leading-snug text-noche"
                >
                  {m.texto}
                </li>
              ) : (
                <li key={i} className="flex max-w-[88%] items-end gap-2 self-start">
                  <span
                    aria-hidden
                    className="size-8 shrink-0 overflow-hidden rounded-full border border-oro-profundo bg-noche"
                  >
                    <Avatar tamano={32} />
                  </span>
                  <div className="min-w-0 rounded-lg rounded-bl-sm border border-linea bg-noche px-3.5 py-2.5 text-[15px] leading-snug text-crema">
                    {m.texto || (
                      <span
                        className="inline-flex gap-1"
                        aria-label="Escribiendo"
                      >
                        <span className="size-1.5 latido rounded-full bg-oro" />
                        <span className="size-1.5 latido rounded-full bg-oro [animation-delay:150ms]" />
                        <span className="size-1.5 latido rounded-full bg-oro [animation-delay:300ms]" />
                      </span>
                    )}
                  </div>
                </li>
              ),
            )}
          </ol>

          {soloSaludo && (
            <ul className="flex flex-wrap gap-1.5 px-3 pb-3">
              {SUGERENCIAS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => preguntar(s)}
                    className="cursor-pointer rounded-full border border-oro-profundo px-3 py-1.5 font-cond text-[12px] font-bold tracking-[0.08em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              preguntar(texto);
            }}
            className="flex items-center gap-2 border-t border-linea bg-noche/60 p-2.5"
          >
            <input
              ref={entrada}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={MAX_PREGUNTA}
              placeholder="Habla causa, pregunta algo…"
              aria-label={`Pregunta para ${MASCOTA.nombre}`}
              className="min-w-0 flex-1 rounded-sm border border-linea bg-carbon px-3.5 py-2.5 text-[16px] text-crema placeholder:text-tenue/70 focus:border-oro-profundo focus:outline-none"
            />
            <button
              type="submit"
              disabled={pensando || !texto.trim()}
              aria-label="Enviar"
              className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-sm bg-oro text-noche transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IconoEnviar size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-controls="chat-mascota"
        aria-label={abierto ? "Cerrar el chat" : MASCOTA.llamado}
        className="group fixed right-3 bottom-3 z-40 flex cursor-pointer items-center gap-1 sm:right-5 sm:bottom-5"
      >
        {!abierto && (
          <span
            className={`burbuja-chat relative rounded-full border border-oro bg-noche/95 px-3 py-1.5 font-cond text-[12px] font-bold tracking-[0.1em] whitespace-nowrap text-oro-claro uppercase shadow-[0_8px_24px_-6px_rgba(0,0,0,0.9)] transition-colors group-hover:bg-oro group-hover:text-noche sm:px-3.5 sm:py-2 sm:text-[13px] ${
              llamado === "saliendo"
                ? "max-sm:burbuja-sale"
                : llamado === "oculto"
                  ? "max-sm:hidden"
                  : ""
            }`}
          >
            {MASCOTA.llamado}
            {/* Colita de la burbuja apuntando al Calvo */}
            <span
              aria-hidden
              className="absolute top-1/2 -right-[5px] size-2.5 -translate-y-1/2 rotate-45 border-t border-r border-oro bg-noche/95 transition-colors group-hover:bg-oro"
            />
          </span>
        )}
        <span className="relative grid size-[68px] place-items-center transition-transform duration-300 group-hover:scale-105 sm:size-[100px]">
          {abierto ? (
            <span className="grid size-14 place-items-center rounded-full border-2 border-oro bg-noche text-oro">
              <IconoCerrar size={24} />
            </span>
          ) : (
            <>
              {/* Onda dorada que se expande detrás del Calvo */}
              <span
                aria-hidden
                className="calvo-aura pointer-events-none absolute inset-[14%] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.45)_0%,rgba(212,175,55,0)_70%)]"
              />
              <span className="calvo-saluda relative size-full group-hover:[animation-play-state:paused]">
                <Avatar tamano={100} />
              </span>
              {/* Globito de chat con puntitos "escribiendo" */}
              <span
                aria-hidden
                className="globito-chat absolute top-0 right-0 inline-flex h-[18px] items-center gap-[3px] rounded-full rounded-bl-[3px] border border-oro bg-oro-claro px-1.5 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.8)] sm:h-6 sm:gap-1 sm:px-2"
              >
                <span className="size-1 latido rounded-full bg-noche sm:size-1.5" />
                <span className="size-1 latido rounded-full bg-noche [animation-delay:150ms] sm:size-1.5" />
                <span className="size-1 latido rounded-full bg-noche [animation-delay:300ms] sm:size-1.5" />
              </span>
            </>
          )}
        </span>
      </button>
    </>
  );
}
