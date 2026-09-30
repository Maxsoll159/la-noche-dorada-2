import { aMetodo, type Lado, type Metodo } from "./compartir";

export type { Lado, Metodo };

// Lo que la web sabe de cada combate: el conteo público y, tras la velada, el
// resultado. Lo arma el servidor a partir de la fila de `combates` y viaja al
// navegador ya convertido; el navegador nunca ve la fila cruda de Supabase.
export type Conteo = {
  votosA: number;
  votosB: number;
  pctA: number | null;
  cierraEn: string;
  ganador: Lado | null;
  metodo: Metodo | null;
  resuelto: boolean;
  votosMetodo: Record<Metodo, number>;
};

export type FilaCombate = {
  numero: string;
  votos_a: number;
  votos_b: number;
  pct_a: number | null;
  cierra_en: string;
  ganador: string | null;
  metodo: string | null;
  metodo_ko: number;
  metodo_kot: number;
  metodo_unanime: number;
  metodo_descalificacion: number;
  metodo_empate: number;
};

export const COLUMNAS_COMBATE =
  "numero, votos_a, votos_b, pct_a, cierra_en, ganador, metodo, metodo_ko, metodo_kot, metodo_unanime, metodo_descalificacion, metodo_empate";

export function aConteo(fila: FilaCombate): Conteo {
  const ganador =
    fila.ganador === "a" || fila.ganador === "b" ? fila.ganador : null;
  const metodo = aMetodo(fila.metodo);
  return {
    votosA: fila.votos_a,
    votosB: fila.votos_b,
    pctA: fila.pct_a,
    cierraEn: fila.cierra_en,
    ganador,
    metodo,
    resuelto: ganador !== null || metodo === "empate",
    votosMetodo: {
      ko: fila.metodo_ko ?? 0,
      kot: fila.metodo_kot ?? 0,
      unanime: fila.metodo_unanime ?? 0,
      descalificacion: fila.metodo_descalificacion ?? 0,
      empate: fila.metodo_empate ?? 0,
    },
  };
}

export function estaAbierto(conteo: Conteo | undefined) {
  return conteo ? new Date(conteo.cierraEn).getTime() > Date.now() : false;
}

export function puntaje(
  conteos: Record<string, Conteo>,
  votos: Record<string, Lado>,
  metodos: Record<string, Metodo> = {},
) {
  let resueltos = 0;
  let aciertos = 0;
  let aciertosMetodo = 0;
  for (const [numero, conteo] of Object.entries(conteos)) {
    if (!conteo.resuelto) continue;
    resueltos += 1;
    if (conteo.ganador && votos[numero] === conteo.ganador) aciertos += 1;
    if (conteo.metodo && votos[numero] && metodos[numero] === conteo.metodo)
      aciertosMetodo += 1;
  }
  return { resueltos, aciertos, aciertosMetodo };
}
