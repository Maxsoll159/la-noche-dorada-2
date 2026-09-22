import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconoFlechaDerecha } from "@/assets/icons";
import { BANDERAS, COMBATES, type Combate } from "@/lib/evento";
import { Bandera } from "@/components/ui/bandera";
import { Revelar } from "@/components/ui/revelar";
import { Seccion } from "@/components/ui/seccion";

function CardCombate({ c }: { c: Combate }) {
  return (
    <article
      className={`group flex h-full items-stretch overflow-hidden rounded-sm border transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] ${
        c.estelar
          ? "border-oro bg-oro-tinte"
          : c.billing
            ? "border-oro-profundo bg-carbon hover:border-oro"
            : "border-linea bg-carbon hover:border-oro-profundo"
      }`}
    >
      <div className="relative aspect-[1080/1140] w-[44%] shrink-0 overflow-hidden bg-noche lg:w-[46%]">
        <Image
          src={c.arte}
          alt={`Arte oficial del combate ${c.n}: ${c.a.nombre} contra ${c.b.nombre}`}
          fill
          sizes="(min-width: 1024px) 280px, 44vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-4 py-4 sm:px-6 sm:py-5">
        <p className="flex flex-wrap items-center gap-2 font-cond text-[11px] font-bold tracking-[0.18em] uppercase">
          {c.billing && (
            <span
              className={`rounded-sm px-2 py-1 leading-none ${
                c.estelar ? "bg-oro text-noche" : "border border-oro text-oro"
              }`}
            >
              {c.billing}
            </span>
          )}
          <span className={c.billing ? "text-oro-medio" : "text-oro"}>
            Combate {c.n}
          </span>
        </p>

        <h3 className="flex flex-col gap-1 text-[18px] leading-tight sm:text-[24px] lg:text-[26px]">
          {[c.a, c.b].map((p, i) => (
            <Fragment key={p.slug}>
              {i > 0 && (
                <span
                  aria-hidden
                  className="font-cond text-[11px] leading-none font-bold tracking-[0.2em] text-oro-medio"
                >
                  VS
                </span>
              )}
              <Link
                href={`/peleadores/${p.slug}`}
                className="flex min-w-0 items-center gap-2.5 text-crema transition-colors hover:text-oro"
              >
                <Bandera
                  pais={p.pais}
                  className="h-3 w-[19px] shrink-0 sm:h-3.5 sm:w-[21px]"
                />
                <span className="min-w-0 break-words">{p.nombre}</span>
              </Link>
            </Fragment>
          ))}
        </h3>

        <p className="hidden font-cond text-[12px] font-semibold tracking-[0.12em] text-tenue uppercase sm:block">
          {BANDERAS[c.a.pais].nombre} vs {BANDERAS[c.b.pais].nombre} · 3 rounds
          × 2 min
        </p>

        <a
          href="#pronosticos"
          className="hidden w-fit items-center gap-2 rounded-sm border border-oro-profundo px-3.5 py-2 font-cond text-[11px] font-bold tracking-[0.16em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte sm:flex"
        >
          Votar pronóstico
          <IconoFlechaDerecha
            size={12}
            strokeWidth={2.6}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </a>
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
      bajada="Ocho combates, dieciséis creadores, tres asaltos de dos minutos. Del estelar al primer combate de la noche. Categoría y horario de cada combate por confirmar."
    >
      <ul className="grid w-full gap-4 lg:grid-cols-2 lg:gap-5">
        {COMBATES.map((c, i) => (
          <li key={c.n}>
            <Revelar retardo={(i % 2) * 90} className="h-full">
              <CardCombate c={c} />
            </Revelar>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
