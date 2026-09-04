import Image from "next/image";
import { EVENTO } from "@/lib/evento";
import { Seccion } from "./seccion";

/** Los colores replican los del plano de la pieza de preventa. */
const ZONAS = [
  { nombre: "Tribuna alta", detalle: null, color: "#101015", precio: "S/ 89" },
  { nombre: "Tribuna baja", detalle: null, color: "#E8202A", precio: "S/ 161" },
  {
    nombre: "Golden izquierda",
    detalle: "Numerado",
    color: "#F3DCA6",
    precio: "S/ 276",
  },
  {
    nombre: "Tribuna derecha",
    detalle: "Numerado",
    color: "#E9A93C",
    precio: "S/ 276",
  },
];

export function Entradas() {
  return (
    <Seccion
      id="entradas"
      fondo="superficie"
      antetitulo="Preventa 1"
      titulo="Entradas"
      bajada={`La venta es exclusiva en Ticketmaster.pe. Estas son las zonas y precios del ${EVENTO.sede}.`}
    >
      <div className="grid w-full gap-9 lg:grid-cols-[440px_1fr] lg:items-start">
        <figure className="relative overflow-hidden rounded-sm border border-linea bg-noche">
          <Image
            src="/plano-coliseo.png"
            alt={`Mapa de zonas del ${EVENTO.sede}`}
            width={540}
            height={620}
            sizes="(min-width: 1024px) 440px, 100vw"
            className="h-auto w-full"
          />
          <figcaption className="absolute left-5 top-5 rounded-sm border border-oro-profundo bg-noche/90 px-3 py-1.5 font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro">
            Mapa de zonas
          </figcaption>
        </figure>

        <div className="overflow-hidden rounded-sm border border-linea bg-carbon">
          <div className="flex items-center justify-between border-b border-linea bg-[#08080b] px-7 py-4 font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-profundo">
            <span>Zona</span>
            <span>Precio</span>
          </div>
          <ul>
            {ZONAS.map((z, i) => (
              <li
                key={z.nombre}
                className={`flex items-center justify-between gap-4 px-7 py-5 transition-colors hover:bg-oro-tinte ${
                  i % 2 === 0 ? "bg-carbon" : "bg-[#131318]"
                } ${i < ZONAS.length - 1 ? "border-b border-linea" : ""}`}
              >
                <span className="flex items-center gap-3.5">
                  <span
                    aria-hidden
                    style={{ backgroundColor: z.color }}
                    className="size-4 shrink-0 rounded-[2px] ring-1 ring-oro-profundo"
                  />
                  <span>
                    <span className="block font-display text-[20px] uppercase text-crema">
                      {z.nombre}
                    </span>
                    {z.detalle && (
                      <span className="block font-cond text-[10px] font-bold uppercase tracking-[0.2em] text-oro-profundo">
                        {z.detalle}
                      </span>
                    )}
                  </span>
                </span>
                <span className="font-display text-[25px] text-oro tabular-nums">
                  {z.precio}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-3.5 border-t border-linea bg-oro-tinte px-7 py-6 text-center">
            <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.18em] text-tenue">
              Precios de Preventa 1 · sujetos a disponibilidad
            </p>
            <a
              href={EVENTO.entradasUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-sm bg-oro px-6 py-4 font-cond text-[15px] font-bold uppercase tracking-[0.14em] text-noche shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro"
            >
              Comprar en Ticketmaster.pe
              <svg
                aria-hidden
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
            <p className="font-cond text-[10px] font-semibold uppercase tracking-[0.14em] text-oro-profundo">
              Te llevamos a Ticketmaster.pe para completar la compra
            </p>
          </div>
        </div>
      </div>
    </Seccion>
  );
}
