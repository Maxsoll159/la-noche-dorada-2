import Image from "next/image";
import { SPONSORS, type Sponsor } from "@/lib/evento";
import {
  BarridoLuz,
  EsquinasDoradas,
  REBOTE,
  ResplandorDorado,
} from "./efectos-marca";

function Marca({ sponsor }: { sponsor: Sponsor }) {
  if (sponsor.logo) {
    return (
      <Image
        src={sponsor.logo.src}
        alt={sponsor.nombre}
        width={sponsor.logo.w}
        height={sponsor.logo.h}
        sizes="160px"
        className={`relative h-auto max-h-11 w-auto max-w-[78%] object-contain opacity-85 brightness-0 invert transition-all duration-500 group-hover:scale-115 group-hover:opacity-100 group-hover:brightness-100 group-hover:drop-shadow-[0_0_16px_rgba(212,175,55,0.45)] group-hover:invert-0 ${REBOTE}`}
      />
    );
  }

  return (
    <span
      className={`relative font-display text-[20px] tracking-wide text-crema/85 uppercase transition-all duration-500 group-hover:scale-115 group-hover:text-oro-claro group-hover:drop-shadow-[0_0_16px_rgba(212,175,55,0.45)] sm:text-[22px] ${REBOTE}`}
    >
      {sponsor.nombre}
    </span>
  );
}

function Contenido({ sponsor }: { sponsor: Sponsor }) {
  return (
    <>
      <ResplandorDorado />
      <BarridoLuz />
      <EsquinasDoradas />
      <Marca sponsor={sponsor} />
    </>
  );
}

function Loseta({ sponsor }: { sponsor: Sponsor }) {
  const clases =
    "group relative flex h-24 w-full items-center justify-center px-4 transition-transform duration-500 hover:-translate-y-1";

  if (!sponsor.url) {
    return (
      <div className={clases}>
        <Contenido sponsor={sponsor} />
      </div>
    );
  }

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noreferrer sponsored"
      aria-label={`Ir al sitio de ${sponsor.nombre} (se abre en otra pestaña)`}
      className={clases}
    >
      <Contenido sponsor={sponsor} />
    </a>
  );
}

export function Sponsors() {
  return (
    <div className="flex w-full flex-col gap-6">
      <p className="flex items-center gap-3 font-cond text-[12px] font-bold tracking-[0.26em] text-oro uppercase">
        <span aria-hidden className="h-px flex-1 bg-linea" />
        Sponsors
        <span aria-hidden className="h-px flex-1 bg-linea" />
      </p>
      <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {SPONSORS.map((s) => (
          <li key={s.nombre} className="w-[calc(50%-0.375rem)] sm:w-44 lg:w-48">
            <Loseta sponsor={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
