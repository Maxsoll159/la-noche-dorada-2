import Image from "next/image";
import { EVENTO } from "@/lib/evento";
import { Seccion } from "./seccion";

const FICHA = [
  { etiqueta: "Recinto", valor: `Coliseo cerrado · ${EVENTO.distrito}` },
  { etiqueta: "Fecha", valor: EVENTO.fechaLarga },
  { etiqueta: "Dirección", valor: EVENTO.direccion },
  { etiqueta: "Entradas", valor: "Ticketmaster.pe" },
];

const MAPS = `https://www.google.com/maps/search/?api=1&query=${EVENTO.coordenadas.lat},${EVENTO.coordenadas.lon}`;

export function Sede() {
  return (
    <Seccion
      id="sede"
      antetitulo="Sede del evento"
      titulo={EVENTO.sede}
      bajada={`${EVENTO.distrito}. El coliseo cerrado más emblemático del país se convierte en ring por una noche.`}
    >
      <div className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
        <figure className="relative overflow-hidden rounded-sm border border-linea">
          <Image
            src="/mapa-dibos.png"
            alt={`Mapa de ubicación del ${EVENTO.sede} en ${EVENTO.distrito}`}
            width={1200}
            height={860}
            sizes="(min-width: 1024px) 700px, 100vw"
            className="h-auto w-full"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-noche/85"
          />
          <figcaption className="absolute left-6 top-6 flex items-center gap-2 rounded-sm border border-oro-profundo bg-noche/90 px-3 py-1.5 font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro">
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {EVENTO.sede}
          </figcaption>
          <p className="absolute bottom-6 left-6 font-cond text-[15px] font-bold uppercase tracking-[0.16em] text-crema">
            Av. Angamos Este 2681 · San Borja
          </p>
        </figure>

        <div className="flex flex-col gap-4">
          {FICHA.map((f) => (
            <div
              key={f.etiqueta}
              className="rounded-sm border border-linea bg-carbon px-5 py-4"
            >
              <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-profundo">
                {f.etiqueta}
              </p>
              <p className="font-cond text-[16px] font-semibold uppercase leading-snug tracking-[0.06em] text-crema">
                {f.valor}
              </p>
            </div>
          ))}
          <a
            href={MAPS}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-sm border border-oro-profundo px-6 py-4 font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte"
          >
            Ver en Google Maps
            <svg
              aria-hidden
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </Seccion>
  );
}
