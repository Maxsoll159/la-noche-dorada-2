import { COMBATES, EVENTO, type Combate, type Peleador } from "./evento";

export type Lado = "a" | "b";

export const METODOS = [
  { id: "ko", nombre: "KO", frase: "por KO", letra: "k" },
  { id: "kot", nombre: "KO técnico", frase: "por KO técnico", letra: "t" },
  {
    id: "unanime",
    nombre: "Decisión unánime",
    frase: "por decisión unánime",
    letra: "u",
  },
  {
    id: "descalificacion",
    nombre: "Descalificación",
    frase: "por descalificación",
    letra: "d",
  },
  { id: "empate", nombre: "Empate", frase: "empate", letra: "e" },
] as const;

export type Metodo = (typeof METODOS)[number]["id"];

export const METODO = Object.fromEntries(METODOS.map((m) => [m.id, m])) as {
  [K in Metodo]: Extract<(typeof METODOS)[number], { id: K }>;
};

export function aMetodo(valor: string | null | undefined): Metodo | null {
  return valor && valor in METODO ? (valor as Metodo) : null;
}

const SIN_VOTO = "0";

const ORDEN_CODIGO: readonly Combate[] = [...COMBATES].sort((x, y) =>
  x.n.localeCompare(y.n),
);

export const LARGO_CODIGO = ORDEN_CODIGO.length;

// El código es posicional: un carácter de lado por combate y, si eligió algún
// método, otro bloque igual de largo con la letra del método. Los enlaces
// viejos (solo lados) siguen valiendo.
export function codigoDeVotos(
  votos: Record<string, Lado>,
  metodos: Record<string, Metodo> = {},
): string {
  const lados = ORDEN_CODIGO.map((c) => votos[c.n] ?? SIN_VOTO).join("");
  const conMetodo = ORDEN_CODIGO.some((c) => votos[c.n] && metodos[c.n]);
  if (!conMetodo) return lados;
  return (
    lados +
    ORDEN_CODIGO.map((c) =>
      votos[c.n] && metodos[c.n] ? METODO[metodos[c.n]].letra : SIN_VOTO,
    ).join("")
  );
}

export function votosDeCodigo(codigo: string): Record<string, Lado> | null {
  if (codigo.length !== LARGO_CODIGO && codigo.length !== LARGO_CODIGO * 2)
    return null;

  const votos: Record<string, Lado> = {};
  for (const [i, combate] of ORDEN_CODIGO.entries()) {
    const c = codigo[i];
    if (c === "a" || c === "b") votos[combate.n] = c;
    else if (c !== SIN_VOTO) return null;
  }

  if (codigo.length > LARGO_CODIGO && !metodosDeCodigo(codigo)) return null;

  return Object.keys(votos).length > 0 ? votos : null;
}

export function metodosDeCodigo(codigo: string): Record<string, Metodo> | null {
  const metodos: Record<string, Metodo> = {};
  if (codigo.length !== LARGO_CODIGO * 2) return metodos;

  for (const [i, combate] of ORDEN_CODIGO.entries()) {
    const c = codigo[LARGO_CODIGO + i];
    if (c === SIN_VOTO) continue;
    const m = METODOS.find((x) => x.letra === c);
    if (!m) return null;
    metodos[combate.n] = m.id;
  }
  return metodos;
}

export type Eleccion = {
  combate: Combate;
  lado: Lado | null;
  elegido: Peleador | null;
  rival: Peleador | null;
  metodo: Metodo | null;
};

export function eleccionesDe(
  votos: Record<string, Lado>,
  metodos: Record<string, Metodo> = {},
): Eleccion[] {
  return COMBATES.map((combate) => {
    const lado = votos[combate.n] ?? null;
    return {
      combate,
      lado,
      elegido: lado ? combate[lado] : null,
      rival: lado ? combate[lado === "a" ? "b" : "a"] : null,
      metodo: lado ? (metodos[combate.n] ?? null) : null,
    };
  });
}

export function rutaDePronostico(codigo: string): string {
  return `/pronosticos/${codigo}`;
}

export function textoCompartir({
  votos,
  metodos = {},
  resultados = {},
  aciertos = 0,
  resueltos = 0,
}: {
  votos: Record<string, Lado>;
  metodos?: Record<string, Metodo>;
  resultados?: Record<string, { ganador: Lado | null; resuelto: boolean }>;
  aciertos?: number;
  resueltos?: number;
}): string {
  const lineas: string[] = [];
  for (const e of eleccionesDe(votos, metodos)) {
    if (!e.elegido) continue;
    const r = resultados[e.combate.n];
    const marca = !r?.resuelto ? "" : e.lado === r.ganador ? " ✅" : " ❌";
    const como = e.metodo ? ` · ${METODO[e.metodo].nombre}` : "";
    lineas.push(`${e.combate.n} · ${e.elegido.nombre}${como}${marca}`);
  }

  return [
    resueltos > 0
      ? `Acerté ${aciertos} de ${resueltos} en ${EVENTO.nombre}:`
      : `Mis pronósticos para ${EVENTO.nombre}:`,
    ...lineas,
  ].join("\n");
}
