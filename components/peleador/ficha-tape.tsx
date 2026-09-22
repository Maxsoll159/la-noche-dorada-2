import { EVENTO, PELEADORES, edadEn, type Peleador } from "@/lib/evento";

const coma = (n: number, decimales: number) =>
  n.toFixed(decimales).replace(".", ",");

const marca = (p: Peleador) => (p.aprox ? "*" : "");

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

export const HAY_APROX = PELEADORES.some((p) => p.aprox);

export function NotaAprox({ className = "" }: { className?: string }) {
  return (
    <p
      className={`text-center font-cond text-[11px] leading-relaxed font-semibold tracking-[0.18em] text-oro-medio uppercase ${className}`}
    >
      {HAY_APROX
        ? "* Dato no oficial · El pesaje de la velada manda"
        : "Altura y peso del último pesaje oficial"}
    </p>
  );
}
