import { COMBATES, EVENTO, type Combate, type Peleador } from "./evento";

/** Esquina del cartel por la que se vota. */
export type Lado = "a" | "b";

/** Carácter de un combate sin pronosticar. */
const SIN_VOTO = "0";

/**
 * Orden POSICIONAL del código compartible, del combate "01" al "08".
 *
 * No es el orden de `COMBATES` (que va del estelar al primero de la noche) a
 * propósito: el código es una cadena de posiciones y tiene que significar lo
 * mismo siempre. Si se colgara del orden de la cartelera, reordenar el cartel
 * giraría en silencio el significado de todos los enlaces ya compartidos.
 * Renumerar un combate sí los rompe, y eso ya es una operación de dos lados
 * (ver README): un enlace viejo pasaría a leerse contra el cartel nuevo.
 */
const ORDEN_CODIGO: readonly Combate[] = [...COMBATES].sort((x, y) =>
  x.n.localeCompare(y.n),
);

/** Largo exacto que tiene que tener un código para ser válido. */
export const LARGO_CODIGO = ORDEN_CODIGO.length;

/** Los votos en una cadena corta y legible: "ab0aabba". */
export function codigoDeVotos(votos: Record<string, Lado>): string {
  return ORDEN_CODIGO.map((c) => votos[c.n] ?? SIN_VOTO).join("");
}

/**
 * La vuelta: de la cadena a los votos. Devuelve null si el código no cuadra
 * con la cartelera o si no lleva ni un pronóstico, para que la página pueda
 * responder 404 en vez de pintar una tarjeta vacía.
 */
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
  /** Null en los combates que esa persona no pronosticó. */
  lado: Lado | null;
  elegido: Peleador | null;
  rival: Peleador | null;
};

/**
 * Las ocho elecciones en orden de CARTELERA (el estelar primero), que es como
 * se leen en la web y en la imagen. El orden del código es otro y vive arriba.
 */
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

/** Ruta de la página que enseña unos pronósticos. */
export function rutaDePronostico(codigo: string): string {
  return `/pronosticos/${codigo}`;
}

/**
 * El texto que viaja junto al enlace. Es lo que se lee cuando la app de
 * destino no despliega la vista previa de la imagen, así que tiene que
 * sostenerse solo: una línea por combate elegido y, si ya hay resultados, la
 * marca de acierto o fallo.
 */
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
