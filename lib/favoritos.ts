import { COMBATES, type Combate, type Peleador } from "./evento";
import type { Conteo } from "./votacion";

export type Favorito = {
  peleador: Peleador;
  rival: Peleador;
  combate: Combate;
  pct: number | null;
  votos: number;
  votosCombate: number;
};

export function rankingFavoritos(conteos: Record<string, Conteo>): Favorito[] {
  const lista: Favorito[] = COMBATES.flatMap((combate) => {
    const c = conteos[combate.n];
    const votosCombate = c ? c.votosA + c.votosB : 0;
    const pctA = c && votosCombate > 0 ? c.pctA : null;
    return [
      {
        peleador: combate.a,
        rival: combate.b,
        combate,
        pct: pctA,
        votos: c?.votosA ?? 0,
        votosCombate,
      },
      {
        peleador: combate.b,
        rival: combate.a,
        combate,
        pct: pctA === null ? null : 100 - pctA,
        votos: c?.votosB ?? 0,
        votosCombate,
      },
    ];
  });

  return lista.sort(
    (x, y) =>
      (y.pct ?? -1) - (x.pct ?? -1) ||
      y.votos - x.votos ||
      x.peleador.nombre.localeCompare(y.peleador.nombre, "es"),
  );
}
