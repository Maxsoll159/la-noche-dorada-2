import { EVENTO } from "@/lib/evento";
import { Bandera } from "./bandera";
import { Seccion } from "./seccion";

/**
 * Horas calculadas desde las 7:00 pm PET del sábado 28/11/2026. El meridiano
 * va aparte del número para poder pintarlo más chico al costado.
 */
const HORARIOS: readonly {
  pais: string;
  zona: string;
  hora: string;
  meridiano: string;
  dia: string;
  /** Solo Perú: se resalta como hora local del evento. */
  local?: boolean;
}[] = [
  { pais: "Perú", zona: "Lima · PET (UTC−5)", hora: "7:00", meridiano: "pm", dia: "Sáb 28", local: true },
  { pais: "Ecuador", zona: "Quito · ECT (UTC−5)", hora: "7:00", meridiano: "pm", dia: "Sáb 28" },
  { pais: "Colombia", zona: "Bogotá · COT (UTC−5)", hora: "7:00", meridiano: "pm", dia: "Sáb 28" },
  { pais: "México", zona: "CDMX · CST (UTC−6)", hora: "6:00", meridiano: "pm", dia: "Sáb 28" },
  { pais: "Bolivia", zona: "La Paz · BOT (UTC−4)", hora: "8:00", meridiano: "pm", dia: "Sáb 28" },
  { pais: "Chile", zona: "Santiago · CLST (UTC−3)", hora: "9:00", meridiano: "pm", dia: "Sáb 28" },
  { pais: "Argentina", zona: "Buenos Aires · ART (UTC−3)", hora: "9:00", meridiano: "pm", dia: "Sáb 28" },
  { pais: "España", zona: "Madrid · CET (UTC+1)", hora: "1:00", meridiano: "am", dia: "Dom 29" },
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
      <a
        href={EVENTO.streamUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex w-full items-center gap-5 rounded-sm border border-oro bg-oro-tinte px-7 py-6 transition-colors hover:bg-[#1f1808]"
      >
        <span className="grid size-[52px] shrink-0 place-items-center rounded-[10px] bg-kick text-noche shadow-[0_0_24px_rgba(83,252,24,0.25)]">
          <LogoKick />
        </span>
        <span className="flex-1">
          <span className="block font-display text-[26px] uppercase leading-tight text-crema">
            Kick
          </span>
          <span className="block font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-tenue">
            Canal oficial {EVENTO.streamCanal}
          </span>
          <span className="mt-1 flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-kick">
            <span aria-hidden className="latido inline-block size-[7px] rounded-full bg-kick" />
            Transmisión en vivo y gratis
          </span>
        </span>
        <svg
          aria-hidden
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="shrink-0 text-kick transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        >
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
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

        <ul className="overflow-hidden rounded-sm border border-linea">
          {HORARIOS.map((h, i) => (
            <li
              key={h.pais}
              className={`flex items-center justify-between gap-5 px-5 py-4 transition-colors sm:px-7 ${
                h.local
                  ? "border border-oro bg-oro-tinte"
                  : `hover:bg-oro-tinte/60 ${i % 2 === 0 ? "bg-carbon" : "bg-[#131318]"} ${
                      i < HORARIOS.length - 1 ? "border-b border-linea" : ""
                    }`
              }`}
            >
              <span className="flex min-w-0 items-center gap-4">
                <BanderaPais pais={h.pais} />
                <span className="min-w-0">
                  <span
                    className={`block font-display text-[20px] uppercase leading-tight ${
                      h.local ? "text-oro-claro" : "text-crema"
                    }`}
                  >
                    {h.pais}
                  </span>
                  <span className="block truncate font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-tenue">
                    {h.zona}
                  </span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3.5">
                {h.local && (
                  <span className="hidden rounded-sm bg-oro px-2.5 py-1 font-cond text-[10px] font-bold uppercase tracking-[0.14em] text-noche sm:block">
                    Hora local
                  </span>
                )}
                <span
                  className={`flex items-baseline gap-1 ${
                    h.local ? "text-oro" : "text-crema"
                  }`}
                >
                  <span className="font-display text-[27px] tabular-nums">
                    {h.hora}
                  </span>
                  <span className="font-cond text-[13px] font-bold uppercase tracking-[0.06em]">
                    {h.meridiano}
                  </span>
                </span>
                <span className="w-[68px] rounded-sm border border-oro-profundo py-1.5 text-center font-cond text-[11px] font-bold uppercase tracking-[0.1em] text-oro-profundo">
                  {h.dia}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Seccion>
  );
}
