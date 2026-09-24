import Image from "next/image";
import { SPONSORS, type Sponsor } from "@/lib/evento";
import { BarridoLuz, REBOTE, ResplandorDorado } from "./efectos-marca";

const SOBRAN = SPONSORS.length % 3;

function Marca({ sponsor }: { sponsor: Sponsor }) {
  if (sponsor.logo) {
    return (
      <Image
        src={sponsor.logo.src}
        alt={sponsor.nombre}
        width={sponsor.logo.w}
        height={sponsor.logo.h}
        sizes="160px"
        className={`relative h-auto max-h-7 w-auto max-w-[76%] object-contain opacity-70 brightness-0 invert transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0 sm:max-h-9 sm:max-w-[72%] ${REBOTE}`}
      />
    );
  }

  return (
    <span
      className={`relative font-display text-[18px] tracking-wide text-crema/70 uppercase transition-all duration-500 group-hover:scale-110 group-hover:text-oro-claro sm:text-[20px] ${REBOTE}`}
    >
      {sponsor.nombre}
    </span>
  );
}

function Loseta({ sponsor }: { sponsor: Sponsor }) {
  const clases =
    "group relative flex h-20 w-full items-center justify-center overflow-hidden bg-noche px-3 transition-colors duration-500 hover:bg-oro-tinte sm:h-24";
  const contenido = (
    <>
      <ResplandorDorado />
      <BarridoLuz />
      <Marca sponsor={sponsor} />
    </>
  );

  if (!sponsor.url) return <div className={clases}>{contenido}</div>;

  return (
    <a
      href={sponsor.url}
      target="_blank"
      rel="noreferrer sponsored"
      aria-label={`Ir al sitio de ${sponsor.nombre} (se abre en otra pestaña)`}
      className={clases}
    >
      {contenido}
    </a>
  );
}

export function Sponsors() {
  return (
    <div className="flex w-full flex-col gap-5">
      <p className="flex items-center gap-3 font-cond text-[12px] font-bold tracking-[0.26em] text-oro uppercase">
        <span aria-hidden className="h-px flex-1 bg-linea" />
        Sponsors
        <span aria-hidden className="h-px flex-1 bg-linea" />
      </p>
      <ul className="grid grid-cols-6 gap-px overflow-hidden rounded-md border border-linea bg-linea sm:grid-cols-5">
        {SPONSORS.map((s, i) => (
          <li
            key={s.nombre}
            className={`sm:col-span-1 ${
              i < SPONSORS.length - SOBRAN
                ? "col-span-2"
                : SOBRAN === 1
                  ? "col-span-6"
                  : "col-span-3"
            }`}
          >
            <Loseta sponsor={s} />
          </li>
        ))}
      </ul>
    </div>
  );
}
