import type { Pais } from "./peleadores";

export const BANDERAS: Record<
  Pais,
  {
    nombre: string;
    orientacion: "v" | "h";
    bandas: [string, number][];
    canton?: { color: string; estrella?: boolean };
    emblema?: boolean;
  }
> = {
  PE: {
    nombre: "Perú",
    orientacion: "v",
    bandas: [
      ["#D91023", 1],
      ["#FFFFFF", 1],
      ["#D91023", 1],
    ],
  },
  CO: {
    nombre: "Colombia",
    orientacion: "h",
    bandas: [
      ["#FCD116", 2],
      ["#003893", 1],
      ["#CE1126", 1],
    ],
  },
  CL: {
    nombre: "Chile",
    orientacion: "h",
    bandas: [
      ["#FFFFFF", 1],
      ["#D52B1E", 1],
    ],
    canton: { color: "#0039A6", estrella: true },
  },
  EC: {
    nombre: "Ecuador",
    orientacion: "h",
    bandas: [
      ["#FFDD00", 2],
      ["#0033A0", 1],
      ["#EF3340", 1],
    ],
    emblema: true,
  },
};
