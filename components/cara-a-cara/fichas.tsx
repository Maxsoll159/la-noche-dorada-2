import type { Peleador } from "@/lib/evento";
import { FILAS_TAPE } from "@/components/peleador/ficha-tape";
import { LADO, type Lado } from "./constantes";

export function Ficha({
  peleador,
  lado,
  className = "",
}: {
  peleador: Peleador;
  lado: Lado;
  className?: string;
}) {
  const izq = lado === "a";
  const estilo = LADO[lado];
  return (
    <div
      key={peleador.slug}
      className={`flex cambio-texto flex-col gap-2 rounded-sm bg-noche/70 px-3 py-2.5 backdrop-blur-sm lg:px-4 lg:py-3.5 ${
        izq
          ? `items-start border-l-2 text-left ${estilo.borde}`
          : `items-end border-r-2 text-right ${estilo.borde}`
      } ${className}`}
    >
      <p
        className={`flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.16em] text-tenue uppercase ${
          izq ? "" : "flex-row-reverse"
        }`}
      >
        <span
          className={`grid size-4 place-items-center font-display text-[11px] leading-none text-white ${estilo.fondo}`}
        >
          {estilo.numero}
        </span>
        <span className="truncate">{peleador.nombre}</span>
      </p>
      <dl
        className={`flex gap-4 sm:gap-5 lg:flex-col lg:gap-2 ${izq ? "" : "flex-row-reverse lg:flex-col"}`}
      >
        {FILAS_TAPE.map((fila) => {
          const v = fila.valor(peleador);
          return (
            <div
              key={fila.etiqueta}
              className={`flex flex-col gap-0.5 ${izq ? "items-start" : "items-end"}`}
            >
              <dt className="font-cond text-[10px] font-bold tracking-[0.18em] text-oro-medio uppercase sm:text-[11px]">
                {fila.etiqueta}
              </dt>
              <dd
                className={`font-display text-[14px] leading-none whitespace-nowrap sm:text-[18px] lg:text-[20px] ${
                  v ? "text-crema" : "text-tenue"
                }`}
              >
                {v ?? "—"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

export function FichaComparada({
  izq,
  der,
  clave,
}: {
  izq: Peleador;
  der: Peleador;
  clave: string;
}) {
  return (
    <dl
      key={clave}
      className="cambio-texto overflow-hidden rounded-sm border border-linea bg-noche/70"
    >
      <div className="flex items-center justify-between gap-3 border-b border-linea bg-[#08080b] px-3 py-2.5">
        {(["a", "b"] as const).map((lado) => {
          const primero = lado === "a";
          const p = primero ? izq : der;
          return (
            <span
              key={lado}
              className={`flex min-w-0 items-center gap-2 ${
                primero ? "" : "flex-row-reverse text-right"
              }`}
            >
              <span
                className={`grid size-4 shrink-0 place-items-center font-display text-[11px] leading-none text-white ${LADO[lado].fondo}`}
              >
                {LADO[lado].numero}
              </span>
              <span className="truncate font-cond text-[11px] font-bold tracking-[0.14em] text-crema uppercase">
                {p.nombre}
              </span>
            </span>
          );
        })}
      </div>
      {FILAS_TAPE.map((fila, i) => {
        const a = fila.valor(izq);
        const b = fila.valor(der);
        return (
          <div
            key={fila.etiqueta}
            className={`flex items-center gap-2 px-3 py-2 ${i > 0 ? "border-t border-linea/70" : ""}`}
          >
            <dd
              className={`flex-1 text-left font-display text-[17px] leading-none whitespace-nowrap ${
                a ? "text-crema" : "text-tenue"
              }`}
            >
              {a ?? "—"}
            </dd>
            <dt className="w-[68px] shrink-0 text-center font-cond text-[10px] font-bold tracking-[0.2em] text-oro uppercase">
              {fila.etiqueta}
            </dt>
            <dd
              className={`flex-1 text-right font-display text-[17px] leading-none whitespace-nowrap ${
                b ? "text-crema" : "text-tenue"
              }`}
            >
              {b ?? "—"}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
