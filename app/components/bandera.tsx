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
      {/* El escudo de Ecuador. Es lo ÚNICO que separa esta bandera de la de
          Colombia —mismas bandas, mismas proporciones— y en el cartel hay
          peleadores de los dos países, así que tiene que verse.
          A 21 px de ancho el escudo real es imposible, así que va reducido a su
          silueta: el cóndor con las alas abiertas arriba y el Chimborazo con el
          río debajo. No es el escudo, pero se lee como "esta lleva emblema",
          que es justo la diferencia que hay que marcar. */}
      {b.emblema && (
        <svg
          aria-hidden
          viewBox="0 0 20 26"
          className="absolute left-1/2 top-1/2 h-[64%] w-auto -translate-x-1/2 -translate-y-1/2"
        >
          <ellipse cx="10" cy="15.5" rx="8" ry="9.5" fill="#f7f1d8" />
          {/* Cóndor: las alas abiertas por encima del óvalo */}
          <path d="M10 1.5 3 5.5l7 1.8 7-1.8Z" fill="#2b2418" />
          {/* Chimborazo y el río */}
          <path d="M10 9.5 4.5 20h11Z" fill="#2f5aa8" />
          <path d="M4.5 20h11l-1.6 3h-7.8Z" fill="#f2c200" />
        </svg>
      )}
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
