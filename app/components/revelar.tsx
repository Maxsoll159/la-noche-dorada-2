"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Revela su contenido cuando entra en pantalla. Usa IntersectionObserver y se
 * desconecta al primer disparo: la animación es de entrada, no de ida y vuelta.
 */
export function Revelar({
  children,
  /** Milisegundos de retardo, para escalonar varios hermanos */
  retardo = 0,
  className = "",
  /** Ancla opcional, para que un enlace interno pueda bajar hasta aquí */
  id,
}: {
  children: React.ReactNode;
  retardo?: number;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si el navegador no soporta el observador, mostramos sin animar.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      // El margen negativo abajo evita que dispare cuando apenas asoma un píxel
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      style={retardo ? { transitionDelay: `${retardo}ms` } : undefined}
      className={`revelar ${visible ? "revelado" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
