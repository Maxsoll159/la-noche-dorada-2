import Image from "next/image";
import { IconoExterno } from "@/assets/icons";
import { EVENTO, PREVENTAS, ZONAS } from "@/lib/evento";
import { Seccion } from "@/components/ui/seccion";

export function Entradas() {
  return (
    <Seccion
      id="entradas"
      fondo="superficie"
      antetitulo={`${PREVENTAS.actual.nombre} · hasta el ${PREVENTAS.actual.hasta}`}
      titulo="Entradas"
      bajada={`La venta es exclusiva en Ticketmaster.pe. Estas son las zonas y precios del ${EVENTO.sede}.`}
    >
      <div className="grid w-full gap-6 lg:grid-cols-2 lg:items-stretch lg:gap-8">
        <figure className="relative flex items-center justify-center overflow-hidden rounded-sm border border-linea bg-black p-3 sm:p-4">
          <Image
            src="/plano-dibos.webp"
            alt={`Plano de zonas del ${EVENTO.sede}: tribuna alta en el anillo exterior, tribuna baja en los sectores A a F, y las zonas Golden a ambos lados del escenario`}
            width={768}
            height={755}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="h-auto max-h-full w-full max-w-[600px] object-contain"
          />
          <figcaption className="absolute bottom-5 left-5 rounded-sm border border-oro-profundo bg-noche/90 px-3 py-1.5 font-cond text-[11px] font-bold tracking-[0.18em] text-oro uppercase">
            Plano de zonas
          </figcaption>
        </figure>

        <div className="flex flex-col overflow-hidden rounded-sm border border-linea bg-carbon">
          <div className="flex items-center justify-between gap-4 border-b border-linea bg-[#08080b] px-5 py-4 font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase sm:px-7">
            <span>Zona</span>
            <span className="text-right">
              {PREVENTAS.actual.nombre}
              <span className="hidden text-tenue sm:inline">
                {" "}
                · {PREVENTAS.siguiente.nombre}
              </span>
            </span>
          </div>
          <ul className="flex flex-1 flex-col">
            {ZONAS.map((z, i) => (
              <li
                key={z.nombre}
                className={`flex flex-1 items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-oro-tinte sm:px-7 ${
                  i % 2 === 0 ? "bg-carbon" : "bg-[#131318]"
                } ${i < ZONAS.length - 1 ? "border-b border-linea" : ""}`}
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  <span
                    aria-hidden
                    style={{ backgroundColor: z.color }}
                    className="size-4 shrink-0 rounded-[2px] ring-1 ring-white/30"
                  />
                  <span className="min-w-0">
                    <span className="block font-display text-[18px] leading-tight text-crema uppercase sm:text-[20px]">
                      {z.nombre}
                    </span>
                    {z.detalle && (
                      <span className="block font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
                        {z.detalle}
                      </span>
                    )}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end">
                  <span className="font-display text-[22px] leading-none text-oro tabular-nums sm:text-[25px]">
                    {z.actual}
                  </span>
                  <span className="mt-1 font-cond text-[11px] font-semibold tracking-[0.1em] text-tenue uppercase tabular-nums">
                    <span className="hidden sm:inline">
                      {PREVENTAS.siguiente.nombre}{" "}
                    </span>
                    <span className="sm:hidden">Luego </span>
                    {z.siguiente}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center gap-3.5 border-t border-linea bg-oro-tinte px-5 py-6 text-center sm:px-7">
            <ul className="flex flex-col gap-1 font-cond text-[12px] leading-snug font-semibold tracking-[0.14em] text-tenue uppercase">
              <li>
                <span className="text-oro">{PREVENTAS.actual.nombre}</span> ·
                hasta el {PREVENTAS.actual.hasta}
              </li>
              <li>
                <span className="text-crema">{PREVENTAS.siguiente.nombre}</span>{" "}
                · del {PREVENTAS.siguiente.desde} al {PREVENTAS.siguiente.hasta}
              </li>
              <li className="text-[11px] text-humo">
                Preventa exclusiva agotada
              </li>
            </ul>
            <a
              href={EVENTO.entradasUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2.5 rounded-sm bg-oro px-6 py-4 font-cond text-[15px] font-bold tracking-[0.14em] text-noche uppercase shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro"
            >
              Comprar en Ticketmaster.pe
              <IconoExterno size={18} strokeWidth={2.2} />
            </a>
            <p className="font-cond text-[11px] font-semibold tracking-[0.14em] text-oro-medio uppercase">
              Precios sujetos a disponibilidad · Te llevamos a Ticketmaster.pe
              para completar la compra
            </p>
          </div>
        </div>
      </div>
    </Seccion>
  );
}
