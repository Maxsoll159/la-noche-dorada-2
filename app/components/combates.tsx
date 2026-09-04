import Image from "next/image";
import { COMBATES, type Combate } from "@/lib/evento";
import { Revelar } from "./revelar";
import { Seccion } from "./seccion";

/** Escuadra dorada en cada esquina del arte, como en el diseño. */
function Escuadras() {
  const comun = "pointer-events-none absolute size-8 border-oro";
  return (
    <>
      <span aria-hidden className={`${comun} left-2 top-2 border-l-2 border-t-2`} />
      <span aria-hidden className={`${comun} right-2 top-2 border-r-2 border-t-2`} />
      <span aria-hidden className={`${comun} bottom-2 left-2 border-b-2 border-l-2`} />
      <span aria-hidden className={`${comun} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  );
}

function CardCombate({ c, prioridad }: { c: Combate; prioridad: boolean }) {
  return (
    <article
      className={`group overflow-hidden rounded-sm border transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] ${
        c.estelar
          ? "border-oro bg-oro-tinte"
          : "border-linea bg-carbon hover:border-oro-profundo"
      }`}
    >
      <div className="relative aspect-[588/360] overflow-hidden">
        {/* El arte se derrama desenfocado hacia los costados para que la card
            se sienta llena sin recortar la pieza original. */}
        <Image
          src={c.arte}
          alt=""
          aria-hidden
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="scale-110 object-cover opacity-55 blur-2xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,rgba(36,28,16,0.6)_0%,rgba(11,11,13,0.9)_100%)]"
        />
        {/* Pieza oficial completa, centrada y en su proporción real */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2">
          <Image
            src={c.arte}
            alt={`${c.a.nombre} vs ${c.b.nombre}`}
            width={1080}
            height={1140}
            priority={prioridad}
            sizes="(min-width: 1024px) 350px, 60vw"
            className="h-full w-auto border-x border-oro-profundo shadow-[0_0_34px_rgba(0,0,0,0.6)]"
          />
        </div>
        <Escuadras />
      </div>

      <div className="flex flex-col items-center gap-1.5 border-t border-linea bg-[#08080b] px-5 py-4 text-center">
        <p className="font-display text-[16px] uppercase tracking-wide text-oro-claro">
          {c.billing ?? `Combate ${c.n}`}
          <span className="text-oro-profundo"> · 3 rounds de 2 minutos</span>
        </p>
        <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.18em] text-tenue">
          Categoría y horario por confirmar
        </p>
      </div>
    </article>
  );
}

export function Combates() {
  return (
    <Seccion
      id="combates"
      fondo="superficie"
      revelarCuerpo={false}
      antetitulo="Cartelera oficial"
      titulo="Combates"
      bajada="Ocho combates, dieciséis creadores, tres asaltos de dos minutos. El orden oficial de la noche."
    >
      <div className="grid w-full gap-6 md:grid-cols-2">
        {COMBATES.map((c, i) => (
          // El retardo por pares hace que cada fila entre junta, no en cascada
          // de ocho pasos, que se sentía lento al bajar.
          <Revelar key={c.n} retardo={(i % 2) * 90}>
            <CardCombate c={c} prioridad={i < 2} />
          </Revelar>
        ))}
      </div>
    </Seccion>
  );
}
