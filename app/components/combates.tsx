import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { COMBATES, type Combate } from "@/lib/evento";
import { Revelar } from "./revelar";
import { Seccion } from "./seccion";

/**
 * Card vertical, en la proporción del arte oficial (1080×1140). Antes era
 * horizontal y la pieza quedaba centrada entre dos franjas desenfocadas que
 * ocupaban la mitad de la card y pedían descargar el arte dos veces.
 */
function CardCombate({ c }: { c: Combate }) {
  return (
    <article
      // h-full: las cards con rótulo (estelar, semifondo) tienen el pie más
      // alto; sin esto las de su misma fila quedaban más cortas.
      className={`group flex h-full flex-col overflow-hidden rounded-sm border transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] ${
        c.estelar
          ? "border-oro bg-oro-tinte"
          : "border-linea bg-carbon hover:border-oro-profundo"
      }`}
    >
      <div className="relative aspect-[1080/1140] overflow-hidden bg-noche">
        <Image
          src={c.arte}
          alt={`Arte oficial del combate ${c.n}: ${c.a.nombre} contra ${c.b.nombre}`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Sin escuadras en las esquinas: caían justo sobre las banderas que
            trae el arte y lo ensuciaban. La pieza ya tiene su propio marco. */}
      </div>

      {/* Todo el texto va debajo del arte, nunca encima: la pieza trae los
          nombres impresos al pie y cualquier rótulo ahí los tapaba. Orden de
          la noche grande a la izquierda; rótulo y nombres a la derecha. */}
      <div className="flex flex-1 items-center gap-2.5 border-t border-linea bg-[#08080b] px-3 py-3 sm:gap-3.5 sm:px-4 sm:py-3.5">
        <span className="flex shrink-0 flex-col items-center leading-none">
          <span className="texto-oro font-display text-[30px] leading-none sm:text-[38px]">
            {c.n}
          </span>
          <span className="mt-0.5 font-cond text-[7px] font-bold uppercase tracking-[0.2em] text-oro-profundo sm:text-[8px]">
            Combate
          </span>
        </span>
        <span aria-hidden className="h-9 w-px shrink-0 bg-linea sm:h-10" />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {c.billing && (
            <span className="font-cond text-[9px] font-bold uppercase leading-none tracking-[0.18em] text-oro sm:text-[10px]">
              {c.billing}
            </span>
          )}
          {/* Los nombres le dan título a cada card —antes eran ocho
              artículos anónimos para un lector de pantalla— y como enlaces
              son la puerta a las 16 fichas. Apilados: en fila no entran en
              una card de 150 px ni de 280. */}
          <h3 className="flex flex-col items-start gap-0.5 text-[13px] leading-tight sm:text-[15px]">
            {[c.a, c.b].map((peleador, i) => (
              <Fragment key={peleador.slug}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="font-cond text-[9px] font-bold leading-none tracking-[0.18em] text-oro-profundo"
                  >
                    VS
                  </span>
                )}
                <Link
                  href={`/peleadores/${peleador.slug}`}
                  className="text-crema transition-colors hover:text-oro"
                >
                  {peleador.nombre}
                </Link>
              </Fragment>
            ))}
          </h3>
        </div>
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
      bajada="Ocho combates, dieciséis creadores, tres asaltos de dos minutos. El orden oficial de la noche. Categoría y horario de cada combate por confirmar."
    >
      {/* Dos columnas en móvil y cuatro en escritorio: con el arte vertical
          entran ocho piezas en dos filas y la sección mide la mitad. */}
      <ul className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
        {/* Del 01 al 08, en el orden en que se pelean. COMBATES viene al
            revés (el estelar primero) porque así lo usan las otras secciones. */}
        {[...COMBATES].reverse().map((c, i) => (
          <li key={c.n}>
            {/* El retardo va por posición en la fila de cuatro: cada fila
                entra en cascada corta, no en ocho pasos. */}
            <Revelar retardo={(i % 4) * 70} className="h-full">
              <CardCombate c={c} />
            </Revelar>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
