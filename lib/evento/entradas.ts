export const ZONAS: readonly {
  nombre: string;
  detalle: string | null;
  color: string;
  actual: string;
  siguiente: string;
}[] = [
  {
    nombre: "Tribuna alta",
    detalle: "Anillo exterior",
    color: "#FFFFFF",
    actual: "S/ 89.70",
    siguiente: "S/ 103.50",
  },
  {
    nombre: "Tribuna baja",
    detalle: "Sectores A, B, C, D, E y F",
    color: "#B0182B",
    actual: "S/ 161.00",
    siguiente: "S/ 184.00",
  },
  {
    nombre: "Golden izquierda",
    detalle: "Lado izquierdo del escenario",
    color: "#D98A2B",
    actual: "S/ 276.00",
    siguiente: "S/ 299.00",
  },
  {
    nombre: "Golden derecha",
    detalle: "Lado derecho del escenario",
    color: "#F2B98A",
    actual: "S/ 276.00",
    siguiente: "S/ 299.00",
  },
  {
    nombre: "Zona para silla de ruedas",
    detalle: "Accesos junto a los sectores B y E",
    color: "#8a8a92",
    actual: "S/ 230.00",
    siguiente: "S/ 287.50",
  },
];
