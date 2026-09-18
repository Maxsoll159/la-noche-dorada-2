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
  type Peleador,
} from "@/lib/evento";
import { SITIO } from "@/lib/sitio";
import { ApoyoPeleador } from "@/app/components/apoyo-peleador";
import { Bandera } from "@/app/components/bandera";
import { NotaAprox } from "@/app/components/ficha-tape";
import { FileteOro } from "@/app/components/filete-oro";
import { Patrocinador } from "@/app/components/patrocinador";
import { Revelar } from "@/app/components/revelar";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";
import { VideoFondo } from "@/app/components/video-fondo";

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
    // El arte oficial del combate como imagen social: el retrato de 250×470
    // salía diminuto y recortado en las tarjetas de enlace.
    openGraph: {
      type: "profile",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      url: `/peleadores/${peleador.slug}`,
      images: [
        {
          url: combate.arte,
          width: 1080,
          height: 1140,
          alt: `${combate.a.nombre} vs ${combate.b.nombre}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      images: [combate.arte],
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

  // Con clip de fondo, la ficha entera entra 4 s mas tarde: lo primero que se
  // ve es el video, solo, y la informacion aparece encima despues. Afecta a
  // TODO el bloque (incluida la tarjeta del rival), porque los retardos salen
  // todos de aqui. Sin clip no hay nada que mirar mientras tanto, asi que no
  // se hace esperar a nadie y los retardos vuelven a ser los de siempre.
  //
  // Tiene un coste y conviene saberlo: el retrato es el LCP de esta pagina, y
  // retrasar su entrada retrasa la metrica en la misma medida. Es a proposito.
  const espera = peleador.video ? 4000 : 0;
  const entra = (ms: number) => ({ animationDelay: `${espera + ms}ms` });

  // Los textos sueltos (el rotulo del combate, el pais, la nota del asterisco)
  // caen sobre un clip que a ratos se ilumina, y ahi el dorado sobre dorado no
  // se lee. La sombra los salva sin tener que oscurecer mas el video, que es
  // justo lo que se quiere ver. `text-shadow` se hereda, asi que basta ponerla
  // en el contenedor. Las tarjetas (ficha, rival, redes) no la necesitan:
  // llevan fondo propio.
  const sombra = peleador.video
    ? "[text-shadow:0_2px_12px_rgba(11,11,13,0.95)]"
    : "";

  // Ficha física como "tale of the tape": tres números grandes con su unidad
  // aparte. Los que falten se saltan; sin ninguno, el bloque no se pinta. La
  // rejilla genérica de sede, formato y fecha salió de aquí: era la misma en
  // las 16 fichas y ese dato vive en "Su combate".
  const TAPE = [
    peleador.nacimiento && {
      etiqueta: "Edad",
      valor: String(edadEn(peleador.nacimiento, EVENTO.inicioISO)),
      unidad: "años",
    },
    peleador.altura && {
      etiqueta: "Altura",
      valor: coma(peleador.altura, 2),
      unidad: `m${asterisco}`,
    },
    peleador.peso && {
      etiqueta: "Peso",
      valor: coma(peleador.peso, 1),
      unidad: `kg${asterisco}`,
    },
  ].filter(Boolean) as { etiqueta: string; valor: string; unidad: string }[];

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

  // Vecinos en el cartel, para poder recorrer las dieciséis fichas sin volver
  // atrás cada vez. `PELEADORES` ya viene en orden de cartelera (los dos del
  // estelar primero), y la vuelta es circular: desde el último se sigue al
  // primero, así nunca hay un callejón sin salida.
  const puesto = PELEADORES.findIndex((p) => p.slug === peleador.slug);
  const anterior = PELEADORES[(puesto - 1 + PELEADORES.length) % PELEADORES.length];
  const siguiente = PELEADORES[(puesto + 1) % PELEADORES.length];

  // Migas para el buscador: Inicio > Combates > peleador. Enlaza la ficha
  // con la home y le da contexto de sitio al resultado.
  const migas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: EVENTO.nombre, item: SITIO },
      { "@type": "ListItem", position: 2, name: "Combates", item: `${SITIO}/#combates` },
      {
        "@type": "ListItem",
        position: 3,
        name: peleador.nombre,
        item: `${SITIO}/peleadores/${peleador.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // El contenido es nuestro y no lleva entrada de usuario.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migas) }}
      />
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-noche pt-24 pb-16 lg:pt-32 lg:pb-20">
          {/* Clip de presentación de fondo, solo para quien lo tenga. Quien no,
              se queda con el degradado opaco de siempre y su ficha no cambia
              en nada.
              Arranca DEBAJO de la barra (81 px, 89 desde lg: su alto medido),
              no detrás: ahí el header pone su propio velo y el clip se veía
              apagado, como si la franja de arriba estuviera cortada. Así la
              barra queda sobre negro limpio y el video empieza donde acaba.
              El alto va explícito en vez de fiarlo a `bottom-0`: un <video> es
              un elemento reemplazado y con `width/height: auto` usaría su
              tamaño intrínseco en lugar del hueco que le dejan los insets. */}
          {peleador.video && (
            <VideoFondo
              src={peleador.video}
              className="absolute inset-x-0 top-[81px] -z-20 h-[calc(100%-81px)] w-full object-cover lg:top-[89px] lg:h-[calc(100%-89px)]"
            />
          )}
          {/* El mismo degradado en dos versiones. Con video va en rgba, para
              que el clip se vea por debajo; sin video va opaco, exactamente
              como estaba. Es lo que hace que el texto siga legible encima de
              una imagen en movimiento. */}
          <div
            aria-hidden
            className={`absolute -z-10 ${
              peleador.video
                ? "inset-x-0 bottom-0 top-[81px] bg-[radial-gradient(95%_85%_at_50%_38%,rgba(20,16,10,0.34)_0%,rgba(13,13,16,0.6)_55%,rgba(11,11,13,0.8)_100%)] lg:top-[89px]"
                : "inset-0 bg-[radial-gradient(60%_55%_at_50%_30%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
            }`}
          />
          <div className="mx-auto flex max-w-contenido flex-col gap-8 px-6 lg:px-14">
            <Link
              href="/#combates"
              style={entra(60)}
              className={`entrada flex items-center gap-2 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-oro-medio transition-colors hover:text-oro ${sombra}`}
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

            {/* En móvil, el orden es encabezado, retrato y datos: el nombre
                es lo primero que se lee, no una foto de 400 px. En escritorio
                el retrato ocupa la columna izquierda entera y el encabezado y
                los datos se reparten a su derecha. */}
            <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[430px_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-12 lg:gap-y-6">
              <div
                style={entra(140)}
                className={`entrada flex flex-col items-center gap-1.5 text-center sm:gap-3 lg:col-start-2 lg:row-start-1 lg:items-start lg:self-end lg:text-left ${sombra}`}
              >
                {/* Rótulo del combate y fecha, como el kicker de una nota */}
                <p className="flex flex-wrap items-center justify-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.18em] lg:justify-start">
                  <span
                    className={`rounded-sm px-2 py-1 leading-none ${
                      combate.estelar
                        ? "bg-oro text-noche"
                        : combate.billing
                          ? "border border-oro text-oro"
                          : "border border-oro-profundo text-oro"
                    }`}
                  >
                    {combate.billing ?? `Combate ${combate.n}`}
                  </span>
                  {combate.billing && (
                    <span className="text-oro-medio">Combate {combate.n}</span>
                  )}
                  {/* La fecha entera solo desde sm. En móvil era ella la que
                      partía el rótulo en dos líneas y engordaba el encabezado,
                      que es lo primero que se ve; además se repite completa
                      unas pantallas más abajo, en "Su combate". */}
                  <span aria-hidden className="hidden text-oro-medio sm:inline">
                    ·
                  </span>
                  <span className="hidden text-oro-medio sm:inline">
                    {EVENTO.fechaLarga}
                  </span>
                </p>
                {/* Tamaños escalonados y `break-words`: con `auto` a 92px,
                    "JH de la Cruz 777" se salía de la columna. */}
                {/* La tilde de la Ñ la resuelve ya `texto-oro`, que agranda su
                    propia caja para que el degradado cubra los glifos. */}
                <h1 className="texto-oro w-full break-words text-[36px] leading-[1.12] sm:text-[58px] lg:text-[72px]">
                  {peleador.nombre}
                </h1>
                <p className="flex items-center gap-2.5 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-oro">
                  <Bandera pais={peleador.pais} className="h-3.5 w-[21px]" />
                  {pais.nombre}
                </p>
              </div>

              {/* Retrato enmarcado. El rótulo del combate ya va en el kicker,
                  así que la foto queda limpia. */}
              <div
                style={entra(240)}
                className="entrada group relative w-full max-w-[380px] self-center overflow-hidden rounded-sm border border-oro-profundo bg-[#0e0e12] transition-colors duration-300 hover:border-oro lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:w-[430px] lg:max-w-none"
              >
                <div className="relative h-[380px] w-full sm:h-[490px] lg:h-[560px]">
                  <Image
                    src={peleador.cuerpo ?? peleador.foto}
                    alt={peleador.nombre}
                    fill
                    // El retrato es el LCP de la ficha: se precarga.
                    preload
                    sizes="(min-width: 1024px) 430px, 380px"
                    // Quien no tenga recorte de estudio cae en su retrato, que
                    // es de 250×470 y está pensado para miniaturas: aquí va
                    // también en contain. Con cover, este marco lo ampliaba
                    // hasta dejar en pantalla un ojo.
                    className={`object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.04] ${
                      peleador.cuerpo
                        ? "brightness-125 contrast-[1.06] saturate-105"
                        : "brightness-110"
                    }`}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,11,13,0.35)_0%,transparent_26%,transparent_62%,rgba(11,11,13,0.5)_84%,rgba(11,11,13,0.95)_100%)]"
                  />
                  <Escuadras />
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

              <div className="flex min-w-0 flex-col gap-5 lg:col-start-2 lg:row-start-2 lg:self-start">
                {/* Tale of the tape: tres números grandes, uno por celda */}
                {TAPE.length > 0 && (
                  <div style={entra(340)} className="entrada flex flex-col gap-2">
                    <dl
                      className="grid overflow-hidden rounded-sm border border-linea bg-carbon"
                      style={{ gridTemplateColumns: `repeat(${TAPE.length}, minmax(0, 1fr))` }}
                    >
                      {TAPE.map((d, i) => (
                        <div
                          key={d.etiqueta}
                          className={`flex flex-col items-center gap-1.5 px-2 py-4 text-center sm:py-5 ${
                            i > 0 ? "border-l border-linea" : ""
                          }`}
                        >
                          <dt className="font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro-medio">
                            {d.etiqueta}
                          </dt>
                          <dd className="flex items-baseline gap-1 font-display leading-none text-crema">
                            <span className="text-[30px] tabular-nums sm:text-[38px]">
                              {d.valor}
                            </span>
                            <span className="font-cond text-[12px] font-bold uppercase tracking-[0.1em] text-tenue">
                              {d.unidad}
                            </span>
                          </dd>
                        </div>
                      ))}
                    </dl>
                    {peleador.aprox && (
                      <p className={`text-center font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-oro-medio lg:text-left ${sombra}`}>
                        * Dato no oficial · El pesaje de la velada manda
                      </p>
                    )}
                  </div>
                )}

                {/* El duelo: el rival con foto, y debajo las dos acciones de
                    la ficha (votar y ver el combate), que bajan a las
                    secciones de esta misma página. */}
                <div
                  style={entra(420)}
                  className="entrada-resplandor overflow-hidden rounded-sm border border-oro-profundo bg-carbon"
                >
                  <Link
                    href={`/peleadores/${rival.slug}`}
                    className="group relative flex items-center gap-4 overflow-hidden px-4 py-4 transition-colors hover:bg-oro-tinte sm:px-5"
                  >
                    {/* Barrido dorado periódico: sin esto la fila se perdía
                        entre las demás cajas y nadie la tocaba. */}
                    <span
                      aria-hidden
                      className="destello pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-oro/15 to-transparent"
                    />
                    <span className="relative block h-[88px] w-[70px] shrink-0 overflow-hidden rounded-sm border border-linea bg-[#0e0e12] transition-colors group-hover:border-oro">
                      <Image
                        src={rival.cuerpo ?? rival.foto}
                        alt=""
                        fill
                        sizes="70px"
                        className={`object-cover object-top ${
                          rival.cuerpo ? "brightness-125 contrast-[1.06]" : ""
                        }`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-medio">
                        <span className="relative grid size-6 shrink-0 place-items-center">
                          <span
                            aria-hidden
                            className="absolute inset-0 rotate-45 rounded-[2px] border border-oro-profundo bg-noche/80"
                          />
                          <span className="relative font-display text-[10px] text-oro">
                            VS
                          </span>
                        </span>
                        Su rival
                      </span>
                      {/* leading holgado: con `truncate` (overflow hidden) y
                          leading-none la tilde de la Ñ quedaba recortada. */}
                      <span className="mt-1 block truncate font-display text-[22px] uppercase leading-[1.2] text-crema transition-colors group-hover:text-oro sm:text-[26px]">
                        {rival.nombre}
                      </span>
                      <span className="mt-1.5 flex items-center gap-2 font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-tenue">
                        <Bandera pais={rival.pais} className="h-2.5 w-[15px]" />
                        {BANDERAS[rival.pais].nombre}
                        <span className="text-oro-medio">· Ver su ficha</span>
                      </span>
                    </span>
                  </Link>

                  <div className="grid grid-cols-2 border-t border-linea">
                    <a
                      href="#pronostico"
                      className="flex items-center justify-center gap-2 bg-oro px-3 py-3 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-noche transition-colors hover:bg-oro-claro"
                    >
                      Votar pronóstico
                    </a>
                    <a
                      href="#combate"
                      className="group flex items-center justify-center gap-2 border-l border-linea px-3 py-3 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:bg-oro-tinte"
                    >
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
                        className="transition-transform group-hover:translate-y-0.5"
                      >
                        <path d="M12 5v14m-6-6 6 6 6-6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Redes a ancho completo bajo la foto y la info, centradas. En la
                columna de info quedaban colgadas a la derecha y, con cinco
                plataformas, el grid dejaba una tarjeta huérfana en otra fila.
                `flex-wrap` + ancho fijo centra cualquier cantidad. */}
            {peleador.redes && peleador.redes.length > 0 && (
              <div
                style={entra(580)}
                className="entrada flex flex-col items-center gap-3"
              >
                <ul className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                  {peleador.redes.map((r) => (
                    <li key={r.url}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center gap-2 rounded-sm border border-linea bg-carbon px-3 py-2 transition duration-300 hover:-translate-y-0.5 hover:border-oro hover:bg-oro-tinte sm:w-[186px] sm:gap-2.5 sm:py-2.5"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-sm border border-oro-profundo text-oro transition-colors duration-300 group-hover:border-oro">
                          <IconoRed plataforma={r.plataforma} grande />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block whitespace-nowrap font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-crema sm:text-[11px] sm:tracking-[0.18em] sm:text-oro-medio">
                            {r.plataforma}
                          </span>
                          {/* El handle solo desde sm: en móvil la tarjeta no
                              da el ancho y salía truncado en las 5. */}
                          <span className="hidden truncate font-cond text-[12px] font-semibold text-crema sm:block">
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
                  <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-oro-medio">
                    Seguidores a {REDES_ACTUALIZADAS} · Varían a diario
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Señal de que la página sigue. Solo cuando hay clip: ahí el hero se
              queda cuatro segundos quieto y parece el final de la página.
              Solo en escritorio, que es donde el pie del hero cae justo en el
              pliegue; en móvil la sección es más alta que la pantalla y la
              flecha quedaría ya fuera de vista, sin avisar de nada.
              La flecha y su envoltorio van separados a propósito: `entrada` y
              `flotar` declaran las dos la propiedad `animation` y en el mismo
              elemento la segunda borraría a la primera. */}
          {peleador.video && (
            <div
              aria-hidden
              style={entra(900)}
              className="entrada absolute inset-x-0 bottom-6 hidden justify-center lg:flex"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="flotar text-oro-medio"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          )}
        </section>

        <FileteOro />

        <section className="bg-superficie">
          <div className="mx-auto flex max-w-contenido flex-col gap-12 px-6 py-16 lg:px-14 lg:py-20">
            {/* Los id son el destino de los botones del duelo de arriba */}
            <Revelar id="pronostico" className="flex scroll-mt-28 flex-col gap-8">
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

            <Revelar id="combate" retardo={80} className="flex scroll-mt-28 flex-col gap-8">
              <EncabezadoSeccion antetitulo={diaYMes} titulo="Su combate" />

              <div className="grid items-center gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
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
                            <dt className="font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-medio">
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

              {/* Frente a frente: la ficha de los dos, dato a dato, con este
                  peleador siempre a la izquierda. */}
              <FrenteAFrente peleador={peleador} rival={rival} />
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
                      <span className="font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-oro-medio">
                        Combate {c.n}
                      </span>
                      <span className="flex items-center gap-1.5">
                        {/* El recorte de estudio, no el retrato del arte: ese
                            viene tan cerrado que a este tamaño quedaban solo
                            ojos y nariz. */}
                        {[c.a, c.b].map((p) => (
                          <span
                            key={p.slug}
                            className="relative block aspect-[3/4] flex-1 overflow-hidden rounded-sm border border-linea bg-[#0e0e12]"
                          >
                            <Image
                              src={p.cuerpo ?? p.foto}
                              alt=""
                              fill
                              sizes="140px"
                              className={`object-cover object-top transition-opacity group-hover:opacity-90 ${
                                p.cuerpo ? "brightness-125 contrast-[1.06]" : ""
                              }`}
                            />
                          </span>
                        ))}
                      </span>
                      <span className="font-display text-[13px] uppercase leading-tight text-crema">
                        {c.a.nombre}
                        <span className="text-oro-medio"> vs </span>
                        {c.b.nombre}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Revelar>

            {/* Paso al peleador de al lado. Además de ahorrar el viaje de ida y
                vuelta a la cartelera, enlaza cada ficha con las dos contiguas,
                que es lo que evita que las dieciséis queden sueltas unas de
                otras para el buscador. */}
            <Revelar retardo={80}>
              <nav
                aria-label="Ir a otro peleador del cartel"
                className="grid gap-3 sm:grid-cols-2"
              >
                {[
                  { p: anterior, rotulo: "Anterior", derecha: false },
                  { p: siguiente, rotulo: "Siguiente", derecha: true },
                ].map(({ p, rotulo, derecha }) => (
                  <Link
                    key={rotulo}
                    href={`/peleadores/${p.slug}`}
                    className={`group flex items-center gap-4 rounded-sm border border-linea bg-carbon p-3 transition duration-300 hover:border-oro hover:bg-oro-tinte ${
                      derecha ? "sm:flex-row-reverse sm:text-right" : ""
                    }`}
                  >
                    <span className="relative block h-[64px] w-[52px] shrink-0 overflow-hidden rounded-sm border border-linea bg-[#0e0e12] transition-colors group-hover:border-oro-profundo">
                      <Image
                        src={p.cuerpo ?? p.foto}
                        alt=""
                        fill
                        sizes="52px"
                        className={`object-cover object-top ${
                          p.cuerpo ? "brightness-125 contrast-[1.06]" : ""
                        }`}
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`flex items-center gap-1.5 font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro-medio ${
                          derecha ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        <svg
                          aria-hidden
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-transform duration-300 ${
                            derecha
                              ? "group-hover:translate-x-0.5"
                              : "group-hover:-translate-x-0.5"
                          }`}
                        >
                          <path d={derecha ? "M5 12h14M13 6l6 6-6 6" : "M19 12H5M11 6l-6 6 6 6"} />
                        </svg>
                        {rotulo}
                      </span>
                      <span className="mt-1 block truncate font-display text-[19px] uppercase leading-[1.2] text-crema transition-colors group-hover:text-oro sm:text-[22px]">
                        {p.nombre}
                      </span>
                      <span
                        className={`mt-1 flex items-center gap-2 font-cond text-[11px] font-semibold uppercase tracking-[0.12em] text-tenue ${
                          derecha ? "sm:flex-row-reverse" : ""
                        }`}
                      >
                        <Bandera pais={p.pais} className="h-2.5 w-[15px]" />
                        {BANDERAS[p.pais].nombre}
                      </span>
                    </span>
                  </Link>
                ))}
              </nav>
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

/**
 * Filas del frente a frente, con los valores CRUDOS para poder compararlos.
 *
 * `FILAS_TAPE` (el del cara a cara) devuelve el texto ya formateado, que sirve
 * para pintar pero no para saber quién saca ventaja. Aquí hace falta el número.
 *
 * `ventaja` dice qué extremo destaca, y es un dato, no una opinión sobre quién
 * va a ganar: en altura y peso destaca el más grande; en edad, el más joven.
 * `diferencia` redacta la distancia en la unidad en que se habla de ella —los
 * centímetros de estatura se dicen en centímetros, no en metros.
 */
const FILAS_FRENTE: {
  etiqueta: string;
  valor: (p: Peleador) => number | null;
  texto: (n: number, p: Peleador) => string;
  ventaja: "mayor" | "menor";
  diferencia: (d: number) => string;
}[] = [
  {
    etiqueta: "Edad",
    valor: (p) => (p.nacimiento ? edadEn(p.nacimiento, EVENTO.inicioISO) : null),
    texto: (n) => String(n),
    ventaja: "menor",
    diferencia: (d) => `${d} ${d === 1 ? "año" : "años"} menos`,
  },
  {
    etiqueta: "Altura",
    valor: (p) => p.altura ?? null,
    texto: (n, p) => `${coma(n, 2)} m${p.aprox ? "*" : ""}`,
    ventaja: "mayor",
    diferencia: (d) => `+${Math.round(d * 100)} cm`,
  },
  {
    etiqueta: "Peso",
    valor: (p) => p.peso ?? null,
    texto: (n, p) => `${coma(n, 1)} kg${p.aprox ? "*" : ""}`,
    ventaja: "mayor",
    diferencia: (d) => `+${coma(d, 1)} kg`,
  },
];

/**
 * Ficha comparada del combate: valor de este peleador a la izquierda, el dato
 * al centro y el del rival a la derecha.
 *
 * Cada fila marca quién saca ventaja y cuánta. Antes eran dos columnas de
 * números iguales y había que restar de cabeza para enterarse de que uno saca
 * trece centímetros al otro, que es justo lo que interesa de una tabla así.
 *
 * Solo se marca cuando los dos datos existen y son distintos: con un hueco
 * o con un empate no hay ventaja que contar.
 */
function FrenteAFrente({
  peleador,
  rival,
}: {
  peleador: Peleador;
  rival: Peleador;
}) {
  return (
    <div className="flex flex-col gap-3">
      <dl className="overflow-hidden rounded-sm border border-linea bg-carbon">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-linea bg-[#08080b] px-4 py-3 sm:px-6">
          <span className="truncate font-display text-[15px] uppercase text-oro-claro sm:text-[18px]">
            {peleador.nombre}
          </span>
          <span className="font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro-medio">
            Frente a frente
          </span>
          <span className="truncate text-right font-display text-[15px] uppercase text-crema sm:text-[18px]">
            {rival.nombre}
          </span>
        </div>
        {FILAS_FRENTE.map((fila, i) => {
          const a = fila.valor(peleador);
          const b = fila.valor(rival);
          const hayVentaja = a !== null && b !== null && a !== b;
          const ganaA = hayVentaja && (fila.ventaja === "mayor" ? a > b : a < b);
          const ganaB = hayVentaja && !ganaA;
          const distancia = hayVentaja ? fila.diferencia(Math.abs(a - b)) : null;

          const celda = (
            n: number | null,
            p: Peleador,
            gana: boolean,
            derecha: boolean,
          ) => (
            <dd
              className={`flex flex-col gap-1 ${derecha ? "items-end" : "items-start"}`}
            >
              <span
                className={`font-display text-[22px] leading-none tabular-nums sm:text-[26px] ${
                  n === null ? "text-tenue" : gana ? "text-oro" : "text-crema"
                }`}
              >
                {n === null ? "—" : fila.texto(n, p)}
              </span>
              {gana && distancia && (
                <span className="rounded-full border border-oro-profundo bg-oro-tinte px-2 py-[2px] font-cond text-[10px] font-bold uppercase leading-none tracking-[0.1em] text-oro">
                  {distancia}
                </span>
              )}
            </dd>
          );

          return (
            <div
              key={fila.etiqueta}
              className={`grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-6 ${
                i > 0 ? "border-t border-linea/70" : ""
              }`}
            >
              {celda(a, peleador, ganaA, false)}
              <dt className="w-[76px] text-center font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro">
                {fila.etiqueta}
              </dt>
              {celda(b, rival, ganaB, true)}
            </div>
          );
        })}
      </dl>
      {(peleador.aprox || rival.aprox) && <NotaAprox />}
    </div>
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
