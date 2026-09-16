import { EVENTO } from "@/lib/evento";
import { Bandera } from "./bandera";
import { Seccion } from "./seccion";

/**
 * Horas calculadas desde las 7:00 pm PET del sábado 28/11/2026. El meridiano
 * va aparte del número para poder pintarlo más chico al costado. La zona va
 * corta (ciudad y UTC) porque en móvil la sigla se truncaba. `dia` solo se
 * escribe cuando NO es el sábado del evento: repetirlo ocho veces era ruido.
 */
const HORARIOS: readonly {
  pais: string;
  zona: string;
  hora: string;
  meridiano: string;
  /** Línea chica bajo la hora: "Hora local" en Perú, el día cuando cambia. */
  nota?: string;
  /** Solo Perú: se resalta como hora local del evento. */
  local?: boolean;
}[] = [
  { pais: "Perú", zona: "Lima · UTC−5", hora: "7:00", meridiano: "pm", nota: "Hora local", local: true },
  { pais: "Ecuador", zona: "Quito · UTC−5", hora: "7:00", meridiano: "pm" },
  { pais: "Colombia", zona: "Bogotá · UTC−5", hora: "7:00", meridiano: "pm" },
  { pais: "México", zona: "CDMX · UTC−6", hora: "6:00", meridiano: "pm" },
  { pais: "Bolivia", zona: "La Paz · UTC−4", hora: "8:00", meridiano: "pm" },
  { pais: "Chile", zona: "Santiago · UTC−3", hora: "9:00", meridiano: "pm" },
  { pais: "Argentina", zona: "Buenos Aires · UTC−3", hora: "9:00", meridiano: "pm" },
  { pais: "España", zona: "Madrid · UTC+1", hora: "1:00", meridiano: "am", nota: "Domingo 29" },
];

/** Bandas de las banderas que no están en el cartel de peleadores. */
const EXTRA: Record<string, [string, number][]> = {
  Ecuador: [
    ["#FFDD00", 2],
    ["#0033A0", 1],
    ["#EF3340", 1],
  ],
  México: [
    ["#006847", 1],
    ["#FFFFFF", 1],
    ["#CE1126", 1],
  ],
  Bolivia: [
    ["#D52B1E", 1],
    ["#F9E300", 1],
    ["#007934", 1],
  ],
  Argentina: [
    ["#74ACDF", 1],
    ["#FFFFFF", 1],
    ["#74ACDF", 1],
  ],
  España: [
    ["#AA151B", 1],
    ["#F1BF00", 2],
    ["#AA151B", 1],
  ],
};
const VERTICALES = new Set(["Perú", "México"]);

function BanderaPais({ pais }: { pais: string }) {
  if (pais === "Perú") return <Bandera pais="PE" className="h-5 w-[30px]" />;
  if (pais === "Colombia") return <Bandera pais="CO" className="h-5 w-[30px]" />;
  if (pais === "Chile") return <Bandera pais="CL" className="h-5 w-[30px]" />;
  const bandas = EXTRA[pais];
  const total = bandas.reduce((s, [, p]) => s + p, 0);
  return (
    <span
      role="img"
      aria-label={pais}
      className={`inline-flex h-5 w-[30px] overflow-hidden rounded-[2px] ring-1 ring-black/40 ${
        VERTICALES.has(pais) ? "flex-row" : "flex-col"
      }`}
    >
      {bandas.map(([color, peso], i) => (
        <span
          key={i}
          style={{ flexGrow: peso / total, backgroundColor: color }}
          className="block"
        />
      ))}
    </span>
  );
}

/** Glifos de los chips de la card de Kick: calendario y reloj. */
function IconoDato({ nombre }: { nombre: string }) {
  const comun = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (nombre === "calendario")
    return (
      <svg {...comun}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </svg>
    );
  return (
    <svg {...comun}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function LogoKick() {
  return (
    <svg
      aria-hidden
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z" />
    </svg>
  );
}

export function DondeVerlo() {
  return (
    <Seccion
      id="donde-verlo"
      fondo="superficie"
      antetitulo="En vivo por Kick"
      titulo="Dónde verlo"
      bajada={`La señal en vivo va por Kick, en el canal ${EVENTO.streamCanal}. Estos son los horarios de inicio por país.`}
    >
      {/* Tres bloques: marca, datos de la emisión y botón. Antes eran solo la
          marca y una flecha, y en escritorio la card quedaba con dos tercios
          vacíos. */}
      <a
        href={EVENTO.streamUrl}
        target="_blank"
        rel="noreferrer"
        className="group relative isolate flex w-full flex-col gap-4 overflow-hidden rounded-sm border border-oro bg-oro-tinte px-5 py-5 transition-colors hover:bg-[#1f1808] sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:gap-8"
      >
        {/* Resplandor verde detrás del logo, el color de Kick */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-20 top-1/2 -z-10 size-72 -translate-y-1/2 rounded-full bg-kick/10 blur-3xl"
        />

        <span className="flex items-center gap-4 sm:gap-5 lg:min-w-[280px]">
          <span className="grid size-14 shrink-0 place-items-center rounded-[12px] bg-kick text-noche shadow-[0_0_28px_rgba(83,252,24,0.3)] transition-transform duration-300 group-hover:scale-105 sm:size-16">
            <LogoKick />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[26px] uppercase leading-none text-crema sm:text-[30px]">
              Kick
            </span>
            <span className="mt-1 block font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-tenue">
              Canal oficial {EVENTO.streamCanal}
            </span>
            <span className="mt-1.5 flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-kick">
              <span aria-hidden className="latido inline-block size-[7px] rounded-full bg-kick" />
              Transmisión en vivo y gratis
            </span>
          </span>
        </span>

        {/* Cuándo: la fecha y la hora de Perú, que es la referencia de la
            lista de horarios de abajo. En móvil va en una sola línea de
            texto: los chips apilados se comían media pantalla. */}
        <p className="flex items-start gap-2 font-cond text-[12px] font-bold uppercase leading-snug tracking-[0.12em] text-crema lg:hidden">
          <span className="mt-px shrink-0 text-oro">
            <IconoDato nombre="calendario" />
          </span>
          {EVENTO.fechaLarga} · {EVENTO.hora.replace(" PET", "")} hora de Perú
        </p>
        <ul className="hidden flex-1 flex-wrap gap-2 lg:flex lg:justify-center">
          {[
            { icono: "calendario", texto: EVENTO.fechaLarga },
            // Sin la sigla PET: "hora de Perú" ya lo dice y juntas sobraban.
            { icono: "reloj", texto: `${EVENTO.hora.replace(" PET", "")} · hora de Perú` },
          ].map((d) => (
            <li
              key={d.texto}
              className="flex items-center gap-2 rounded-sm border border-oro-profundo/60 bg-noche/50 px-3 py-2 font-cond text-[12px] font-bold uppercase tracking-[0.12em] text-crema"
            >
              <span className="text-oro">
                <IconoDato nombre={d.icono} />
              </span>
              {d.texto}
            </li>
          ))}
        </ul>

        <span className="flex shrink-0 items-center justify-center gap-2.5 rounded-sm bg-kick px-6 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.14em] text-noche transition-colors group-hover:bg-[#7dff4d] lg:py-3.5">
          Abrir el canal
          <svg
            aria-hidden
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </a>

      {/* Separación de la tarjeta de Kick: los dos bloques son hijos sueltos de
          `Seccion` y su envoltorio no lleva gap, así que se tocaban. */}
      <div className="mt-5 flex w-full flex-col gap-5">
        <p className="flex items-center gap-3 font-cond text-[13px] font-bold uppercase tracking-[0.26em] text-oro">
          <svg
            aria-hidden
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          Horarios por país
          <span aria-hidden className="h-px flex-1 bg-linea" />
        </p>

        {/* Fichas en rejilla: una columna en móvil (filas compactas, país a
            la izquierda y hora a la derecha), dos en tablet y cuatro en
            escritorio. A dos columnas en móvil las losetas se apilaban en
            alto y quedaban desparejas entre sí. */}
        <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {HORARIOS.map((h) => (
            <li
              key={h.pais}
              className={`flex items-center justify-between gap-4 rounded-sm border px-4 py-3 transition-colors sm:py-3.5 ${
                h.local
                  ? "border-oro bg-oro-tinte"
                  : "border-linea bg-carbon hover:border-oro-profundo hover:bg-oro-tinte/60"
              }`}
            >
              <span className="flex min-w-0 items-center gap-3">
                <BanderaPais pais={h.pais} />
                <span className="min-w-0">
                  <span
                    className={`block font-display text-[19px] uppercase leading-tight ${
                      h.local ? "text-oro-claro" : "text-crema"
                    }`}
                  >
                    {h.pais}
                  </span>
                  <span className="block font-cond text-[11px] font-semibold uppercase tracking-[0.12em] text-tenue">
                    {h.zona}
                  </span>
                </span>
              </span>
              <span
                className={`flex shrink-0 flex-col items-end ${
                  h.local ? "text-oro" : "text-crema"
                }`}
              >
                <span className="flex items-baseline gap-1 leading-none">
                  <span className="font-display text-[26px] tabular-nums">
                    {h.hora}
                  </span>
                  <span className="font-cond text-[12px] font-bold uppercase">
                    {h.meridiano}
                  </span>
                </span>
                {h.nota && (
                  <span
                    className={`mt-1 font-cond text-[11px] font-bold uppercase tracking-[0.1em] ${
                      h.local ? "text-oro" : "text-oro-medio"
                    }`}
                  >
                    {h.nota}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
