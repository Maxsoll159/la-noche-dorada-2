import { EVENTO, PELEADORES, edadEn, type Peleador } from "@/lib/evento";

/** Coma decimal: la ficha se lee en español. */
const coma = (n: number, decimales: number) =>
  n.toFixed(decimales).replace(".", ",");

const marca = (p: Peleador) => (p.aprox ? "*" : "");

/**
 * Las tres filas de la ficha comparativa del cara a cara. Cada una devuelve
 * null cuando el dato no está publicado y el marcador pinta el guion: con
 * varios peleadores sin algún dato físico, el hueco es el caso normal, no la
 * excepción.
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
