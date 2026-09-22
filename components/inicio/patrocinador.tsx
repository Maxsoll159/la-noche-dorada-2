import Image from "next/image";
import { IconoExterno } from "@/assets/icons";
import { EVENTO, PATROCINADORES } from "@/lib/evento";
import { Seccion } from "@/components/ui/seccion";

const CREDITOS = [
  { etiqueta: "Produce", valor: EVENTO.productora },
  { etiqueta: "Entradas", valor: "Ticketmaster.pe" },
  { etiqueta: "En vivo", valor: `Kick ${EVENTO.streamCanal}` },
];

const CONTACTO = "comercial@lanochedorada.pe";

const dominio = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export function Patrocinador() {
  return (
    <Seccion
      id="patrocinadores"
      antetitulo="Con el respaldo de"
      titulo="Patrocinadores"
    >
      <div className="flex w-full flex-col items-center gap-8 sm:gap-9">
        <ul className="grid w-full gap-4 sm:grid-cols-2 lg:gap-5">
          {PATROCINADORES.map((p) => (
            <li key={p.nombre} className="flex">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer sponsored"
                aria-label={`Ir al sitio de ${p.nombre} (se abre en otra pestaña)`}
                className="group relative isolate flex w-full flex-col overflow-hidden rounded-sm border border-oro-profundo bg-carbon transition duration-300 hover:-translate-y-1 hover:border-oro hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)]"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_100%)]"
                />
                <span className="flex h-32 items-center justify-center px-8">
                  <Image
                    src={p.logo}
                    alt=""
                    width={p.w}
                    height={p.h}
                    sizes={`${p.ancho}px`}
                    style={{ width: p.ancho }}
                    className="h-auto max-w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="flex items-center justify-between gap-3 border-t border-linea bg-[#08080b] px-5 py-3">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[15px] leading-tight text-crema uppercase">
                      {p.nombre}
                    </span>
                    <span className="block truncate font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
                      {dominio(p.url)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 font-cond text-[11px] font-bold tracking-[0.16em] text-oro uppercase">
                    Visitar
                    <IconoExterno
                      size={14}
                      strokeWidth={2.4}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <ul className="w-full rounded-sm border border-linea bg-carbon sm:flex sm:w-auto sm:items-center sm:justify-center sm:divide-x sm:divide-oro-profundo/40 sm:border-0 sm:bg-transparent">
          {CREDITOS.map((c, i) => (
            <li
              key={c.etiqueta}
              className={`flex items-center justify-between gap-4 px-5 py-3 sm:flex-col sm:justify-center sm:gap-1.5 sm:px-9 sm:py-2 ${
                i < CREDITOS.length - 1
                  ? "border-b border-linea sm:border-b-0"
                  : ""
              }`}
            >
              <span className="font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase">
                {c.etiqueta}
              </span>
              <span className="font-display text-[16px] text-crema uppercase sm:text-[17px]">
                {c.valor}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-2.5 text-center">
          <p className="font-cond text-[12px] font-semibold tracking-[0.2em] text-tenue uppercase">
            Consultas comerciales
            <span className="hidden sm:inline"> · </span>
            <a
              href={`mailto:${CONTACTO}?subject=${encodeURIComponent(`Patrocinio · ${EVENTO.nombre}`)}`}
              className="mt-1 block tracking-[0.08em] underline underline-offset-2 transition-colors hover:text-oro sm:mt-0 sm:inline sm:tracking-[0.2em]"
            >
              {CONTACTO}
            </a>
          </p>
          <p className="font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase">
            +18 · Juega con responsabilidad
          </p>
        </div>
      </div>
    </Seccion>
  );
}
