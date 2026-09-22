import { EVENTO } from "./evento";

type PaisHorario = {
  nombre: string;
  bandera: string;
  zona: string;
  sede?: boolean;
};

const PAISES: readonly PaisHorario[] = [
  { nombre: "EE. UU. (Oeste)", bandera: "us", zona: "America/Los_Angeles" },
  { nombre: "EE. UU. (Centro)", bandera: "us", zona: "America/Chicago" },
  { nombre: "México", bandera: "mx", zona: "America/Mexico_City" },
  { nombre: "Guatemala", bandera: "gt", zona: "America/Guatemala" },
  { nombre: "El Salvador", bandera: "sv", zona: "America/El_Salvador" },
  { nombre: "Honduras", bandera: "hn", zona: "America/Tegucigalpa" },
  { nombre: "Nicaragua", bandera: "ni", zona: "America/Managua" },
  { nombre: "Costa Rica", bandera: "cr", zona: "America/Costa_Rica" },
  { nombre: "Perú", bandera: "pe", zona: "America/Lima", sede: true },
  { nombre: "Colombia", bandera: "co", zona: "America/Bogota" },
  { nombre: "Ecuador", bandera: "ec", zona: "America/Guayaquil" },
  { nombre: "Panamá", bandera: "pa", zona: "America/Panama" },
  { nombre: "EE. UU. (Este)", bandera: "us", zona: "America/New_York" },
  { nombre: "Venezuela", bandera: "ve", zona: "America/Caracas" },
  { nombre: "Bolivia", bandera: "bo", zona: "America/La_Paz" },
  { nombre: "Puerto Rico", bandera: "pr", zona: "America/Puerto_Rico" },
  { nombre: "Rep. Dominicana", bandera: "do", zona: "America/Santo_Domingo" },
  { nombre: "Chile", bandera: "cl", zona: "America/Santiago" },
  { nombre: "Paraguay", bandera: "py", zona: "America/Asuncion" },
  {
    nombre: "Argentina",
    bandera: "ar",
    zona: "America/Argentina/Buenos_Aires",
  },
  { nombre: "Uruguay", bandera: "uy", zona: "America/Montevideo" },
  { nombre: "España", bandera: "es", zona: "Europe/Madrid" },
];

export type GrupoHorario = {
  hora: string;
  meridiano: "am" | "pm";
  gmt: string;
  offsetMin: number;
  nota: string | null;
  sede: boolean;
  paises: { nombre: string; bandera: string }[];
};

const INICIO = new Date(EVENTO.inicioISO);

function partes(zona: string) {
  const p: Record<string, string> = Object.fromEntries(
    new Intl.DateTimeFormat("es-PE", {
      timeZone: zona,
      weekday: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZoneName: "shortOffset",
    })
      .formatToParts(INICIO)
      .map((x) => [x.type, x.value]),
  );
  const [, signo = "+", h = "0", m = "0"] =
    /GMT([+-])?(\d+)?(?::(\d+))?/.exec(p.timeZoneName) ?? [];
  const offsetMin = (signo === "-" ? -1 : 1) * (Number(h) * 60 + Number(m));
  return {
    dia: `${p.weekday} ${p.day}`,
    numeroDia: p.day,
    hora: Number(p.hour),
    minuto: p.minute,
    gmt: p.timeZoneName,
    offsetMin,
  };
}

const DIA_SEDE = partes("America/Lima").numeroDia;

export function horariosPorPais(): GrupoHorario[] {
  const grupos = new Map<number, GrupoHorario>();

  for (const pais of PAISES) {
    const p = partes(pais.zona);
    let grupo = grupos.get(p.offsetMin);
    if (!grupo) {
      grupo = {
        hora: `${p.hora % 12 || 12}:${p.minuto}`,
        meridiano: p.hora < 12 ? "am" : "pm",
        gmt: p.gmt.replace("-", "−"),
        offsetMin: p.offsetMin,
        nota:
          p.numeroDia === DIA_SEDE
            ? null
            : p.dia[0].toUpperCase() + p.dia.slice(1),
        sede: false,
        paises: [],
      };
      grupos.set(p.offsetMin, grupo);
    }
    grupo.sede ||= Boolean(pais.sede);
    grupo.paises.push({ nombre: pais.nombre, bandera: pais.bandera });
  }

  return [...grupos.values()].sort(
    (a, b) => Number(b.sede) - Number(a.sede) || a.offsetMin - b.offsetMin,
  );
}
