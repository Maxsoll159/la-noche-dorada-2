import Image from "next/image";
import { EVENTO, PATROCINADORES } from "@/lib/evento";
import { Seccion } from "./seccion";

const CREDITOS = [
  { etiqueta: "Produce", valor: EVENTO.productora },
  { etiqueta: "Entradas", valor: "Ticketmaster.pe" },
  { etiqueta: "En vivo", valor: `Kick ${EVENTO.streamCanal}` },
];

const CONTACTO = "comercial@lanochedorada.pe";

/** "https://www.stake.pe/x" -> "stake.pe": el dominio como pie de la marca. */
const dominio = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function Flecha({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      className={className}
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function Patrocinador() {
  return (
    <Seccion
      id="patrocinadores"
      antetitulo="Con el respaldo de"
      titulo="Patrocinadores"
    >
      {/* Un solo hijo: el envoltorio de `Seccion` no lleva gap, así que varios
          hijos sueltos se tocarían entre sí. */}
      <div className="flex w-full flex-col items-center gap-8 sm:gap-9">
        {/* Antes eran dos rectángulos grandes con solo el logo y una flecha;
            el pie con nombre, dominio y "Visitar" les da base y dice adónde
            llevan. */}
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
                {/* Resplandor dorado detrás de la marca, el mismo recurso del
                    hero. Con z negativo pinta sobre el fondo de la tarjeta y
                    bajo el logo; `isolate` evita que ese z escape del enlace. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-[radial-gradient(60%_80%_at_50%_50%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_100%)]"
                />
                {/* Alto fijo: cada marca tiene su proporción, y sin esto las
                    tarjetas quedaban de distinto alto. Los `ancho` de
                    lib/evento.ts están calculados para caer todos en ~95 px. */}
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
                {/* Pie con nombre, dominio y la señal de enlace externo: le da
                    base a la tarjeta y dice adónde lleva. */}
                <span className="flex items-center justify-between gap-3 border-t border-linea bg-[#08080b] px-5 py-3">
                  <span className="min-w-0">
                    <span className="block truncate font-display text-[15px] uppercase leading-tight text-crema">
                      {p.nombre}
                    </span>
                    <span className="block truncate font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-tenue">
                      {dominio(p.url)}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro">
                    Visitar
                    <Flecha className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Créditos. En móvil, filas etiqueta/valor dentro de una card: los
            tres bloques centrados se partían en dos más uno y quedaban
            descuadrados. Desde sm, la fila de tres con separadores. */}
        <ul className="w-full rounded-sm border border-linea bg-carbon sm:w-auto sm:border-0 sm:bg-transparent sm:flex sm:items-center sm:justify-center sm:divide-x sm:divide-oro-profundo/40">
          {CREDITOS.map((c, i) => (
            <li
              key={c.etiqueta}
              className={`flex items-center justify-between gap-4 px-5 py-3 sm:flex-col sm:justify-center sm:gap-1.5 sm:px-9 sm:py-2 ${
                i < CREDITOS.length - 1 ? "border-b border-linea sm:border-b-0" : ""
              }`}
            >
              <span className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-medio">
                {c.etiqueta}
              </span>
              <span className="font-display text-[16px] uppercase text-crema sm:text-[17px]">
                {c.valor}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-2.5 text-center">
          {/* El correo en su propia línea en móvil: partido a media palabra
              no se leía. */}
          <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-tenue">
            Consultas comerciales
            <span className="hidden sm:inline"> · </span>
            <a
              href={`mailto:${CONTACTO}?subject=${encodeURIComponent(`Patrocinio · ${EVENTO.nombre}`)}`}
              className="mt-1 block tracking-[0.08em] underline underline-offset-2 transition-colors hover:text-oro sm:mt-0 sm:inline sm:tracking-[0.2em]"
            >
              {CONTACTO}
            </a>
          </p>
          {/* Las dos marcas son de juego online: el aviso va junto a la pieza
              patrocinada, no solo en el pie. */}
          <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-medio">
            +18 · Juega con responsabilidad
          </p>
        </div>
      </div>
    </Seccion>
  );
}
