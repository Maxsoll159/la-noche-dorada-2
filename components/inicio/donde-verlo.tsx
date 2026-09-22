import {
  IconoCalendario,
  IconoExterno,
  IconoKick,
  IconoReloj,
} from "@/assets/icons";
import { EVENTO } from "@/lib/evento";
import { Bandera } from "@/components/ui/bandera";
import { Seccion } from "@/components/ui/seccion";

const HORARIOS: readonly {
  pais: string;
  zona: string;
  hora: string;
  meridiano: string;
  nota?: string;
  local?: boolean;
}[] = [
  {
    pais: "Perú",
    zona: "Lima · UTC−5",
    hora: "7:00",
    meridiano: "pm",
    nota: "Hora local",
    local: true,
  },
  { pais: "Ecuador", zona: "Quito · UTC−5", hora: "7:00", meridiano: "pm" },
  { pais: "Colombia", zona: "Bogotá · UTC−5", hora: "7:00", meridiano: "pm" },
  { pais: "México", zona: "CDMX · UTC−6", hora: "6:00", meridiano: "pm" },
  { pais: "Bolivia", zona: "La Paz · UTC−4", hora: "8:00", meridiano: "pm" },
  { pais: "Chile", zona: "Santiago · UTC−3", hora: "9:00", meridiano: "pm" },
  {
    pais: "Argentina",
    zona: "Buenos Aires · UTC−3",
    hora: "9:00",
    meridiano: "pm",
  },
  {
    pais: "España",
    zona: "Madrid · UTC+1",
    hora: "1:00",
    meridiano: "am",
    nota: "Domingo 29",
  },
];

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
  if (pais === "Colombia")
    return <Bandera pais="CO" className="h-5 w-[30px]" />;
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
        className="group relative isolate flex w-full flex-col gap-4 overflow-hidden rounded-sm border border-oro bg-oro-tinte px-5 py-5 transition-colors hover:bg-[#1f1808] sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:gap-8"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 -left-20 -z-10 size-72 -translate-y-1/2 rounded-full bg-kick/10 blur-3xl"
        />

        <span className="flex items-center gap-4 sm:gap-5 lg:min-w-[280px]">
          <span className="grid size-14 shrink-0 place-items-center rounded-[12px] bg-kick text-noche shadow-[0_0_28px_rgba(83,252,24,0.3)] transition-transform duration-300 group-hover:scale-105 sm:size-16">
            <IconoKick size={28} />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[26px] leading-none text-crema uppercase sm:text-[30px]">
              Kick
            </span>
            <span className="mt-1 block font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
              Canal oficial {EVENTO.streamCanal}
            </span>
            <span className="mt-1.5 flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.16em] text-kick uppercase">
              <span
                aria-hidden
                className="inline-block size-[7px] latido rounded-full bg-kick"
              />
              Transmisión en vivo y gratis
            </span>
          </span>
        </span>

        <p className="flex items-start gap-2 font-cond text-[12px] leading-snug font-bold tracking-[0.12em] text-crema uppercase lg:hidden">
          <span className="mt-px shrink-0 text-oro">
            <IconoCalendario size={14} />
          </span>
          {EVENTO.fechaLarga} · {EVENTO.hora.replace(" PET", "")} hora de Perú
        </p>
        <ul className="hidden flex-1 flex-wrap gap-2 lg:flex lg:justify-center">
          {[
            { Icono: IconoCalendario, texto: EVENTO.fechaLarga },
            {
              Icono: IconoReloj,
              texto: `${EVENTO.hora.replace(" PET", "")} · hora de Perú`,
            },
          ].map((d) => (
            <li
              key={d.texto}
              className="flex items-center gap-2 rounded-sm border border-oro-profundo/60 bg-noche/50 px-3 py-2 font-cond text-[12px] font-bold tracking-[0.12em] text-crema uppercase"
            >
              <span className="text-oro">
                <d.Icono size={14} />
              </span>
              {d.texto}
            </li>
          ))}
        </ul>

        <span className="flex shrink-0 items-center justify-center gap-2.5 rounded-sm bg-kick px-6 py-3 font-cond text-[13px] font-bold tracking-[0.14em] text-noche uppercase transition-colors group-hover:bg-[#7dff4d] lg:py-3.5">
          Abrir el canal
          <IconoExterno
            size={16}
            strokeWidth={2.4}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </a>

      <div className="mt-5 flex w-full flex-col gap-5">
        <p className="flex items-center gap-3 font-cond text-[13px] font-bold tracking-[0.26em] text-oro uppercase">
          <IconoReloj size={18} />
          Horarios por país
          <span aria-hidden className="h-px flex-1 bg-linea" />
        </p>

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
                    className={`block font-display text-[19px] leading-tight uppercase ${
                      h.local ? "text-oro-claro" : "text-crema"
                    }`}
                  >
                    {h.pais}
                  </span>
                  <span className="block font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase">
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
                    className={`mt-1 font-cond text-[11px] font-bold tracking-[0.1em] uppercase ${
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
