"use client";

import { useEffect, useRef, useState } from "react";

export function Revelar({
  children,
  retardo = 0,
  className = "",
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

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
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
