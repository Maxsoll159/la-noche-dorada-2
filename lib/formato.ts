export function edadEn(nacimientoISO: string, referenciaISO: string): number {
  const [an, mn, dn] = nacimientoISO.slice(0, 10).split("-").map(Number);
  const [ar, mr, dr] = referenciaISO.slice(0, 10).split("-").map(Number);
  return ar - an - (mr < mn || (mr === mn && dr < dn) ? 1 : 0);
}

export const coma = (n: number, decimales: number) =>
  n.toFixed(decimales).replace(".", ",");

const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const UNIDADES_RELATIVAS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

// "hace 3 minutos", "ayer", "ahora". Para fechas de comentarios y publicaciones.
export function haceCuanto(iso: string) {
  const segundos = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unidad, tamano] of UNIDADES_RELATIVAS) {
    if (Math.abs(segundos) >= tamano)
      return relativo.format(Math.round(segundos / tamano), unidad);
  }
  return "ahora";
}
