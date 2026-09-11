import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMBATES, type Combate } from "@/lib/evento";
import { Revelar } from "./revelar";
import { Seccion } from "./seccion";

/** Escuadra dorada en cada esquina del arte, como en el diseño. */
function Escuadras() {
  const comun =
    "pointer-events-none absolute size-8 border-oro transition-all duration-300 group-hover:size-10";
  return (
    <>
      <span aria-hidden className={`${comun} left-2 top-2 border-l-2 border-t-2`} />
      <span aria-hidden className={`${comun} right-2 top-2 border-r-2 border-t-2`} />
      <span aria-hidden className={`${comun} bottom-2 left-2 border-b-2 border-l-2`} />
      <span aria-hidden className={`${comun} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  );
}

function CardCombate({ c }: { c: Combate }) {
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
          // 32 px y no el ancho real: con `blur-2xl` encima da exactamente
          // igual, y así el arte no se descarga dos veces por card.
          sizes="32px"
          className="scale-110 object-cover opacity-55 blur-2xl transition-opacity duration-500 group-hover:opacity-75"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,rgba(36,28,16,0.6)_0%,rgba(11,11,13,0.9)_100%)]"
        />
        {/* Pieza oficial completa, centrada y en su proporción real */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2">
          <Image
            src={c.arte}
            alt={`Arte oficial del combate ${c.n}`}
            width={1080}
            height={1140}
            sizes="(min-width: 1024px) 350px, 60vw"
            className="h-full w-auto border-x border-oro-profundo shadow-[0_0_34px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <Escuadras />
      </div>

      <div className="flex flex-col items-center gap-2 border-t border-linea bg-[#08080b] px-5 py-4 text-center">
        <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-profundo">
          {c.billing ?? `Combate ${c.n}`}
        </p>
        {/* Los nombres eran lo único que faltaba en la cartelera: hasta ahora
            vivían solo en el `alt` del arte. Como encabezado le dan título a
            cada card —antes eran ocho artículos anónimos para un lector de
            pantalla— y como enlaces son la puerta a las 16 fichas, que desde
            la home solo se alcanzaban por el cara a cara. */}
        <h3 className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[17px] leading-tight sm:text-[19px]">
          {[c.a, c.b].map((peleador, i) => (
            <Fragment key={peleador.slug}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="font-cond text-[12px] font-bold tracking-[0.18em] text-oro-profundo"
                >
                  VS
                </span>
              )}
              <Link
                href={`/peleadores/${peleador.slug}`}
                className="text-crema underline decoration-oro-profundo/40 underline-offset-[5px] transition-colors group-hover:decoration-oro-profundo hover:text-oro"
              >
                {peleador.nombre}
              </Link>
            </Fragment>
          ))}
        </h3>
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
      <div className="flex w-full flex-col gap-7">
        <div className="grid w-full gap-6 md:grid-cols-2">
          {COMBATES.map((c, i) => (
            // El retardo por pares hace que cada fila entre junta, no en
            // cascada de ocho pasos, que se sentía lento al bajar.
            <Revelar key={c.n} retardo={(i % 2) * 90}>
              <CardCombate c={c} />
            </Revelar>
          ))}
        </div>
        {/* Iba repetido en las ocho cards: dieciséis líneas para decir dos
            cosas que valen para toda la cartelera. Lo de los asaltos ya está
            en la bajada, así que aquí queda solo lo que falta por cerrar. */}
        <p className="text-center font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-oro-profundo">
          Categoría y horario de cada combate por confirmar
        </p>
      </div>
    </Seccion>
  );
}
