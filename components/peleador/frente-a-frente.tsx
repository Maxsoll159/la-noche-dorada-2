import { EVENTO, type Peleador } from "@/lib/evento";
import { coma, edadEn } from "@/lib/formato";
import { NotaAprox } from "./ficha-tape";

const FILAS_FRENTE: {
  etiqueta: string;
  valor: (p: Peleador) => number | null;
  texto: (n: number, p: Peleador) => string;
  ventaja: "mayor" | "menor";
  diferencia: (d: number) => string;
}[] = [
  {
    etiqueta: "Edad",
    valor: (p) =>
      p.nacimiento ? edadEn(p.nacimiento, EVENTO.inicioISO) : null,
    texto: (n) => String(n),
    ventaja: "menor",
    diferencia: (d) => `${d} ${d === 1 ? "año" : "años"} menos`,
  },
  {
    etiqueta: "Altura",
    valor: (p) => p.altura ?? null,
    texto: (n, p) => `${coma(n, 2)} m${p.aprox ? "*" : ""}`,
    ventaja: "mayor",
    diferencia: (d) => `+${Math.round(d * 100)} cm`,
  },
  {
    etiqueta: "Peso",
    valor: (p) => p.peso ?? null,
    texto: (n, p) => `${coma(n, 1)} kg${p.aprox ? "*" : ""}`,
    ventaja: "mayor",
    diferencia: (d) => `+${coma(d, 1)} kg`,
  },
];

export function FrenteAFrente({
  peleador,
  rival,
}: {
  peleador: Peleador;
  rival: Peleador;
}) {
  return (
    <div className="flex flex-col gap-3">
      <dl className="overflow-hidden rounded-sm border border-linea bg-carbon">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-linea bg-[#08080b] px-4 py-3 sm:px-6">
          <span className="truncate font-display text-[15px] text-oro-claro uppercase sm:text-[18px]">
            {peleador.nombre}
          </span>
          <span className="font-cond text-[11px] font-bold tracking-[0.2em] text-oro-medio uppercase">
            Frente a frente
          </span>
          <span className="truncate text-right font-display text-[15px] text-crema uppercase sm:text-[18px]">
            {rival.nombre}
          </span>
        </div>
        {FILAS_FRENTE.map((fila, i) => {
          const a = fila.valor(peleador);
          const b = fila.valor(rival);
          const hayVentaja = a !== null && b !== null && a !== b;
          const ganaA =
            hayVentaja && (fila.ventaja === "mayor" ? a > b : a < b);
          const ganaB = hayVentaja && !ganaA;
          const distancia = hayVentaja
            ? fila.diferencia(Math.abs(a - b))
            : null;

          const celda = (
            n: number | null,
            p: Peleador,
            gana: boolean,
            derecha: boolean,
          ) => (
            <dd
              className={`flex flex-col gap-1 ${derecha ? "items-end" : "items-start"}`}
            >
              <span
                className={`font-display text-[22px] leading-none tabular-nums sm:text-[26px] ${
                  n === null ? "text-tenue" : gana ? "text-oro" : "text-crema"
                }`}
              >
                {n === null ? "—" : fila.texto(n, p)}
              </span>
              {gana && distancia && (
                <span className="rounded-full border border-oro-profundo bg-oro-tinte px-2 py-[2px] font-cond text-[10px] leading-none font-bold tracking-[0.1em] text-oro uppercase">
                  {distancia}
                </span>
              )}
            </dd>
          );

          return (
            <div
              key={fila.etiqueta}
              className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-6 ${
                i > 0 ? "border-t border-linea/70" : ""
              }`}
            >
              {celda(a, peleador, ganaA, false)}
              <dt className="w-[76px] text-center font-cond text-[11px] font-bold tracking-[0.2em] text-oro uppercase">
                {fila.etiqueta}
              </dt>
              {celda(b, rival, ganaB, true)}
            </div>
          );
        })}
      </dl>
      {(peleador.aprox || rival.aprox) && <NotaAprox />}
    </div>
  );
}
