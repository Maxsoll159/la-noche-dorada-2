import {
  IconoCalendario,
  IconoExterno,
  IconoKick,
  IconoReloj,
} from "@/assets/icons";
import { EVENTO } from "@/lib/evento";
import { horariosPorPais } from "@/lib/evento/horarios";
import { Seccion } from "@/components/ui/seccion";
import { HorariosPorPais } from "./horarios-por-pais";

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

        <HorariosPorPais
          grupos={horariosPorPais()}
          inicioISO={EVENTO.inicioISO}
        />
      </div>
    </Seccion>
  );
}
