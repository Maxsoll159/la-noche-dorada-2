import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconoFlechaDerecha } from "@/assets/icons";
import { BANDERAS, COMBATES, type Combate } from "@/lib/evento";
import { FILAS_TAPE } from "@/components/peleador/ficha-tape";
import { Bandera } from "@/components/ui/bandera";
import { Revelar } from "@/components/ui/revelar";
import { Seccion } from "@/components/ui/seccion";

const CARTELERA = [...COMBATES].sort((x, y) => x.n.localeCompare(y.n));

function FrenteRapido({ c }: { c: Combate }) {
  return (
    <dl className="relative my-6 mr-10 hidden w-[320px] shrink-0 self-center overflow-hidden rounded-sm border border-oro-profundo/60 bg-noche/70 backdrop-blur-sm lg:block">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-linea bg-[#08080b] px-4 py-2.5 font-cond text-[11px] font-bold tracking-[0.14em] uppercase">
        <span className="truncate text-crema">{c.a.nombre}</span>
        <span className="text-[10px] tracking-[0.2em] text-oro-medio">
          Frente a frente
        </span>
        <span className="truncate text-right text-crema">{c.b.nombre}</span>
      </div>
      {FILAS_TAPE.map((fila, i) => (
        <div
          key={fila.etiqueta}
          className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 ${
            i > 0 ? "border-t border-linea/70" : ""
          }`}
        >
          <dd className="font-display text-[20px] leading-none text-crema tabular-nums">
            {fila.valor(c.a) ?? "—"}
          </dd>
          <dt className="w-[60px] text-center font-cond text-[10px] font-bold tracking-[0.2em] text-oro uppercase">
            {fila.etiqueta}
          </dt>
          <dd className="text-right font-display text-[20px] leading-none text-crema tabular-nums">
            {fila.valor(c.b) ?? "—"}
          </dd>
        </div>
      ))}
      {(c.a.aprox || c.b.aprox) && (
        <p className="border-t border-linea/70 px-4 py-2 text-center font-cond text-[10px] font-semibold tracking-[0.16em] text-oro-medio uppercase">
          * Dato no oficial
        </p>
      )}
    </dl>
  );
}

function CardCombate({ c }: { c: Combate }) {
  const destacado = Boolean(c.billing);
  return (
    <article
      className={`group relative isolate flex h-full items-stretch overflow-hidden rounded-sm border transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] ${
        c.estelar
          ? "border-oro bg-oro-tinte"
          : c.billing
            ? "border-oro-profundo bg-carbon hover:border-oro"
            : "border-linea bg-carbon hover:border-oro-profundo"
      }`}
    >
      <div
        className={`relative aspect-[1080/1140] w-[44%] shrink-0 overflow-hidden bg-noche ${
          destacado ? "sm:w-[36%] lg:w-[30%]" : "lg:w-[46%]"
        }`}
      >
        <Image
          src={c.arte}
          alt={`Arte oficial del combate ${c.n}: ${c.a.nombre} contra ${c.b.nombre}`}
          fill
          sizes={
            destacado
              ? "(min-width: 1024px) 360px, (min-width: 640px) 36vw, 44vw"
              : "(min-width: 1024px) 280px, 44vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col justify-center gap-3 px-4 py-4 sm:px-6 sm:py-5 ${
          destacado ? "lg:gap-4 lg:px-12" : ""
        }`}
      >
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

        <h3
          className={`flex flex-col gap-1 leading-tight ${
            destacado
              ? "text-[20px] sm:text-[30px] lg:text-[42px]"
              : "text-[18px] sm:text-[24px] lg:text-[26px]"
          }`}
        >
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
                  className={`h-3 w-[19px] shrink-0 sm:h-3.5 sm:w-[21px] ${
                    destacado ? "lg:h-5 lg:w-[30px]" : ""
                  }`}
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

      <span
        aria-hidden
        className={`pointer-events-none absolute right-3 -bottom-7 -z-10 font-display text-[120px] leading-none text-oro/[0.07] transition-colors duration-500 select-none group-hover:text-oro/[0.12] sm:-bottom-9 sm:text-[160px] ${
          destacado ? "lg:right-[360px] lg:-bottom-12 lg:text-[240px]" : ""
        }`}
      >
        {c.n}
      </span>

      {destacado && (
        <>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-2/3 bg-[radial-gradient(60%_80%_at_75%_50%,rgba(212,175,55,0.12)_0%,rgba(212,175,55,0)_100%)] lg:block"
          />
          <FrenteRapido c={c} />
        </>
      )}
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
      bajada="Ocho combates, dieciséis creadores, tres asaltos de dos minutos. Del primer combate de la noche al estelar. Categoría y horario de cada combate por confirmar."
    >
      <ul className="grid w-full gap-4 lg:grid-cols-2 lg:gap-5">
        {CARTELERA.map((c, i) => (
          <li key={c.n} className={c.billing ? "lg:col-span-2" : undefined}>
            <Revelar retardo={c.billing ? 0 : (i % 2) * 90} className="h-full">
              <CardCombate c={c} />
            </Revelar>
          </li>
        ))}
      </ul>
    </Seccion>
  );
}
