export const REBOTE = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

const ESQUINAS = {
  pegadas: {
    tamano: "size-3.5 border-oro-profundo/70 group-hover:size-5",
    posiciones: [
      "top-0 left-0 border-t border-l group-hover:-top-1.5 group-hover:-left-1.5",
      "top-0 right-0 border-t border-r group-hover:-top-1.5 group-hover:-right-1.5",
      "bottom-0 left-0 border-b border-l group-hover:-bottom-1.5 group-hover:-left-1.5",
      "right-0 bottom-0 border-r border-b group-hover:-right-1.5 group-hover:-bottom-1.5",
    ],
  },
  dentro: {
    tamano: "size-5 border-oro-profundo group-hover:size-7",
    posiciones: [
      "top-3 left-3 border-t-2 border-l-2 group-hover:top-2 group-hover:left-2",
      "top-3 right-3 border-t-2 border-r-2 group-hover:top-2 group-hover:right-2",
      "bottom-3 left-3 border-b-2 border-l-2 group-hover:bottom-2 group-hover:left-2",
      "right-3 bottom-3 border-r-2 border-b-2 group-hover:right-2 group-hover:bottom-2",
    ],
  },
} as const;

export function EsquinasDoradas({
  variante = "pegadas",
}: {
  variante?: keyof typeof ESQUINAS;
}) {
  const { tamano, posiciones } = ESQUINAS[variante];
  return posiciones.map((posicion) => (
    <span
      key={posicion}
      aria-hidden
      className={`pointer-events-none absolute transition-all duration-500 group-hover:border-oro ${REBOTE} ${tamano} ${posicion}`}
    />
  ));
}

export function ResplandorDorado() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_50%,rgba(212,175,55,0.22)_0%,rgba(212,175,55,0)_100%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
    />
  );
}

export function BarridoLuz() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <span className="absolute inset-y-0 left-0 w-1/3 -translate-x-[140%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-oro-claro/25 to-transparent duration-0 group-hover:translate-x-[420%] group-hover:transition-transform group-hover:duration-700" />
    </span>
  );
}
