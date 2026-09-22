export function edadEn(nacimientoISO: string, referenciaISO: string): number {
  const [an, mn, dn] = nacimientoISO.slice(0, 10).split("-").map(Number);
  const [ar, mr, dr] = referenciaISO.slice(0, 10).split("-").map(Number);
  return ar - an - (mr < mn || (mr === mn && dr < dn) ? 1 : 0);
}

export const coma = (n: number, decimales: number) =>
  n.toFixed(decimales).replace(".", ",");
