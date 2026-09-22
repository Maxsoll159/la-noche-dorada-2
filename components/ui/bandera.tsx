import { EscudoEcuador, IconoEstrella } from "@/assets/icons";
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
      {b.emblema && (
        <EscudoEcuador className="absolute top-1/2 left-1/2 h-[64%] w-auto -translate-x-1/2 -translate-y-1/2" />
      )}
      {b.canton && (
        <span
          aria-hidden
          style={{ backgroundColor: b.canton.color }}
          className="absolute top-0 left-0 grid h-1/2 w-1/3 place-items-center"
        >
          {b.canton.estrella && (
            <IconoEstrella className="h-[72%] w-auto fill-white" />
          )}
        </span>
      )}
    </span>
  );
}
