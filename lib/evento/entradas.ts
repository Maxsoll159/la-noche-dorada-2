// `actual` es el precio de la preventa en curso; null si la zona no se vende en
// esta fase. `anterior` es el de la preventa previa, para mostrar el descuento
// tachado; va en null cuando esa fase se agotó sin precio público (como la
// Preventa 1 en Ticketmaster). Precios de la tabla oficial de Ticketmaster.pe,
// Preventa 3 (desde el 7 de noviembre de 2026).
export const ZONAS: readonly {
  nombre: string;
  detalle: string | null;
  color: string;
  actual: string | null;
  anterior: string | null;
}[] = [
  {
    nombre: "Tribuna alta",
    detalle: "Anillo exterior",
    color: "#FFFFFF",
    actual: "S/ 115.00",
    anterior: null,
  },
  {
    nombre: "Tribuna baja",
    detalle: "Sectores A, B, C, D, E y F",
    color: "#B0182B",
    actual: "S/ 207.00",
    anterior: null,
  },
  {
    nombre: "Golden izquierda",
    detalle: "Lado izquierdo del escenario",
    color: "#D98A2B",
    actual: "S/ 345.00",
    anterior: null,
  },
  {
    nombre: "Golden derecha",
    detalle: "Lado derecho del escenario",
    color: "#F2B98A",
    actual: "S/ 345.00",
    anterior: null,
  },
  {
    nombre: "Zona para silla de ruedas",
    detalle: "Accesos junto a los sectores B y E",
    color: "#8a8a92",
    actual: "S/ 278.30",
    anterior: null,
  },
];

export const precioNumero = (precio: string) =>
  parseFloat(precio.replace(/[^\d.]/g, ""));
