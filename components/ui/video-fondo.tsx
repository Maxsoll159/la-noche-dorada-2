"use client";

import { useEffect, useRef, useState } from "react";

export function VideoFondo({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [fuente, setFuente] = useState<string | undefined>(undefined);
  const [reproduciendo, setReproduciendo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        setFuente(src);
        obs.disconnect();
      },
      { rootMargin: "300px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
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
