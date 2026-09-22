import type { CSSProperties } from "react";
import { EVENTO, type Peleador } from "@/lib/evento";
import { coma, edadEn } from "@/lib/formato";

export function FichaFisica({
  peleador,
  sombra,
  style,
}: {
  peleador: Peleador;
  sombra: string;
  style?: CSSProperties;
}) {
  const asterisco = peleador.aprox ? "*" : "";
  const datos = [
    peleador.nacimiento && {
      etiqueta: "Edad",
      valor: String(edadEn(peleador.nacimiento, EVENTO.inicioISO)),
      unidad: "años",
    },
    peleador.altura && {
      etiqueta: "Altura",
      valor: coma(peleador.altura, 2),
      unidad: `m${asterisco}`,
    },
    peleador.peso && {
      etiqueta: "Peso",
      valor: coma(peleador.peso, 1),
      unidad: `kg${asterisco}`,
    },
  ].filter(Boolean) as { etiqueta: string; valor: string; unidad: string }[];

  if (datos.length === 0) return null;

  return (
    <div style={style} className="flex entrada flex-col gap-2">
      <dl
        className="grid overflow-hidden rounded-sm border border-linea bg-carbon"
        style={{
          gridTemplateColumns: `repeat(${datos.length}, minmax(0, 1fr))`,
        }}
      >
        {datos.map((d, i) => (
          <div
            key={d.etiqueta}
            className={`flex flex-col items-center gap-1.5 px-2 py-4 text-center sm:py-5 ${
              i > 0 ? "border-l border-linea" : ""
            }`}
          >
            <dt className="font-cond text-[11px] font-bold tracking-[0.2em] text-oro-medio uppercase">
              {d.etiqueta}
            </dt>
            <dd className="flex items-baseline gap-1 font-display leading-none text-crema">
              <span className="text-[30px] tabular-nums sm:text-[38px]">
                {d.valor}
              </span>
              <span className="font-cond text-[12px] font-bold tracking-[0.1em] text-tenue uppercase">
                {d.unidad}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      {peleador.aprox && (
        <p
          className={`text-center font-cond text-[11px] font-semibold tracking-[0.14em] text-oro-medio uppercase lg:text-left ${sombra}`}
        >
          * Dato no oficial · El pesaje de la velada manda
        </p>
      )}
    </div>
  );
}
