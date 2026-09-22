import { COMBATES, EVENTO, PREVENTAS, ZONAS } from "@/lib/evento";
import { Acordeon, type ItemAcordeon } from "@/components/ui/acordeon";
import { Seccion } from "@/components/ui/seccion";

const estelar = COMBATES.find((c) => c.estelar) ?? COMBATES[0];
const semifondo = COMBATES.find((c) => c.billing === "Semifondo");
const precioMinimo = ZONAS.reduce((min, z) =>
  parseFloat(z.actual.replace(/[^\d.]/g, "")) <
  parseFloat(min.actual.replace(/[^\d.]/g, ""))
    ? z
    : min,
).actual;
const sillaDeRuedas = ZONAS.find((z) => z.nombre.includes("silla de ruedas"));
const aforo = new Intl.NumberFormat("es-PE").format(EVENTO.aforo);

const PREGUNTAS: readonly ItemAcordeon[] = [
  {
    pregunta: `¿Cuándo es ${EVENTO.nombre}?`,
    respuesta: (
      <p>
        El <strong>{EVENTO.fechaLarga.toLowerCase()} de 2026</strong>. El inicio
        está previsto a las <strong>{EVENTO.hora.replace(" PET", "")}</strong>{" "}
        (hora de Perú) en el {EVENTO.sede}, {EVENTO.distrito}.
      </p>
    ),
  },
  {
    pregunta: "¿Dónde se puede ver en vivo?",
    respuesta: (
      <p>
        La transmisión es en vivo y gratis por{" "}
        <a href={EVENTO.streamUrl} target="_blank" rel="noreferrer">
          Kick {EVENTO.streamCanal}
        </a>
        . En la sección <a href="#donde-verlo">Dónde verlo</a> tienes la hora de
        inicio en cada país.
      </p>
    ),
  },
  {
    pregunta: "¿Cuáles son los combates confirmados?",
    respuesta: (
      <>
        <p>
          Son {COMBATES.length} combates, del estelar al primero de la noche:
        </p>
        <ol className="mt-3 flex flex-col gap-1.5">
          {COMBATES.map((c) => (
            <li key={c.n} className="flex gap-3">
              <span className="font-display text-oro tabular-nums">{c.n}</span>
              <span>
                <strong>{c.a.nombre}</strong> vs <strong>{c.b.nombre}</strong>
                {c.billing && (
                  <span className="text-oro-medio"> · {c.billing}</span>
                )}
              </span>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    pregunta: "¿Cuál es el combate estelar?",
    respuesta: (
      <p>
        <strong>
          {estelar.a.nombre} vs {estelar.b.nombre}
        </strong>
        , el combate {estelar.n} que cierra la noche.
        {semifondo && (
          <>
            {" "}
            El semifondo es{" "}
            <strong>
              {semifondo.a.nombre} vs {semifondo.b.nombre}
            </strong>
            .
          </>
        )}
      </p>
    ),
  },
  {
    pregunta: "¿Cuánto dura cada combate?",
    respuesta: (
      <p>
        Cada combate es a <strong>3 rounds de 2 minutos</strong>. La categoría y
        el horario de cada pelea están por confirmar.
      </p>
    ),
  },
  {
    pregunta: "¿Dónde compro las entradas?",
    respuesta: (
      <p>
        La venta es exclusiva en{" "}
        <a href={EVENTO.entradasUrl} target="_blank" rel="noreferrer">
          Ticketmaster.pe
        </a>
        . Hoy corre la <strong>{PREVENTAS.actual.nombre}</strong> hasta el{" "}
        {PREVENTAS.actual.hasta}, con precios desde{" "}
        <strong>{precioMinimo}</strong>. Mira todas las zonas en{" "}
        <a href="#entradas">Entradas</a>.
      </p>
    ),
  },
  {
    pregunta: "¿Cómo llego al coliseo?",
    respuesta: (
      <p>
        El {EVENTO.sede} está en <strong>{EVENTO.direccion}</strong>,{" "}
        {EVENTO.distrito}, y tiene un aforo de {aforo} personas. En la sección{" "}
        <a href="#sede">Sede</a> tienes el mapa para trazar tu ruta.
      </p>
    ),
  },
  ...(sillaDeRuedas
    ? [
        {
          pregunta: "¿Hay zona para personas en silla de ruedas?",
          respuesta: (
            <p>
              Sí. La <strong>{sillaDeRuedas.nombre.toLowerCase()}</strong> tiene{" "}
              {sillaDeRuedas.detalle?.toLowerCase()} y cuesta{" "}
              {sillaDeRuedas.actual} en la {PREVENTAS.actual.nombre}.
            </p>
          ),
        },
      ]
    : []),
  {
    pregunta: "¿Cómo funcionan los pronósticos?",
    respuesta: (
      <p>
        Entras con tu cuenta de Google y eliges a tu favorito en cada combate.
        Es <strong>un voto por combate</strong>, puedes cambiarlo hasta que
        cierre la votación y nadie ve a quién votaste. Al final puedes{" "}
        <a href="#pronosticos">compartir tus pronósticos</a>.
      </p>
    ),
  },
];

export function PreguntasFrecuentes() {
  return (
    <Seccion
      id="preguntas-frecuentes"
      fondo="superficie"
      antetitulo="Información oficial"
      titulo="Preguntas frecuentes"
      bajada={`Respuestas rápidas sobre fecha, sede, transmisión, combates, entradas y pronósticos de ${EVENTO.nombre}.`}
    >
      <div className="mx-auto w-full max-w-[56rem]">
        <Acordeon items={PREGUNTAS} />
      </div>
    </Seccion>
  );
}
