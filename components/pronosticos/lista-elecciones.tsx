import Image from "next/image";
import Link from "next/link";
import { BANDERAS } from "@/lib/evento";
import { METODO, type Eleccion } from "@/lib/compartir";
import { Bandera } from "@/components/ui/bandera";

// Los ocho combates de una quiniela, con el elegido de cada uno. La usan la
// página de un enlace compartido y el detalle de un pronóstico de la comunidad.
export function ListaElecciones({ elecciones }: { elecciones: Eleccion[] }) {
  return (
    <ul className="grid w-full gap-3 lg:grid-cols-2 lg:gap-4">
      {elecciones.map((e) => {
        const { combate, elegido, rival, metodo } = e;
        return (
          <li key={combate.n}>
            <div
              className={`flex h-full items-center gap-4 rounded-sm border px-4 py-3.5 ${
                combate.estelar
                  ? "border-oro bg-oro-tinte"
                  : "border-linea bg-carbon"
              }`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center font-display text-[19px] leading-none ${
                  elegido ? "bg-oro text-noche" : "bg-linea text-tenue"
                }`}
              >
                {combate.n}
              </span>

              {elegido ? (
                <>
                  <span className="relative block h-[62px] w-[50px] shrink-0 overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12]">
                    <Image
                      src={elegido.cuerpo ?? elegido.foto}
                      alt=""
                      fill
                      sizes="50px"
                      className={`object-cover object-top ${
                        elegido.cuerpo ? "brightness-125 contrast-[1.06]" : ""
                      }`}
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/peleadores/${elegido.slug}`}
                      className="group flex min-w-0 items-center gap-2"
                    >
                      <Bandera
                        pais={elegido.pais}
                        className="h-2.5 w-[15px] shrink-0"
                      />
                      <span className="min-w-0 truncate font-display text-[20px] leading-[1.2] text-crema uppercase transition-colors group-hover:text-oro sm:text-[23px]">
                        {elegido.nombre}
                      </span>
                    </Link>
                    <span className="mt-1 block truncate font-cond text-[11px] font-bold tracking-[0.16em] text-oro-medio uppercase">
                      vs {rival?.nombre}
                      <span className="text-tenue">
                        {" "}
                        · {BANDERAS[elegido.pais].nombre}
                      </span>
                    </span>
                    {metodo && (
                      <span className="mt-1.5 inline-flex rounded-full border border-oro-profundo bg-oro-tinte px-2.5 py-[3px] font-cond text-[11px] leading-none font-bold tracking-[0.14em] text-oro uppercase">
                        {METODO[metodo].nombre}
                      </span>
                    )}
                  </span>
                </>
              ) : (
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[20px] leading-[1.2] text-humo uppercase">
                    Sin pronóstico
                  </span>
                  <span className="mt-1 block truncate font-cond text-[11px] font-bold tracking-[0.16em] text-tenue uppercase">
                    {combate.a.nombre} vs {combate.b.nombre}
                  </span>
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
