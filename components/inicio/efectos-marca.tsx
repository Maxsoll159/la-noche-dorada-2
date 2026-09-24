export const REBOTE = "ease-[cubic-bezier(0.34,1.56,0.64,1)]";

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
