import type { Metadata } from "next";
import Link from "next/link";
import { EVENTO, PELEADORES } from "@/lib/evento";
import { Bandera } from "@/app/components/bandera";
import { FileteOro } from "@/app/components/filete-oro";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 del sitio. La ve quien escribe mal una dirección o entra a una ficha de
 * peleador que no existe (las 16 rutas son fijas y cualquier otro slug cae
 * aquí). Por eso, además de volver al inicio, ofrece la lista de los 16: el
 * error más probable es un nombre mal escrito.
 */
export default function NoEncontrada() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-noche pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_30%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
          />
          <div className="mx-auto flex max-w-contenido flex-col items-center gap-8 px-6 text-center lg:px-14">
            <div style={{ animationDelay: "80ms" }} className="entrada flex flex-col items-center gap-3">
              <p className="flex items-center gap-3 font-cond text-[12px] font-bold uppercase tracking-[0.28em] text-oro">
                <span aria-hidden className="h-px w-8 bg-oro-profundo" />
                Error 404
                <span aria-hidden className="h-px w-8 bg-oro-profundo" />
              </p>
              {/* leading holgado: texto-oro recorta el degradado a la caja
                  de línea y con leading-none se comía el borde de los números */}
              <p
                aria-hidden
                className="texto-oro -skew-x-6 font-display text-[120px] leading-[1.05] drop-shadow-[0_0_30px_rgba(212,175,55,0.35)] sm:text-[160px] lg:text-[200px]"
              >
                404
              </p>
              <h1 className="text-[34px] leading-none tracking-wide text-crema sm:text-[44px]">
                Golpe al aire
              </h1>
              <p className="max-w-[34rem] text-[17px] leading-relaxed text-tenue">
                Esta página no está en la cartelera. La dirección no existe o
                cambió de sitio.
              </p>
            </div>

            <div
              style={{ animationDelay: "220ms" }}
              className="entrada flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center"
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-2.5 rounded-sm bg-oro px-8 py-4 font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-noche shadow-[0_8px_26px_rgba(212,175,55,0.25)] transition-colors hover:bg-oro-claro"
              >
                Ir al inicio
              </Link>
              <Link
                href="/#combates"
                className="flex items-center justify-center gap-2 rounded-sm border border-oro-profundo px-8 py-4 font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte"
              >
                Ver la cartelera
                <svg
                  aria-hidden
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>

            {/* Los 16, por si lo que fallaba era el nombre de una ficha */}
            <div
              style={{ animationDelay: "360ms" }}
              className="entrada flex w-full max-w-[56rem] flex-col items-center gap-4 pt-4"
            >
              <p className="flex w-full items-center gap-3 font-cond text-[11px] font-bold uppercase tracking-[0.24em] text-oro-medio">
                <span aria-hidden className="h-px flex-1 bg-linea" />
                ¿Buscabas a un peleador?
                <span aria-hidden className="h-px flex-1 bg-linea" />
              </p>
              <ul className="flex flex-wrap justify-center gap-2">
                {PELEADORES.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/peleadores/${p.slug}`}
                      className="flex items-center gap-2 rounded-sm border border-linea bg-carbon px-3 py-2 font-cond text-[12px] font-bold uppercase tracking-[0.1em] text-crema transition-colors hover:border-oro hover:bg-oro-tinte hover:text-oro"
                    >
                      <Bandera pais={p.pais} className="h-2.5 w-[15px]" />
                      {p.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.16em] text-tenue">
                {EVENTO.nombre} · {EVENTO.fechaLarga} · {EVENTO.sede}
              </p>
            </div>
          </div>
        </section>
        <FileteOro />
      </main>
      <SiteFooter />
    </>
  );
}
