import Image from "next/image";
import { METODO, type Eleccion } from "@/lib/compartir";
import { Bandera } from "@/components/ui/bandera";

// Rejilla de 4 × 2 con el elegido de cada combate: cara, nombre, bandera y el
// método si lo pronosticó. El estelar va con marco dorado. En `grande` (el
// detalle) las losetas son más altas, con el rival debajo del nombre. No usa
// hooks: sirve igual desde el servidor que desde el cliente.
export function RejillaElecciones({
  elecciones,
  grande = false,
}: {
  elecciones: Eleccion[];
  grande?: boolean;
}) {
  return (
    <ul
      className={
        grande
          ? "grid grid-cols-4 gap-2 sm:gap-2.5 lg:grid-cols-8"
          : "grid grid-cols-4 gap-1.5 sm:gap-2"
      }
    >
      {elecciones.map(({ combate, elegido, rival, metodo }) => (
        <li
          key={combate.n}
          className={`group/loseta relative isolate aspect-[3/4] overflow-hidden rounded-[4px] ${
            elegido
              ? `bg-[#0e0e12] ring-1 ring-inset ${
                  combate.estelar
                    ? "shadow-[0_0_18px_-6px_rgba(212,175,55,0.6)] ring-oro"
                    : "ring-oro-profundo/60"
                }`
              : "bg-noche/50 ring-1 ring-linea ring-inset"
          }`}
        >
          {elegido ? (
            <>
              <span
                aria-hidden
                className={`absolute inset-0 -z-10 ${
                  combate.estelar
                    ? "bg-[radial-gradient(95%_75%_at_50%_0%,rgba(212,175,55,0.35)_0%,rgba(14,14,18,0)_75%)]"
                    : "bg-[radial-gradient(95%_75%_at_50%_0%,rgba(212,175,55,0.16)_0%,rgba(14,14,18,0)_75%)]"
                }`}
              />
              <span className="absolute inset-x-0 top-[10%] bottom-0">
                <Image
                  src={elegido.cuerpo ?? elegido.foto}
                  alt=""
                  fill
                  sizes={
                    grande
                      ? "(min-width: 1024px) 150px, 24vw"
                      : "(min-width: 1024px) 100px, (min-width: 640px) 22vw, 24vw"
                  }
                  className={`object-contain object-bottom transition-transform duration-500 group-hover/loseta:scale-[1.05] ${
                    elegido.cuerpo
                      ? "brightness-125 contrast-[1.06] saturate-105"
                      : "object-cover object-top"
                  }`}
                />
              </span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-noche via-noche/85 to-transparent"
              />
              <span
                className={`absolute inset-x-0 bottom-0 flex flex-col items-center text-center ${
                  grande ? "gap-1 px-1.5 pb-2" : "gap-1 px-1 pb-1.5"
                }`}
              >
                <span
                  className={`flex max-w-full items-center ${grande ? "gap-1.5" : "gap-1"}`}
                >
                  <Bandera
                    pais={elegido.pais}
                    className={
                      grande
                        ? "h-2.5 w-[15px] shrink-0"
                        : "h-2 w-[12px] shrink-0"
                    }
                  />
                  <span
                    className={`truncate font-display leading-tight uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${
                      grande
                        ? "text-[12px] sm:text-[15px]"
                        : "text-[11px] sm:text-[12px]"
                    } ${combate.estelar ? "text-oro-claro" : "text-crema"}`}
                  >
                    {elegido.nombre}
                  </span>
                </span>
                {grande && rival && (
                  <span className="max-w-full truncate font-cond text-[10px] font-bold tracking-[0.14em] text-oro-medio uppercase">
                    vs {rival.nombre}
                  </span>
                )}
                {metodo && (
                  <span
                    className={`rounded-full border border-oro-profundo bg-noche/85 font-cond leading-none font-bold tracking-[0.12em] text-oro uppercase ${
                      grande
                        ? "px-2 py-[3px] text-[9px]"
                        : "px-1.5 py-[2px] text-[9px]"
                    }`}
                  >
                    {METODO[metodo].corto}
                  </span>
                )}
              </span>
            </>
          ) : (
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2 text-center">
              <span
                className={`font-display leading-none text-linea ${grande ? "text-[32px]" : "text-[20px]"}`}
              >
                —
              </span>
              <span
                className={`font-cond leading-tight font-bold tracking-[0.12em] text-humo uppercase ${grande ? "text-[11px]" : "text-[9px]"}`}
              >
                Sin voto
              </span>
              {grande && (
                <span className="max-w-full truncate font-cond text-[10px] font-semibold tracking-[0.1em] text-tenue uppercase">
                  {combate.a.nombre} vs {combate.b.nombre}
                </span>
              )}
            </span>
          )}
          <span
            aria-hidden
            className={`absolute top-0 left-0 grid place-items-center rounded-br-[4px] px-1 font-display leading-none ${
              grande
                ? "h-5 min-w-5 text-[12px]"
                : "h-[18px] min-w-[18px] text-[11px]"
            } ${
              elegido
                ? combate.estelar
                  ? "bg-oro text-noche"
                  : "bg-oro-profundo text-crema"
                : "bg-linea text-tenue"
            }`}
          >
            {combate.n}
          </span>
        </li>
      ))}
    </ul>
  );
}
