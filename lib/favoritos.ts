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

  // Manda la cantidad de votos. El porcentaje solo desempata, y sin redondear:
  // el `pct_a` de la base es entero y fabrica empates que no existen.
  const exacto = (f: Favorito) =>
    f.votosCombate > 0 ? f.votos / f.votosCombate : -1;

  return lista.sort(
    (x, y) =>
      y.votos - x.votos ||
      exacto(y) - exacto(x) ||
      x.peleador.nombre.localeCompare(y.peleador.nombre, "es"),
  );
}

export function puestoDe(ranking: Favorito[], slug: string) {
  const i = ranking.findIndex((f) => f.peleador.slug === slug);
  return i === -1 || ranking[i].votos === 0
    ? null
    : { puesto: i + 1, total: ranking.length };
}
