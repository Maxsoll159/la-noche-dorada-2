// `actual` es el precio de la preventa en curso; null si la zona no se vende en
// esta fase. `anterior` es el de la preventa previa, para mostrar el descuento.
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
    actual: "S/ 70.20",
    anterior: "S/ 89.70",
  },
  {
    nombre: "Tribuna baja",
    detalle: "Sectores A, B, C, D, E y F",
    color: "#B0182B",
    actual: "S/ 126.00",
    anterior: "S/ 161.00",
  },
  {
    nombre: "Golden izquierda",
    detalle: "Lado izquierdo del escenario",
    color: "#D98A2B",
    actual: "S/ 216.00",
    anterior: "S/ 276.00",
  },
  {
    nombre: "Golden derecha",
    detalle: "Lado derecho del escenario",
    color: "#F2B98A",
    actual: "S/ 216.00",
    anterior: "S/ 276.00",
  },
  {
    nombre: "Zona para silla de ruedas",
    detalle: "Accesos junto a los sectores B y E",
    color: "#8a8a92",
    actual: null,
    anterior: "S/ 230.00",
  },
];

export const precioNumero = (precio: string) =>
  parseFloat(precio.replace(/[^\d.]/g, ""));
