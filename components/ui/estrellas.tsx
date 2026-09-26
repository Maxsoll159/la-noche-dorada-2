import type { CSSProperties } from "react";

const FUGACES = [
  { top: "12%", left: "78%", dur: "11s", ret: "2s" },
  { top: "34%", left: "46%", dur: "17s", ret: "8s" },
  { top: "8%", left: "30%", dur: "23s", ret: "14s" },
];

export function Estrellas() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <span className="estrellas" />
      <span className="estrellas estrellas-lejanas" />
      {FUGACES.map((f) => (
        <span
          key={f.left}
          style={
            {
              top: f.top,
              left: f.left,
              "--dur": f.dur,
              "--retardo": f.ret,
            } as CSSProperties
          }
          className="estrella-fugaz"
        />
      ))}
    </span>
  );
}
