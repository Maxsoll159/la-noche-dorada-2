import type { Combate, Peleador } from "@/lib/evento";

export function RotuloCruce({
  oficial,
  izq,
  der,
  className,
}: {
  oficial: Combate | null;
  izq: Peleador;
  der: Peleador;
  className: string;
}) {
  return (
    <p aria-live="polite" className={className}>
      {oficial ? (oficial.billing ?? `Combate ${oficial.n}`) : "Combate soñado"}
      <span className="sr-only">
        : {izq.nombre} contra {der.nombre}
      </span>
      <span className="text-oro-medio"> · </span>
      {oficial ? "3 rounds" : "Fuera de la cartelera"}
    </p>
  );
}
