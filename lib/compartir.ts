import { COMBATES, EVENTO, type Combate, type Peleador } from "./evento";

export type Lado = "a" | "b";

const SIN_VOTO = "0";

const ORDEN_CODIGO: readonly Combate[] = [...COMBATES].sort((x, y) =>
  x.n.localeCompare(y.n),
);

export const LARGO_CODIGO = ORDEN_CODIGO.length;

export function codigoDeVotos(votos: Record<string, Lado>): string {
  return ORDEN_CODIGO.map((c) => votos[c.n] ?? SIN_VOTO).join("");
}

export function votosDeCodigo(codigo: string): Record<string, Lado> | null {
  if (codigo.length !== LARGO_CODIGO) return null;

  const votos: Record<string, Lado> = {};
  for (const [i, combate] of ORDEN_CODIGO.entries()) {
    const c = codigo[i];
    if (c === "a" || c === "b") votos[combate.n] = c;
    else if (c !== SIN_VOTO) return null;
  }

  return Object.keys(votos).length > 0 ? votos : null;
}

export type Eleccion = {
  combate: Combate;
  lado: Lado | null;
  elegido: Peleador | null;
  rival: Peleador | null;
};

export function eleccionesDe(votos: Record<string, Lado>): Eleccion[] {
  return COMBATES.map((combate) => {
    const lado = votos[combate.n] ?? null;
    return {
      combate,
      lado,
      elegido: lado ? combate[lado] : null,
      rival: lado ? combate[lado === "a" ? "b" : "a"] : null,
    };
  });
}

export function rutaDePronostico(codigo: string): string {
  return `/pronosticos/${codigo}`;
}

export function textoCompartir({
  votos,
  ganadores = {},
  aciertos = 0,
  resueltos = 0,
}: {
  votos: Record<string, Lado>;
  ganadores?: Record<string, Lado | null | undefined>;
  aciertos?: number;
  resueltos?: number;
}): string {
  const lineas: string[] = [];
  for (const e of eleccionesDe(votos)) {
    if (!e.elegido) continue;
    const ganador = ganadores[e.combate.n];
    const marca = !ganador ? "" : e.lado === ganador ? " ✅" : " ❌";
    lineas.push(`${e.combate.n} · ${e.elegido.nombre}${marca}`);
  }

  return [
    resueltos > 0
      ? `Acerté ${aciertos} de ${resueltos} en ${EVENTO.nombre}:`
      : `Mis pronósticos para ${EVENTO.nombre}:`,
    ...lineas,
  ].join("\n");
}
