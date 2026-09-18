"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Clip de presentación en bucle, como fondo de una sección.
 *
 * Es decoración: va mudo, sin controles y fuera del árbol de accesibilidad. Lo
 * que hay debajo (el degradado de la sección) se sigue viendo mientras el video
 * no esté, así que si no carga, si el navegador bloquea el autoplay o si el
 * visitante pide menos movimiento, la sección se ve exactamente como se veía
 * antes de que existiera esto. Ese es el punto: el video suma, nunca resta.
 *
 * Tres cuidados que no son opcionales:
 *
 * - `preload="none"` y carga diferida hasta que la sección se acerca a
 *   pantalla. El `src` no se pone hasta ese momento: con el atributo puesto
 *   desde el principio, el navegador se lleva megas por delante del retrato,
 *   que es el LCP de la página.
 * - `muted` + `playsInline` además de `autoPlay`. Sin los dos, iOS no
 *   reproduce y Chrome bloquea; no son adorno.
 * - Entra con un fundido al empezar a reproducir de verdad (`onPlaying`), no
 *   al montar. Si no, se ve un rectángulo negro y luego un salto.
 */
export function VideoFondo({
  src,
  className = "",
}: {
  src: string;
  /** Posicionamiento y recorte; el color lo pone el velo de la sección. */
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [fuente, setFuente] = useState<string | undefined>(undefined);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Un bucle de video de fondo es justo lo que molesta a quien pide menos
    // movimiento. Ni siquiera se descarga: se queda el degradado.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (typeof IntersectionObserver === "undefined") {
      // Navegador sin observador: no hay forma de saber cuándo entra en
      // pantalla, así que se carga y ya. Es un render de más, una sola vez, en
      // un caso que hoy no se da en ningún navegador con soporte real; la
      // alternativa es no enseñar nunca el video.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFuente(src);
      return;
    }

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setFuente(src);
        obs.disconnect();
      },
      // Con margen: que empiece a bajar poco antes de entrar en pantalla, para
      // no ver el fundido a mitad de la sección.
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      // Es fondo: ni lo anuncia el lector de pantalla ni lo enfoca el teclado.
      aria-hidden
      tabIndex={-1}
      src={fuente}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onPlaying={() => setReproduciendo(true)}
      className={`pointer-events-none transition-opacity duration-1000 ${
        reproduciendo ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
