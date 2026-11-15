"use client";

import { useEffect, useState } from "react";
import { IconoKick } from "@/assets/icons";
import { ANUNCIO } from "@/lib/evento";

// Alto de la franja. El header la lleva arriba y la página deja este mismo
// espacio para que nada quede tapado.
export const ALTO_FRANJA = "h-10";

const DIA_MS = 86_400_000;
const ROTACION_MS = 3800;

// Días que faltan para `ANUNCIO.dia`, contados en hora de Lima. Es null
// hasta montar: el servidor no sabe en qué día está quien mira, y así el
// HTML inicial coincide con la hidratación.
function useDiasQueFaltan() {
  const [dias, setDias] = useState<number | null>(null);
  useEffect(() => {
    const calcular = () => {
      const hoy = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Lima",
      }).format(new Date());
      setDias(Math.round((Date.parse(ANUNCIO.dia) - Date.parse(hoy)) / DIA_MS));
    };
    calcular();
    const id = setInterval(calcular, 60_000);
    return () => clearInterval(id);
  }, []);
  return dias;
}

// La franja se ve si está activa y su día no pasó.
export function useAnuncioVisible() {
  const dias = useDiasQueFaltan();
  return { visible: ANUNCIO.activo && (dias === null || dias >= 0), dias };
}

function textoCuenta(dias: number | null) {
  if (dias === null) return "Muy pronto";
  if (dias === 0) return "¡Es hoy!";
  if (dias === 1) return "Mañana";
  return `Faltan ${dias} días`;
}

export function FranjaAnuncio({ dias }: { dias: number | null }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (ANUNCIO.mensajes.length < 2) return;
    const id = setInterval(
      () => setIndice((i) => (i + 1) % ANUNCIO.mensajes.length),
      ROTACION_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <a
      href={ANUNCIO.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${ANUNCIO.titulo}, ${ANUNCIO.fecha}. Míralo en Kick ${ANUNCIO.canal}`}
      className={`group relative z-10 flex ${ALTO_FRANJA} items-center justify-center gap-2.5 overflow-hidden border-b border-oro-profundo bg-[linear-gradient(90deg,#0b0b0d_0%,#1f180a_25%,#2e2310_50%,#1f180a_75%,#0b0b0d_100%)] px-3 font-cond font-bold whitespace-nowrap text-oro uppercase shadow-[0_8px_24px_-10px_rgba(212,175,55,0.6)] sm:gap-4`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 brillo-boton bg-gradient-to-r from-transparent via-oro-claro/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-oro-claro to-transparent"
      />

      <span className="relative flex items-center gap-1.5 rounded-full bg-oro px-2.5 py-1 text-[10px] leading-none tracking-[0.14em] text-noche sm:text-[11px]">
        <span aria-hidden className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-lado-a opacity-75" />
          <span className="relative size-2 rounded-full bg-lado-a" />
        </span>
        {textoCuenta(dias)}
      </span>

      <span className="relative hidden text-[13px] tracking-[0.16em] text-oro-claro lg:inline">
        {ANUNCIO.fecha}
      </span>
      <span aria-hidden className="relative hidden text-oro-profundo lg:inline">
        ✦
      </span>
      <span className="relative texto-oro font-display text-[16px] leading-none tracking-[0.04em] drop-shadow-[0_0_12px_rgba(212,175,55,0.45)] sm:text-[19px]">
        {ANUNCIO.titulo}
      </span>
      <span aria-hidden className="relative hidden text-oro-profundo md:inline">
        ✦
      </span>
      <span
        key={indice}
        className="relative hidden cambio-texto text-[13px] tracking-[0.14em] text-crema/80 md:inline"
      >
        {ANUNCIO.mensajes[indice]}
      </span>

      <span className="relative flex items-center gap-1.5 rounded-full border border-kick/70 bg-kick/10 px-2.5 py-1 text-[11px] leading-none tracking-[0.1em] text-kick normal-case transition-colors group-hover:bg-kick group-hover:text-noche sm:text-[12px]">
        <IconoKick className="size-3" />
        <span className="hidden sm:inline">Ver en Kick</span>
        <span className="sm:hidden">{ANUNCIO.canal}</span>
      </span>
    </a>
  );
}
