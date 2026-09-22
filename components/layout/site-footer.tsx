import Image from "next/image";
import { EVENTO } from "@/lib/evento";
import { FileteOro } from "@/components/ui/filete-oro";

const COLUMNAS = [
  {
    titulo: "El evento",
    enlaces: [
      { href: "/#combates", label: "Combates" },
      { href: "/#cara-a-cara", label: "Cara a cara" },
      { href: "/#pronosticos", label: "Pronósticos" },
    ],
  },
  {
    titulo: "Información",
    enlaces: [
      { href: "/#entradas", label: "Entradas" },
      { href: "/#sede", label: "Sede" },
      { href: "/#donde-verlo", label: "Dónde verlo" },
    ],
  },
];

const LEGAL = ["Términos y condiciones", "Privacidad", "Juego responsable +18"];

export function SiteFooter() {
  return (
    <footer className="bg-[#08080a]">
      <FileteOro />
      <div className="mx-auto flex max-w-contenido flex-col gap-9 px-6 pt-12 pb-9 sm:gap-11 sm:pt-16 lg:px-14">
        <div className="flex flex-col gap-9 lg:flex-row lg:gap-16">
          <div className="flex max-w-sm flex-col gap-4 lg:shrink-0">
            <Image
              src="/marca/logo-noche-dorada.webp"
              alt={EVENTO.nombre}
              width={455}
              height={406}
              sizes="(min-width: 1024px) 190px, 160px"
              className="h-auto w-[160px] lg:w-[190px]"
            />
            <p className="text-[15px] leading-relaxed text-tenue">
              La segunda edición del evento de boxeo entre creadores de
              contenido más grande del Perú.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {COLUMNAS.map((col) => (
              <nav key={col.titulo} className="flex flex-col gap-3.5">
                <p className="font-cond text-[12px] font-bold tracking-[0.22em] text-oro uppercase">
                  {col.titulo}
                </p>
                {col.enlaces.map((e) => (
                  <a
                    key={e.href}
                    href={e.href}
                    className="text-[15px] leading-snug text-tenue transition-colors hover:text-crema"
                  >
                    {e.label}
                  </a>
                ))}
              </nav>
            ))}

            <div className="flex flex-col gap-3.5">
              <p className="font-cond text-[12px] font-bold tracking-[0.22em] text-oro uppercase">
                Asistir
              </p>
              <a
                href={EVENTO.entradasUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[15px] leading-snug text-tenue transition-colors hover:text-crema"
              >
                Entradas en Ticketmaster
              </a>
              <a
                href={EVENTO.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[15px] leading-snug text-tenue transition-colors hover:text-crema"
              >
                Ver por Kick {EVENTO.streamCanal}
              </a>
            </div>
          </div>
        </div>

        <div aria-hidden className="h-px w-full bg-linea" />

        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:gap-5 sm:text-left">
          <p className="font-cond text-[11px] leading-relaxed font-semibold tracking-[0.1em] text-oro-medio uppercase sm:text-[12px] sm:tracking-[0.14em]">
            © 2026 {EVENTO.nombre} · Producido por {EVENTO.productora}
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 sm:justify-end sm:gap-x-6">
            {LEGAL.map((l) => (
              <li
                key={l}
                className="font-cond text-[11px] font-semibold tracking-[0.1em] text-oro-medio uppercase sm:text-[12px] sm:tracking-[0.14em]"
              >
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
