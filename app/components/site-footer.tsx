import Image from "next/image";
import { EVENTO, NAV } from "@/lib/evento";
import { FileteOro } from "./filete-oro";

const COLUMNAS = [
  { titulo: "El evento", enlaces: NAV.slice(0, 3) },
  {
    titulo: "Información",
    enlaces: [
      { href: "#sede", label: "Sede" },
      { href: "#donde-verlo", label: "Dónde verlo" },
      { href: "#cara-a-cara", label: "Cara a cara" },
    ],
  },
];

const LEGAL = [
  "Términos y condiciones",
  "Privacidad",
  "Juego responsable +18",
];

export function SiteFooter() {
  return (
    <footer className="bg-[#08080a]">
      <FileteOro />
      <div className="mx-auto flex max-w-contenido flex-col gap-11 px-6 pb-9 pt-16 lg:px-14">
        <div className="flex flex-col gap-11 lg:flex-row lg:gap-16">
          <div className="flex max-w-sm flex-col gap-4">
            <Image
              src="/marca/logo-noche-dorada.webp"
              alt={EVENTO.nombre}
              width={455}
              height={406}
              sizes="230px"
              className="h-auto w-[190px]"
            />
            <p className="text-[15px] leading-relaxed text-tenue">
              La segunda edición del evento de boxeo entre creadores de
              contenido más grande del Perú.
            </p>
          </div>

          {COLUMNAS.map((col) => (
            <nav key={col.titulo} className="flex flex-1 flex-col gap-4">
              <p className="font-cond text-[12px] font-bold uppercase tracking-[0.22em] text-oro">
                {col.titulo}
              </p>
              {col.enlaces.map((e) => (
                <a
                  key={e.href}
                  href={e.href}
                  className="text-[15px] text-tenue transition-colors hover:text-crema"
                >
                  {e.label}
                </a>
              ))}
            </nav>
          ))}

          <div className="flex flex-1 flex-col gap-4">
            <p className="font-cond text-[12px] font-bold uppercase tracking-[0.22em] text-oro">
              Asistir
            </p>
            <a
              href={EVENTO.entradasUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] text-tenue transition-colors hover:text-crema"
            >
              Entradas en Ticketmaster
            </a>
            <a
              href={EVENTO.streamUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[15px] text-tenue transition-colors hover:text-crema"
            >
              Ver por Kick {EVENTO.streamCanal}
            </a>
          </div>
        </div>

        <div aria-hidden className="h-px w-full bg-linea" />

        <div className="flex flex-wrap items-center justify-between gap-5">
          <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-oro-profundo">
            © 2026 {EVENTO.nombre} · Producido por {EVENTO.productora}
          </p>
          <ul className="flex flex-wrap items-center gap-6">
            {LEGAL.map((l) => (
              <li
                key={l}
                className="font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-oro-profundo"
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
