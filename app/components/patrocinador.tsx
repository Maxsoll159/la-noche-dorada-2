import Image from "next/image";
import { EVENTO, PATROCINADORES } from "@/lib/evento";
import { Seccion } from "./seccion";

const CREDITOS = [
  { etiqueta: "Produce", valor: EVENTO.productora },
  { etiqueta: "Entradas", valor: "Ticketmaster.pe" },
  { etiqueta: "En vivo", valor: `Kick ${EVENTO.streamCanal}` },
];

const CONTACTO = "comercial@lanochedorada.pe";

/**
 * Escuadras doradas en las esquinas, el mismo recurso de las cards de combate.
 * Aquí hacen doble trabajo: enmarcan el logo —que es lo único que lleva la
 * tarjeta— y encienden en oro al pasar el cursor.
 */
function Escuadras() {
  const comun =
    "pointer-events-none absolute size-5 border-oro-profundo transition-colors duration-300 group-hover:border-oro";
  return (
    <>
      <span aria-hidden className={`${comun} left-3 top-3 border-l-2 border-t-2`} />
      <span aria-hidden className={`${comun} right-3 top-3 border-r-2 border-t-2`} />
      <span aria-hidden className={`${comun} bottom-3 left-3 border-b-2 border-l-2`} />
      <span aria-hidden className={`${comun} bottom-3 right-3 border-b-2 border-r-2`} />
    </>
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
      <div className="flex w-full flex-col items-center gap-9">
        <ul className="grid w-full gap-5 sm:grid-cols-2">
          {PATROCINADORES.map((p) => (
            <li key={p.nombre} className="flex">
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer sponsored"
                aria-label={`Ir al sitio de ${p.nombre} (se abre en otra pestaña)`}
                className="group relative isolate flex w-full items-center justify-center overflow-hidden rounded-sm border border-oro-profundo bg-carbon px-6 py-9 transition duration-300 hover:-translate-y-1 hover:border-oro hover:bg-oro-tinte sm:px-8"
              >
                {/* Resplandor dorado detrás de la marca, el mismo recurso del
                    hero. Con z negativo pinta sobre el fondo de la tarjeta y
                    bajo el logo; `isolate` evita que ese z escape del enlace. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_62%_at_50%_45%,rgba(212,175,55,0.16)_0%,rgba(212,175,55,0)_100%)]"
                />
                <Escuadras />
                {/* Alto fijo: cada marca tiene su proporción, y sin esto las
                    dos tarjetas quedaban de distinto alto. Los `ancho` de
                    lib/evento.ts están calculados para caer todos en ~95 px. */}
                <span className="flex h-24 items-center justify-center">
                  <Image
                    src={p.logo}
                    alt={p.nombre}
                    width={p.w}
                    height={p.h}
                    sizes={`${p.ancho}px`}
                    style={{ width: p.ancho }}
                    className="h-auto max-w-full transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                {/* La flecha es toda la señal de "esto es un enlace externo":
                    un pie de texto debajo del logo solo repetía el nombre. */}
                <svg
                  aria-hidden
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="absolute right-5 top-5 text-oro-profundo transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-oro"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </li>
          ))}
        </ul>

        {/* gap-y para cuando los créditos se parten en varias filas: sin él,
            las filas quedaban pegadas. El separador solo desde sm, que es
            donde los tres entran en una sola línea. */}
        <ul className="flex flex-wrap items-center justify-center gap-y-5 divide-oro-profundo/40 sm:divide-x">
          {CREDITOS.map((c) => (
            <li
              key={c.etiqueta}
              className="flex flex-col items-center gap-1.5 px-7 py-2 sm:px-9"
            >
              <span className="font-cond text-[10px] font-bold uppercase tracking-[0.22em] text-oro-profundo">
                {c.etiqueta}
              </span>
              <span className="font-display text-[17px] uppercase text-crema">
                {c.valor}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-2.5 text-center">
          <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-tenue">
            Consultas comerciales ·{" "}
            <a
              href={`mailto:${CONTACTO}`}
              className="underline underline-offset-2 transition-colors hover:text-oro"
            >
              {CONTACTO}
            </a>
          </p>
          {/* Las dos marcas son de juego online: el aviso va junto a la pieza
              patrocinada, no solo en el pie. */}
          <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-profundo">
            +18 · Juega con responsabilidad
          </p>
        </div>
      </div>
    </Seccion>
  );
}
