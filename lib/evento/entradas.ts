// `actual` es el precio de la fase en curso; null si la zona no se vende en
// esta fase. `agotado` marca las zonas sin stock. `anterior` es el precio de la
// fase previa, para mostrar el descuento tachado. Precios de la tabla oficial
// de Ticketmaster.pe, Black Friday (hasta agotar stock); antes, Preventa 3.
export const ZONAS: readonly {
  nombre: string;
  detalle: string | null;
  color: string;
  actual: string | null;
  anterior: string | null;
  agotado?: boolean;
}[] = [
  {
    nombre: "Tribuna alta",
    detalle: "Anillo exterior",
    color: "#FFFFFF",
    actual: "S/ 85.00",
    anterior: "S/ 115.00",
  },
  {
    nombre: "Tribuna baja",
    detalle: "Sectores A, B, C, D, E y F",
    color: "#B0182B",
    actual: "S/ 153.00",
    anterior: "S/ 207.00",
  },
  {
    nombre: "Golden izquierda",
    detalle: "Lado izquierdo del escenario",
    color: "#D98A2B",
    actual: null,
    anterior: null,
    agotado: true,
  },
  {
    nombre: "Golden derecha",
    detalle: "Lado derecho del escenario",
    color: "#F2B98A",
    actual: null,
    anterior: null,
    agotado: true,
  },
  {
    nombre: "Zona para silla de ruedas",
    detalle: "Accesos junto a los sectores B y E",
    color: "#8a8a92",
    actual: "S/ 205.70",
    anterior: "S/ 278.30",
  },
];

export const precioNumero = (precio: string) =>
  parseFloat(precio.replace(/[^\d.]/g, ""));
