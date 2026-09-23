import Image from "next/image";
import { IconoRed } from "@/assets/icons";
import { CASA_APUESTAS, EVENTO, REDES_EVENTO } from "@/lib/evento";
import { DESARROLLADOR } from "@/lib/sitio";
import { FileteOro } from "@/components/ui/filete-oro";

const ENLACES = [
  { href: "/#combates", label: "Combates" },
  { href: "/#cara-a-cara", label: "Cara a cara" },
  { href: "/#pronosticos", label: "Pronósticos" },
  { href: "/#entradas", label: "Entradas" },
  { href: "/#sede", label: "Sede" },
  { href: "/#donde-verlo", label: "Dónde verlo" },
  { href: "/#preguntas-frecuentes", label: "Preguntas frecuentes" },
];

const ROTULO =
  "font-cond text-[11px] font-semibold tracking-[0.2em] text-tenue uppercase sm:text-[12px]";

function Separador() {
  return (
    <div aria-hidden className="flex w-full max-w-[220px] items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-oro-profundo" />
      <span className="size-2 rotate-45 border border-oro bg-oro-tinte" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-oro-profundo" />
    </div>
  );
}

function Redes() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
      {REDES_EVENTO.map((r) => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`${EVENTO.nombre} en ${r.plataforma}`}
            className="group flex items-center gap-2.5 font-display text-[18px] tracking-wide text-crema uppercase transition-colors hover:text-oro-claro"
          >
            <span
              style={{ color: r.color }}
              className="transition-transform duration-300 group-hover:scale-110"
            >
              <IconoRed plataforma={r.plataforma} size={22} />
            </span>
            {r.usuario}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Franja() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0 sm:divide-x sm:divide-oro-profundo/50">
      {CASA_APUESTAS && (
        <a
          href={CASA_APUESTAS.url}
          target="_blank"
          rel="noreferrer sponsored"
          className={`group flex items-center gap-3 sm:px-7 ${ROTULO}`}
        >
          Web patrocinada por
          <Image
            src={CASA_APUESTAS.logo}
            alt={CASA_APUESTAS.nombre}
            width={CASA_APUESTAS.w}
            height={CASA_APUESTAS.h}
            sizes="72px"
            className="h-auto w-[72px] transition-transform duration-300 group-hover:scale-105"
          />
        </a>
      )}
      <a
        href={EVENTO.entradasUrl}
        target="_blank"
        rel="noreferrer"
        className={`sm:px-7 ${ROTULO} transition-colors hover:text-oro`}
      >
        Entradas en <span className="text-crema">Ticketmaster.pe</span>
      </a>
      <p className={`sm:px-7 ${ROTULO} text-oro-medio`}>
        +18 · Juega con responsabilidad
      </p>
    </div>
  );
}

function CreditoDesarrollo() {
  const nombre =
    "text-crema underline decoration-oro-profundo decoration-1 underline-offset-[5px]";

  return (
    <p className={ROTULO}>
      Desarrollado por{" "}
      {DESARROLLADOR.url ? (
        <a
          href={DESARROLLADOR.url}
          target="_blank"
          rel="noreferrer"
          className={`${nombre} transition-colors hover:text-oro hover:decoration-oro`}
        >
          {DESARROLLADOR.nombre}
        </a>
      ) : (
        <span className={nombre}>{DESARROLLADOR.nombre}</span>
      )}
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-[#08080a]">
      <FileteOro />
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src="/cartel-oficial-v2.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[center_30%] opacity-[0.12] grayscale-[0.4]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#08080a_0%,rgba(8,8,10,0.72)_40%,rgba(8,8,10,0.85)_75%,#08080a_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_70%_at_50%_100%,rgba(212,175,55,0.12)_0%,rgba(212,175,55,0)_100%)]" />
      </div>

      <div className="mx-auto flex max-w-contenido flex-col items-center gap-10 px-6 pt-14 pb-10 text-center sm:pt-16 lg:px-14">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/marca/logo-noche-dorada.webp"
            alt={EVENTO.nombre}
            width={455}
            height={406}
            sizes="170px"
            className="h-auto w-[150px] sm:w-[170px]"
          />
          <p className="max-w-md text-[15px] leading-relaxed text-tenue">
            La segunda edición del evento de boxeo entre creadores de contenido
            más grande del Perú.
          </p>
        </div>

        <nav aria-label="Secciones del sitio">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3">
            {ENLACES.map((e) => (
              <li key={e.href}>
                <a
                  href={e.href}
                  className="font-cond text-[13px] font-semibold tracking-[0.14em] text-tenue uppercase transition-colors hover:text-oro"
                >
                  {e.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Redes />

        <Franja />

        <Separador />

        <div className="flex flex-col items-center gap-3">
          <p className={ROTULO}>
            <span className="text-crema">© 2026 {EVENTO.nombre}</span>
            <span className="text-oro-medio"> · </span>
            Todos los derechos reservados
          </p>
          <CreditoDesarrollo />
        </div>
      </div>
    </footer>
  );
}
