import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BANDERAS,
  COMBATES,
  EVENTO,
  PELEADORES,
  edadEn,
  fichaDe,
  REDES_ACTUALIZADAS,
} from "@/lib/evento";
import { ApoyoPeleador } from "@/app/components/apoyo-peleador";
import { Bandera } from "@/app/components/bandera";
import { FileteOro } from "@/app/components/filete-oro";
import { Patrocinador } from "@/app/components/patrocinador";
import { Revelar } from "@/app/components/revelar";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

/** Las 16 rutas se prerrenderizan en el build: el cartel no cambia solo. */
export function generateStaticParams() {
  return PELEADORES.map((p) => ({ slug: p.slug }));
}

/** Un slug que no está en el cartel es 404, no una página vacía. */
export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/peleadores/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ficha = fichaDe(slug);
  if (!ficha) return {};

  const { peleador, rival, combate } = ficha;
  const titulo = `${peleador.nombre} vs ${rival.nombre}`;
  const descripcion = `${peleador.nombre} (${BANDERAS[peleador.pais].nombre}) pelea contra ${rival.nombre} en el combate ${combate.n} de ${EVENTO.nombre}. ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/peleadores/${peleador.slug}` },
    openGraph: {
      type: "profile",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      url: `/peleadores/${peleador.slug}`,
      images: [
        { url: peleador.foto, width: 250, height: 470, alt: peleador.nombre },
      ],
    },
  };
}

const coma = (n: number, d: number) => n.toFixed(d).replace(".", ",");

export default async function Page(props: PageProps<"/peleadores/[slug]">) {
  const { slug } = await props.params;
  const ficha = fichaDe(slug);
  if (!ficha) notFound();

  const { peleador, rival, combate, lado } = ficha;
  const pais = BANDERAS[peleador.pais];
  const asterisco = peleador.aprox ? "*" : "";

  // Solo se listan los campos que existen para los 16, así ninguna ficha queda
  // coja. El género NO está: no hay dato en `lib/evento.ts` y ponerlo a mano
  // sería falso en los combates 06 y 02.
  const DATOS = [
    { etiqueta: "País", valor: pais.nombre },
    { etiqueta: "Combate", valor: `${combate.n}${combate.billing ? ` · ${combate.billing}` : ""}` },
    { etiqueta: "Formato", valor: "3 rounds × 2 min" },
    { etiqueta: "Fecha", valor: EVENTO.fechaLarga },
    // Sede y transmisión salieron de aquí: siguen en la sección "Su combate",
    // que es donde tienen contexto. Quedan 4 celdas = 2 filas exactas.
  ];

  // Ficha física: 14 de 16 tienen edad y 10 tienen peso, así que ya vale la
  // pena. Los que no tengan nada se saltan el bloque entero.
  const FISICO = [
    peleador.nacimiento && {
      etiqueta: "Edad",
      valor: `${edadEn(peleador.nacimiento, EVENTO.inicioISO)} años`,
    },
    peleador.altura && {
      etiqueta: "Altura",
      valor: `${coma(peleador.altura, 2)} m${asterisco}`,
    },
    peleador.peso && {
      etiqueta: "Peso",
      valor: `${coma(peleador.peso, 1)} kg${asterisco}`,
    },
  ].filter(Boolean) as { etiqueta: string; valor: string }[];

  // "Sábado 28 de noviembre" -> "28 de noviembre": el día de la semana ya lo
  // dice la rejilla de arriba y el antetítulo queda más limpio sin él.
  const diaYMes = EVENTO.fechaLarga.split(" ").slice(1).join(" ");

  const DETALLE = [
    { icono: "reloj", etiqueta: "Formato", valor: "3 rounds de 2 minutos" },
    {
      icono: "bandera",
      etiqueta: "Esquinas",
      valor: `${pais.nombre} vs ${BANDERAS[rival.pais].nombre}`,
    },
    {
      icono: "pin",
      etiqueta: "Sede",
      valor: `${EVENTO.sede}, ${EVENTO.distrito}`,
    },
    {
      icono: "senal",
      etiqueta: "Transmisión",
      valor: `En vivo por Kick ${EVENTO.streamCanal}`,
    },
  ];

  const otros = COMBATES.filter((c) => c.n !== combate.n);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-noche pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_30%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
          />
          <div className="mx-auto flex max-w-contenido flex-col gap-8 px-6 lg:px-14">
            <Link
              href="/#combates"
              style={{ animationDelay: "60ms" }}
              className="entrada flex items-center gap-2 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-oro-profundo transition-colors hover:text-oro"
            >
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
                <path d="m14 6-6 6 6 6" />
              </svg>
              Volver a la cartelera
            </Link>

            <div className="flex flex-col items-center gap-9 lg:flex-row lg:items-stretch lg:gap-12">
              {/* Retrato enmarcado, con el rótulo del combate como sello */}
              <div
                style={{ animationDelay: "140ms" }}
                className="entrada group relative w-full max-w-[380px] shrink-0 self-center overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12] transition-colors duration-300 hover:border-oro lg:w-[430px] lg:max-w-none"
              >
                <div className="relative h-[420px] w-full sm:h-[490px] lg:h-[560px]">
                  <Image
                    src={peleador.cuerpo ?? peleador.foto}
                    alt={peleador.nombre}
                    fill
                    priority
                    sizes="(min-width: 1024px) 430px, 380px"
                    className={`transition-transform duration-500 group-hover:scale-[1.04] ${
                      peleador.cuerpo
                        ? "object-contain object-bottom brightness-125 contrast-[1.06] saturate-105"
                        : "object-cover object-top brightness-110"
                    }`}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.35)_0%,transparent_26%,transparent_62%,rgba(11,11,13,0.5)_84%,rgba(11,11,13,0.95)_100%)]"
                  />
                  <Escuadras />
                  <span className="absolute left-4 top-4 rounded-sm border border-oro bg-noche/85 px-3 py-1.5 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro">
                    {combate.billing ?? `Combate ${combate.n}`}
                  </span>
                </div>

                {/* Haz dorado barriendo el borde de la tarjeta. Va al final
                    para pintar por encima; cada uno en su contenedor porque la
                    máscara recorta al contorno y el degradado gira dentro. */}
                <span aria-hidden className="marco-vivo">
                  <span className="marco-vivo-haz" />
                </span>
                <span aria-hidden className="marco-vivo">
                  <span className="marco-vivo-haz marco-vivo-opuesto" />
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center gap-6">
                <div
                  style={{ animationDelay: "240ms" }}
                  className="entrada flex flex-col items-center gap-3 text-center lg:items-start lg:text-left"
                >
                  <p className="flex items-center gap-2.5 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-oro">
                    <Bandera pais={peleador.pais} className="h-3.5 w-[21px]" />
                    {pais.nombre}
                  </p>
                  {/* Tamaños escalonados y `break-words`: con `auto` a 92px,
                      "JH de la Cruz 777" se salía de la columna. */}
                  {/* leading holgado a propósito: `texto-oro` usa
                      background-clip:text, así que si la caja de línea queda
                      más corta que el glifo se recorta el fondo y la tilde de
                      la Ñ desaparece ("CAÑITA" salía como "CANITA"). */}
                  <h1 className="texto-oro w-full break-words text-[42px] leading-[1.12] sm:text-[58px] lg:text-[72px]">
                    {peleador.nombre}
                  </h1>
                </div>

                {/* Rejilla de celdas con divisiones, como en el diseño: los
                    bordes internos se pintan por posición, no con `divide`,
                    que en grid deja líneas sueltas en la última fila. */}
                <dl
                  style={{ animationDelay: "340ms" }}
                  className="entrada grid grid-cols-2 overflow-hidden rounded-sm border border-linea"
                >
                  {DATOS.map((d, i) => (
                    <div
                      key={d.etiqueta}
                      className={`flex flex-col gap-1 bg-carbon px-4 py-3.5 ring-1 ring-inset ring-transparent transition duration-200 hover:bg-[#16161c] hover:ring-oro-profundo sm:px-5 ${
                        i % 2 === 0 ? "border-r border-linea" : ""
                      } ${i < DATOS.length - 2 ? "border-b border-linea" : ""}`}
                    >
                      <dt className="font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                        {d.etiqueta}
                      </dt>
                      <dd className="font-display text-[16px] uppercase leading-tight text-crema sm:text-[18px]">
                        {d.valor}
                      </dd>
                    </div>
                  ))}
                </dl>

                {FISICO.length > 0 && (
                  <div
                    style={{ animationDelay: "420ms" }}
                    className="entrada flex flex-col gap-2.5 rounded-sm border border-linea bg-carbon px-5 py-4 transition-colors duration-300 hover:border-oro-profundo"
                  >
                    <p className="font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                      Ficha
                    </p>
                    <dl className="flex flex-wrap gap-x-9 gap-y-3">
                      {FISICO.map((d) => (
                        <div key={d.etiqueta} className="flex flex-col">
                          <dt className="font-cond text-[11px] font-semibold uppercase tracking-[0.16em] text-tenue">
                            {d.etiqueta}
                          </dt>
                          <dd className="font-display text-[21px] leading-tight text-crema">
                            {d.valor}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {peleador.aprox && (
                      <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-oro-profundo">
                        * Dato no oficial · El pesaje de la velada manda
                      </p>
                    )}
                  </div>
                )}

                {/* Fila de rival: dos celdas, como en el diseño. El rombo
                    del VS va como chip a la izquierda, no centrado. */}
                <div
                  style={{ animationDelay: "500ms" }}
                  className="entrada resplandor grid overflow-hidden rounded-sm border border-oro-profundo sm:grid-cols-[minmax(0,1fr)_auto]"
                >
                  <Link
                    href={`/peleadores/${rival.slug}`}
                    className="group relative flex min-w-0 items-center gap-3 overflow-hidden bg-carbon px-4 py-3 ring-1 ring-inset ring-transparent transition duration-200 hover:bg-oro-tinte hover:ring-oro sm:px-5"
                  >
                    {/* Barrido dorado periódico: sin esto la fila se perdía
                        entre las demás cajas y nadie la tocaba. */}
                    <span
                      aria-hidden
                      className="destello pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-oro/15 to-transparent"
                    />
                    <span className="relative grid size-8 shrink-0 place-items-center">
                      <span
                        aria-hidden
                        className="absolute inset-0 rotate-45 rounded-[2px] border border-oro-profundo bg-noche/80"
                      />
                      <span className="relative font-display text-[10px] text-oro">
                        VS
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                        Su rival
                      </span>
                      <span className="mt-1 flex items-center gap-2.5">
                        <span className="relative block aspect-[250/470] w-7 shrink-0 overflow-hidden rounded-[2px] border border-linea">
                          <Image
                            src={rival.foto}
                            alt=""
                            fill
                            sizes="28px"
                            className="object-cover"
                          />
                        </span>
                        <span className="truncate font-display text-[17px] uppercase text-crema transition-colors group-hover:text-oro">
                          {rival.nombre}
                        </span>
                      </span>
                    </span>
                  </Link>

                  <Link
                    href="/#cara-a-cara"
                    className="group flex flex-col justify-center gap-1 border-t border-linea bg-carbon px-4 py-3 ring-1 ring-inset ring-transparent transition duration-200 hover:bg-oro-tinte hover:ring-oro sm:border-l sm:border-t-0 sm:px-5"
                  >
                    <span className="font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                      Combate {combate.n}
                    </span>
                    <span className="flex items-center gap-2 whitespace-nowrap font-cond text-[13px] font-bold uppercase tracking-[0.14em] text-oro">
                      Ver el combate
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
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </Link>
                </div>

              </div>
            </div>

            {/* Redes a ancho completo bajo la foto y la info, centradas. En la
                columna de info quedaban colgadas a la derecha y, con cinco
                plataformas, el grid dejaba una tarjeta huérfana en otra fila.
                `flex-wrap` + ancho fijo centra cualquier cantidad. */}
            {peleador.redes && peleador.redes.length > 0 && (
              <div
                style={{ animationDelay: "580ms" }}
                className="entrada flex flex-col items-center gap-3"
              >
                <ul className="flex flex-wrap justify-center gap-2.5">
                  {peleador.redes.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex w-[168px] items-center gap-2.5 rounded-sm border border-linea bg-carbon px-3 py-2.5 transition duration-300 hover:-translate-y-0.5 hover:border-oro hover:bg-oro-tinte sm:w-[186px]"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-oro-profundo text-oro transition-colors duration-300 group-hover:border-oro">
                          <IconoRed plataforma={r.plataforma} grande />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-cond text-[9px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                            {r.plataforma}
                          </span>
                          <span className="block truncate font-cond text-[12px] font-semibold text-crema">
                            {r.usuario}
                          </span>
                        </span>
                        {r.seguidores && (
                          <span className="shrink-0 font-display text-[15px] leading-none text-oro">
                            {r.seguidores}
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
                {peleador.redes.some((r) => r.seguidores) && (
                  <p className="font-cond text-[10px] font-semibold uppercase tracking-[0.14em] text-oro-profundo">
                    Seguidores a {REDES_ACTUALIZADAS} · Varían a diario
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        <FileteOro />

        <section className="bg-superficie">
          <div className="mx-auto flex max-w-contenido flex-col gap-12 px-6 py-16 lg:px-14 lg:py-20">
            <Revelar className="flex flex-col gap-8">
              <EncabezadoSeccion antetitulo="La comunidad" titulo="Pronóstico" />
              <ApoyoPeleador
                combate={combate}
                peleador={peleador}
                rival={rival}
                lado={lado}
              />
            </Revelar>

            {peleador.resena && (
              <Revelar className="flex flex-col items-center gap-4 text-center">
                <EncabezadoSeccion antetitulo="El personaje" titulo="Quién es" />
                <p className="max-w-[52rem] text-[17px] leading-relaxed text-tenue">
                  {peleador.resena}
                </p>
              </Revelar>
            )}

            <Revelar retardo={80} className="flex flex-col gap-8">
              <EncabezadoSeccion antetitulo={diaYMes} titulo="Su combate" />

              <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] items-center">
                <Link
                  href="/#combates"
                  className="mx-auto block w-full max-w-[360px] overflow-hidden rounded-sm border border-linea transition duration-300 hover:-translate-y-1 hover:border-oro hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
                >
                  <Image
                    src={combate.arte}
                    alt={`${combate.a.nombre} vs ${combate.b.nombre}`}
                    width={1080}
                    height={1140}
                    sizes="360px"
                    className="h-auto w-full"
                  />
                </Link>

                <div className="overflow-hidden rounded-sm border border-linea">
                  {/* Barra dorada con el rótulo del combate */}
                  <p className="flex items-center gap-2.5 bg-oro px-5 py-2.5 font-cond text-[12px] font-bold uppercase tracking-[0.16em] text-noche">
                    <span aria-hidden className="size-2 rotate-45 bg-noche/70" />
                    Combate {combate.n}
                    {combate.billing && ` · ${combate.billing}`}
                  </p>

                  <div className="flex flex-col gap-6 bg-carbon px-5 py-6 sm:px-7">
                    <div>
                      {/* El peleador de esta ficha va primero, no el lado A */}
                      <p className="font-display text-[24px] uppercase leading-tight text-oro-claro sm:text-[30px]">
                        {peleador.nombre}{" "}
                        <span className="text-oro">vs</span> {rival.nombre}
                      </p>
                      <span aria-hidden className="mt-3 block h-[3px] w-14 bg-oro" />
                    </div>

                    <dl className="flex flex-col gap-4">
                      {DETALLE.map((d) => (
                        <div key={d.etiqueta} className="flex items-start gap-3">
                          <span className="mt-0.5 text-oro">
                            <IconoDetalle nombre={d.icono} />
                          </span>
                          <div className="min-w-0">
                            <dt className="font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-profundo">
                              {d.etiqueta}
                            </dt>
                            <dd className="font-cond text-[15px] font-semibold uppercase tracking-[0.06em] text-crema">
                              {d.valor}
                            </dd>
                          </div>
                        </div>
                      ))}
                    </dl>

                    <a
                      href={EVENTO.entradasUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-sm bg-oro px-6 py-3.5 font-cond text-[13px] font-bold uppercase tracking-[0.14em] text-noche transition-colors hover:bg-oro-claro"
                    >
                      Comprar en Ticketmaster.pe
                      <svg
                        aria-hidden
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      >
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Revelar>

            {/* Enlazado interno entre las 16 fichas: navegación y, de paso,
                lo que evita que cada página quede huérfana para el buscador. */}
            <Revelar retardo={80} className="flex flex-col gap-8">
              <EncabezadoSeccion
                antetitulo="La cartelera completa"
                titulo={`Los otros ${otros.length} combates`}
              />
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {otros.map((c) => (
                  <li key={c.n}>
                    <Link
                      href={`/peleadores/${c.a.slug}`}
                      className="group flex h-full flex-col gap-2 rounded-sm border border-linea bg-carbon p-3 transition duration-300 hover:-translate-y-1 hover:border-oro hover:bg-oro-tinte hover:shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
                    >
                      <span className="font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro-profundo">
                        Combate {c.n}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {/* Proporción NATIVA del asset (250x470). Los retratos
                            ya vienen cortadísimos de origen, así que cualquier
                            otra proporción recorta sobre la frente. */}
                        {[c.a, c.b].map((p) => (
                          <span
                            key={p.slug}
                            className="relative block aspect-[250/470] flex-1 overflow-hidden rounded-sm border border-linea"
                          >
                            <Image
                              src={p.foto}
                              alt=""
                              fill
                              sizes="110px"
                              className="object-cover object-top transition-opacity group-hover:opacity-90"
                            />
                          </span>
                        ))}
                      </span>
                      <span className="font-display text-[13px] uppercase leading-tight text-crema">
                        {c.a.nombre}
                        <span className="text-oro-profundo"> vs </span>
                        {c.b.nombre}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Revelar>
          </div>
        </section>

        {/* Mismo módulo que la home: las marcas ganan presencia en las 16
            fichas sin duplicar código ni datos. */}
        <Patrocinador />
      </main>
      <SiteFooter />
    </>
  );
}

/** Glifos de las filas de "Su combate". */
function IconoDetalle({ nombre }: { nombre: string }) {
  const comun = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (nombre === "reloj")
    return (
      <svg {...comun}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  if (nombre === "bandera")
    return (
      <svg {...comun}>
        <path d="M4 21V4M4 5h12l-2 4 2 4H4" />
      </svg>
    );
  if (nombre === "pin")
    return (
      <svg {...comun}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  return (
    <svg {...comun}>
      <path d="M5 12a7 7 0 0 1 7-7M5 17a12 12 0 0 1 12-12" />
      <circle cx="6" cy="18" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Escuadras doradas en las esquinas del retrato, como en las cards de combate. */
function Escuadras() {
  const comun = "pointer-events-none absolute size-7 border-oro";
  return (
    <>
      <span aria-hidden className={`${comun} left-2.5 top-2.5 border-l-2 border-t-2`} />
      <span aria-hidden className={`${comun} right-2.5 top-2.5 border-r-2 border-t-2`} />
      <span aria-hidden className={`${comun} bottom-2.5 left-2.5 border-b-2 border-l-2`} />
      <span aria-hidden className={`${comun} bottom-2.5 right-2.5 border-b-2 border-r-2`} />
    </>
  );
}

/**
 * Glifo por plataforma. Se compara en minúsculas sobre el nombre que venga en
 * `redes`, y cualquier plataforma no contemplada cae en el icono de enlace
 * genérico en vez de romper la fila.
 */
function IconoRed({
  plataforma,
  grande,
}: {
  plataforma: string;
  grande?: boolean;
}) {
  const comun = {
    width: grande ? 18 : 13,
    height: grande ? 18 : 13,
    viewBox: "0 0 24 24",
    className: "shrink-0",
    "aria-hidden": true,
  } as const;
  const p = plataforma.toLowerCase();

  if (p.includes("tiktok"))
    return (
      <svg {...comun} fill="currentColor">
        <path d="M16.5 2h-3v13a2.5 2.5 0 1 1-2.5-2.5c.3 0 .5 0 .8.1V9.5a5.6 5.6 0 1 0 4.7 5.5V8.6c1 .7 2.2 1.1 3.5 1.2V6.6c-2-.2-3.5-1.9-3.5-4Z" />
      </svg>
    );
  if (p.includes("instagram"))
    return (
      <svg {...comun} fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  if (p.includes("youtube"))
    return (
      <svg {...comun} fill="currentColor">
        <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C18.4 5.2 12 5.2 12 5.2s-6.4 0-7.9.4A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 7.9.4 7.9.4s6.4 0 7.9-.4a2.5 2.5 0 0 0 1.7-1.7C22 15.2 22 12 22 12ZM10 15V9l5.2 3L10 15Z" />
      </svg>
    );
  if (p.includes("kick"))
    return (
      <svg {...comun} fill="currentColor">
        <path d="M1.333 0h8v5.333H12V2.667h2.667V0h8v8H20v2.667h-2.667v2.666H20V16h2.667v8h-8v-2.667H12v-2.666H9.333V24h-8Z" />
      </svg>
    );
  if (p === "x" || p.includes("twitter"))
    return (
      <svg {...comun} fill="currentColor">
        <path d="M17.53 3h3.18l-6.95 7.95L22 21h-6.4l-5.01-6.55L4.85 21H1.66l7.43-8.5L2 3h6.56l4.53 5.99L17.53 3Zm-1.12 16.06h1.76L7.67 4.84H5.78l10.63 14.22Z" />
      </svg>
    );
  return (
    <svg {...comun} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

/**
 * Encabezado de sección centrado, el mismo patrón que `Seccion` usa en la
 * home: antetítulo con filetes a los lados y título grande debajo.
 */
function EncabezadoSeccion({
  antetitulo,
  titulo,
}: {
  antetitulo: string;
  titulo: string;
}) {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <p className="flex items-center gap-3 font-cond text-[12px] font-bold uppercase tracking-[0.28em] text-oro">
        <span aria-hidden className="h-px w-8 bg-oro-profundo" />
        {antetitulo}
        <span aria-hidden className="h-px w-8 bg-oro-profundo" />
      </p>
      <h2 className="text-[38px] leading-none tracking-wide text-crema sm:text-[48px]">
        {titulo}
      </h2>
    </header>
  );
}
