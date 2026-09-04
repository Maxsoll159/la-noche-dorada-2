import Image from "next/image";
import { EVENTO } from "@/lib/evento";
import { Seccion } from "./seccion";

const CREDITOS = [
  { etiqueta: "Produce", valor: EVENTO.productora },
  { etiqueta: "Entradas", valor: "Ticketmaster.pe" },
  { etiqueta: "En vivo", valor: `Kick ${EVENTO.streamCanal}` },
];

export function Patrocinador() {
  return (
    <Seccion
      antetitulo="Patrocinador oficial"
      titulo="Patrocinador"
    >
      <a
        href={EVENTO.patrocinadorUrl}
        target="_blank"
        rel="noreferrer sponsored"
        aria-label={`Ir al sitio de ${EVENTO.patrocinador}`}
        className="group flex w-full flex-col items-center gap-6 rounded-sm border border-oro-profundo bg-carbon px-6 py-12 transition duration-300 hover:-translate-y-1 hover:border-oro hover:bg-oro-tinte"
      >
        <Image
          src="/marca/stake.webp"
          alt={EVENTO.patrocinador}
          width={260}
          height={102}
          sizes="300px"
          className="h-auto w-[260px] transition-transform duration-300 group-hover:scale-105"
        />
        <span aria-hidden className="h-px w-16 bg-oro-profundo" />
        <p className="flex items-center gap-2 text-center font-cond text-[12px] font-bold uppercase tracking-[0.26em] text-oro">
          Patrocinador oficial de {EVENTO.nombre}
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </p>
      </a>

      <ul className="flex flex-wrap items-center justify-center divide-oro-profundo/40 sm:divide-x">
        {CREDITOS.map((c) => (
          <li
            key={c.etiqueta}
            className="flex flex-col items-center gap-1.5 px-9 py-2"
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

      <p className="text-center font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-tenue">
        Consultas comerciales · comercial@lanochedorada.pe
      </p>
    </Seccion>
  );
}
