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
      className={`inline-flex overflow-hidden rounded-[2px] ring-1 ring-black/40 ${className} ${
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
    </span>
  );
}
