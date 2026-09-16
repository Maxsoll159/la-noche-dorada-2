import { BANDERAS, type Peleador } from "@/lib/evento";

export function Bandera({
  pais,
  className = "h-4 w-6",
}: {
  pais: Peleador["pais"];
  className?: string;
}) {
  const b = BANDERAS[pais];
  const total = b.bandas.reduce((s, [, peso]) => s + peso, 0);
  return (
    <span
      role="img"
      aria-label={b.nombre}
      className={`relative inline-flex overflow-hidden rounded-[2px] ring-1 ring-black/40 ${className} ${
        b.orientacion === "v" ? "flex-row" : "flex-col"
      }`}
    >
      {b.bandas.map(([color, peso], i) => (
        <span
          key={i}
          style={{ flexGrow: peso / total, backgroundColor: color }}
          className="block"
        />
      ))}
      {b.canton && (
        <span
          aria-hidden
          style={{ backgroundColor: b.canton.color }}
          className="absolute left-0 top-0 grid h-1/2 w-1/3 place-items-center"
        >
          {b.canton.estrella && (
            <svg viewBox="0 0 24 24" className="h-[72%] w-auto fill-white">
              <path d="M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.4 5.8 21.1l1.6-7L2 9.3l7.1-.7z" />
            </svg>
          )}
        </span>
      )}
    </span>
  );
}
