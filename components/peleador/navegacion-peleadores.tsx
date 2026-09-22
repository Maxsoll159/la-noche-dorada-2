import Image from "next/image";
import Link from "next/link";
import { IconoFlechaDerecha, IconoFlechaIzquierda } from "@/assets/icons";
import { BANDERAS, PELEADORES, type Peleador } from "@/lib/evento";
import { Bandera } from "@/components/ui/bandera";

export function NavegacionPeleadores({ peleador }: { peleador: Peleador }) {
  const puesto = PELEADORES.findIndex((p) => p.slug === peleador.slug);
  const anterior =
    PELEADORES[(puesto - 1 + PELEADORES.length) % PELEADORES.length];
  const siguiente = PELEADORES[(puesto + 1) % PELEADORES.length];

  return (
    <nav
      aria-label="Ir a otro peleador del cartel"
      className="grid gap-3 sm:grid-cols-2"
    >
      {[
        {
          p: anterior,
          rotulo: "Anterior",
          derecha: false,
          Flecha: IconoFlechaIzquierda,
        },
        {
          p: siguiente,
          rotulo: "Siguiente",
          derecha: true,
          Flecha: IconoFlechaDerecha,
        },
      ].map(({ p, rotulo, derecha, Flecha }) => (
        <Link
          key={rotulo}
          href={`/peleadores/${p.slug}`}
          className={`group flex items-center gap-4 rounded-sm border border-linea bg-carbon p-3 transition duration-300 hover:border-oro hover:bg-oro-tinte ${
            derecha ? "sm:flex-row-reverse sm:text-right" : ""
          }`}
        >
          <span className="relative block h-[64px] w-[52px] shrink-0 overflow-hidden rounded-sm border border-linea bg-[#0e0e12] transition-colors group-hover:border-oro-profundo">
            <Image
              src={p.cuerpo ?? p.foto}
              alt=""
              fill
              sizes="52px"
              className={`object-cover object-top ${
                p.cuerpo ? "brightness-125 contrast-[1.06]" : ""
              }`}
            />
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={`flex items-center gap-1.5 font-cond text-[11px] font-bold tracking-[0.18em] text-oro-medio uppercase ${
                derecha ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Flecha
                size={12}
                strokeWidth={2.6}
                className={`transition-transform duration-300 ${
                  derecha
                    ? "group-hover:translate-x-0.5"
                    : "group-hover:-translate-x-0.5"
                }`}
              />
              {rotulo}
            </span>
            <span className="mt-1 block truncate font-display text-[19px] leading-[1.2] text-crema uppercase transition-colors group-hover:text-oro sm:text-[22px]">
              {p.nombre}
            </span>
            <span
              className={`mt-1 flex items-center gap-2 font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase ${
                derecha ? "sm:flex-row-reverse" : ""
              }`}
            >
              <Bandera pais={p.pais} className="h-2.5 w-[15px]" />
              {BANDERAS[p.pais].nombre}
            </span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
