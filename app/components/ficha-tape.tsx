import { EVENTO, PELEADORES, edadEn, type Combate, type Peleador } from "@/lib/evento";

/** Coma decimal: la ficha se lee en español. */
const coma = (n: number, decimales: number) =>
  n.toFixed(decimales).replace(".", ",");

const marca = (p: Peleador) => (p.aprox ? "*" : "");

/**
 * Cada fila devuelve null cuando el dato no está publicado y la tabla pinta el
 * guion. Con 4 de los 16 sin ningún dato físico, el hueco es el caso normal,
 * no la excepción.
 */
export const FILAS_TAPE: {
  etiqueta: string;
  valor: (p: Peleador) => string | null;
}[] = [
  {
    etiqueta: "Edad",
    valor: (p) =>
      p.nacimiento ? `${edadEn(p.nacimiento, EVENTO.inicioISO)}` : null,
  },
  {
    etiqueta: "Altura",
    valor: (p) => (p.altura ? `${coma(p.altura, 2)} m${marca(p)}` : null),
  },
  {
    etiqueta: "Peso",
    valor: (p) => (p.peso ? `${coma(p.peso, 1)} kg${marca(p)}` : null),
  },
];

/** Hay alturas y pesos que no salen de una balanza: se marcan con asterisco. */
export const HAY_APROX = PELEADORES.some((p) => p.aprox);

/**
 * Tabla comparativa de los dos peleadores de un combate.
 *
 * Se usa en tres sitios: la columna central del cara a cara, el bloque móvil
 * de esa misma sección y la página de cada peleador. No lleva "use client"
 * a propósito: es solo lectura de `lib/evento.ts` y así la página de peleador
 * la puede renderizar en el servidor.
 */
export function FichaTape({ combate }: { combate: Combate }) {
  return (
    <dl className="w-full overflow-hidden rounded-sm border border-linea">
      {FILAS_TAPE.map((fila, i) => (
        <div
          key={fila.etiqueta}
          className={`flex items-center gap-2 px-3 py-2 lg:py-1.5 ${
            i % 2 === 0 ? "bg-[#131318]" : "bg-[#0f0f14]"
          } ${i < FILAS_TAPE.length - 1 ? "border-b border-linea" : ""}`}
        >
          {/* El dato conocido va en crema; el guion se queda apagado */}
          <dd
            className={`flex-1 text-left font-display text-[15px] ${
              fila.valor(combate.a) ? "text-crema" : "text-tenue"
            }`}
          >
            {fila.valor(combate.a) ?? "—"}
          </dd>
          <dt className="w-[74px] text-center font-cond text-[9px] font-bold uppercase tracking-[0.16em] text-oro">
            {fila.etiqueta}
          </dt>
          <dd
            className={`flex-1 text-right font-display text-[15px] ${
              fila.valor(combate.b) ? "text-crema" : "text-tenue"
            }`}
          >
            {fila.valor(combate.b) ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Aviso de que hay medidas sin pesaje oficial. */
export function NotaAprox({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-center font-cond text-[9px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-oro-profundo ${className}`}
    >
      {HAY_APROX
        ? "* Dato no oficial · El pesaje de la velada manda"
        : "Altura y peso del último pesaje oficial"}
    </p>
  );
}
