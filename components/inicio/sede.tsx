import {
  IconoBanderin,
  IconoExterno,
  IconoPersonas,
  IconoPin,
  IconoReloj,
} from "@/assets/icons";
import { EVENTO } from "@/lib/evento";
import { Seccion } from "@/components/ui/seccion";

const { lat, lon } = EVENTO.coordenadas;

const MAPA_EMBEBIDO = `https://maps.google.com/maps?q=${lat},${lon}&z=16&hl=es&output=embed`;
const MAPS = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

const FICHA = [
  {
    Icono: IconoBanderin,
    etiqueta: "Recinto",
    valor: `Coliseo cerrado · ${EVENTO.distrito}`,
  },
  { Icono: IconoPin, etiqueta: "Dirección", valor: EVENTO.direccion },
  {
    Icono: IconoPersonas,
    etiqueta: "Aforo",
    valor: `${new Intl.NumberFormat("es-PE").format(EVENTO.aforo)} personas`,
  },
  { Icono: IconoReloj, etiqueta: "Hora de inicio", valor: EVENTO.hora },
];

function MapaInteractivo() {
  return (
    <figure className="relative h-[360px] overflow-hidden rounded-sm border border-oro-profundo bg-carbon sm:h-[440px] lg:h-full lg:min-h-[460px]">
      <iframe
        src={MAPA_EMBEBIDO}
        title={`Mapa interactivo del ${EVENTO.sede} en ${EVENTO.distrito}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 size-full border-0"
      />
      <figcaption className="pointer-events-none absolute top-4 left-4 flex items-center gap-2 rounded-sm border border-oro-profundo bg-noche/90 px-3 py-1.5 font-cond text-[11px] font-bold tracking-[0.18em] text-oro uppercase shadow-[0_6px_18px_rgba(0,0,0,0.45)] backdrop-blur-sm">
        <IconoPin size={14} />
        {EVENTO.sede}
      </figcaption>
    </figure>
  );
}

export function Sede() {
  return (
    <Seccion
      id="sede"
      antetitulo="Sede del evento"
      titulo={EVENTO.sede}
      bajada={`${EVENTO.distrito}. El coliseo cerrado más emblemático del país se convierte en ring por una noche.`}
    >
      <div className="grid w-full gap-6 lg:grid-cols-[1fr_420px] lg:items-stretch lg:gap-8">
        <MapaInteractivo />

        <div className="flex flex-col gap-4">
          <dl className="flex flex-1 flex-col gap-4">
            {FICHA.map((f) => (
              <div
                key={f.etiqueta}
                className="flex flex-1 flex-col justify-center gap-1 rounded-sm border border-linea bg-carbon px-5 py-4"
              >
                <dt className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase">
                  <f.Icono size={14} className="text-oro" />
                  {f.etiqueta}
                </dt>
                <dd className="font-cond text-[16px] leading-snug font-semibold tracking-[0.06em] text-crema uppercase">
                  {f.valor}
                </dd>
              </div>
            ))}
          </dl>
          <a
            href={MAPS}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-sm border border-oro-profundo px-6 py-4 font-cond text-[14px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte"
          >
            Cómo llegar en Google Maps
            <IconoExterno size={17} strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </Seccion>
  );
}
