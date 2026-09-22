"use client";

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BANDERAS,
  COMBATES,
  PELEADORES,
  fichaDe,
  type Peleador,
} from "@/lib/evento";
import { Bandera } from "./bandera";
import { FILAS_TAPE, NotaAprox } from "./ficha-tape";
import { VideoFondo } from "./video-fondo";

type Lado = "a" | "b";

/**
 * Orden de la parrilla. PELEADORES viene por combates y dejaba a cada rival
 * pegado al suyo; aquí van barajados a mano, con un orden fijo para que el
 * servidor y el navegador pinten lo mismo. En dos filas de ocho ningún rival
 * queda al lado ni encima del otro. Si el cartel suma a alguien que no esté
 * en la lista, entra al final en vez de perderse.
 *
 * La primera línea es la fila de arriba y la segunda la de abajo: cada columna
 * empareja al de una con el de la otra, así que revisa las dos direcciones si
 * vuelves a tocar el orden.
 */
const ORDEN_PARRILLA = [
  "jh", "jeque", "daniela", "pauchikita", "sacha", "kingteka", "piero", "pulsera",
  "bebote", "shelao", "pepita", "ismael-sanchez", "canita", "emetsuki", "jota", "neutro",
];
const PARRILLA: Peleador[] = [
  ...ORDEN_PARRILLA.flatMap((slug) => PELEADORES.filter((p) => p.slug === slug)),
  ...PELEADORES.filter((p) => !ORDEN_PARRILLA.includes(p.slug)),
];

/**
 * Los `sizes` de la silueta grande. Es una constante y no un literal suelto
 * porque la precarga tiene que pedir EXACTAMENTE la misma variante que luego
 * va a pintar `<Image>`: si los dos valores se separan, el navegador elige
 * candidatos distintos del `srcset` y la silueta se descarga dos veces.
 */
const SIZES_FIGURA = "(min-width: 1024px) 600px, 62vw";

/** Siluetas ya pedidas. A nivel de módulo: una sola vez por carga de página. */
const pedidas = new Set<string>();

/**
 * Adelanta una silueta al navegador, antes de que la pidan.
 *
 * La demora al cambiar de peleador es que la silueta no se pedía hasta el
 * clic, y ahí se pagaba todo junto: el optimizador de Next decodificando el
 * WebP original, redimensionándolo y recodificándolo (unos 100 ms), más la
 * descarga (~43 KB, que en móvil es lo que de verdad pesa). Se paga una sola
 * vez —después queda cacheada—, pero la pagaba justo quien acababa de tocar.
 *
 * Se llama desde la parrilla al apuntar o apoyar el dedo en una casilla, que
 * es lo que llega antes que el clic. Deliberadamente NO se precargan las
 * dieciséis de entrada: serían unos 690 KB para alguien que quizá solo mire
 * un combate, y aquí pesa más no gastarle datos que ahorrarle el primer clic.
 */
function precargarFigura(src: string) {
  if (pedidas.has(src)) return;
  pedidas.add(src);

  // `getImageProps` es la forma documentada de saber qué URL pediría `<Image>`
  // sin replicar a mano las rutas del optimizador, que son internas.
  const { props } = getImageProps({
    src,
    alt: "",
    fill: true,
    sizes: SIZES_FIGURA,
  });

  const img = new window.Image();
  // Prioridad baja: esto es trabajo adelantado para un clic que quizá no
  // llegue, y no tiene por qué competir con lo que ya se está mirando.
  // Donde no exista la propiedad, la asignación sencillamente no hace nada.
  img.fetchPriority = "low";
  // `sizes` y `srcSet` ANTES que `src`: el navegador escoge el candidato en el
  // momento en que se asigna `src`, así que al revés se llevaría el mayor del
  // srcset y la variante buena quedaría sin pedir.
  if (props.sizes) img.sizes = props.sizes;
  if (props.srcSet) img.srcset = props.srcSet;
  img.src = props.src;
}

/**
 * Jugador 1 a la izquierda, jugador 2 a la derecha, como en una pantalla de
 * selección de personaje. El color es de interfaz: no dice nada de las
 * esquinas oficiales del combate.
 */
const LADO = {
  a: { numero: 1, borde: "border-lado-a", fondo: "bg-lado-a", tinte: "bg-lado-a/20", brillo: "shadow-[0_0_22px_rgba(226,54,44,0.5)]" },
  b: { numero: 2, borde: "border-lado-b", fondo: "bg-lado-b", tinte: "bg-lado-b/20", brillo: "shadow-[0_0_22px_rgba(47,123,230,0.5)]" },
} as const;

/**
 * Silueta grande de un peleador, ocupando su mitad del escenario. Toda la foto
 * es el enlace a su ficha. En móvil las dos mitades se pisan un poco en el
 * centro para que las figuras salgan grandes; en escritorio cada una se queda
 * en su lado.
 */
function Figura({ peleador, lado }: { peleador: Peleador; lado: Lado }) {
  const izq = lado === "a";
  return (
    <Link
      href={`/peleadores/${peleador.slug}`}
      aria-label={`Ver la ficha de ${peleador.nombre}`}
      // Por debajo de lg cada figura va corrida hacia su borde, incluso
      // saliéndose un poco del cuadro: pegadas al centro se leían como una
      // sola masa con el VS. En escritorio el escenario es ancho de sobra y
      // pasaba lo contrario: quedaban chicas y lejos, con el VS mandando en
      // un centro vacío, así que ahí entran unos puntos hacia el medio.
      // top-[15%]: la figura mide un 85% del escenario, no el alto entero, y
      // deja la franja de arriba libre para los nombres.
      className={`group absolute bottom-0 top-[15%] z-10 block w-[58%] sm:w-[52%] lg:w-[44%] ${
        izq
          ? "-left-[10%] sm:-left-[6%] lg:left-[5%]"
          : "-right-[10%] sm:-right-[6%] lg:right-[5%]"
      }`}
    >
      {/* El nodo con `key` tiene que ser HIJO ÚNICO de su envoltorio: si
          convive con hermanos sin key, React no da de baja el anterior y los
          peleadores se van apilando uno encima de otro a cada cambio.
          La key remonta el nodo y eso vuelve a disparar la animación. */}
      <div className="absolute inset-0">
        <span key={peleador.slug} className="cambio absolute inset-0">
          <Image
            src={peleador.cuerpo ?? peleador.foto}
            alt={peleador.nombre}
            fill
            sizes={SIZES_FIGURA}
            // Los recortes salen normalizados: misma proporción, silueta
            // centrada y apoyada al pie, así que alcanza object-contain.
            // El brillo compensa que son tomas de estudio muy oscuras.
            // Quien no tenga recorte de estudio cae en su retrato, que es de
            // 250×470: aquí va TAMBIÉN en contain. Con cover, esta caja (ancha)
            // ampliaba el retrato hasta dejar en pantalla media ceja.
            className={`transition-transform duration-500 group-hover:scale-[1.03] object-contain object-bottom ${
              peleador.cuerpo
                ? "brightness-125 contrast-[1.06] saturate-105"
                : "brightness-110"
            }`}
          />
        </span>
      </div>
    </Link>
  );
}

/**
 * Nombre del peleador en la esquina superior de su lado, como el marcador de
 * un juego de pelea: por encima de la cabeza, así no pisa la foto. Va aparte
 * de la figura, con z propio, para que en móvil el del jugador 1 no quede
 * debajo de la foto del jugador 2 donde las dos mitades se pisan.
 */
function Rotulo({ peleador, lado }: { peleador: Peleador; lado: Lado }) {
  const izq = lado === "a";
  return (
    <div
      className={`absolute top-3 z-20 max-w-[46%] sm:top-5 ${
        izq ? "left-[3%]" : "right-[3%]"
      }`}
    >
      <Link
        key={peleador.slug}
        href={`/peleadores/${peleador.slug}`}
        className={`cambio-texto group flex flex-col gap-1 sm:gap-1.5 ${
          izq ? "items-start text-left" : "items-end text-right"
        }`}
      >
        <p className="flex items-center gap-1.5 rounded-sm border border-oro-profundo bg-noche/80 px-2 py-1 font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-oro sm:gap-2 sm:px-2.5 sm:text-[11px]">
          <Bandera
            pais={peleador.pais}
            className="h-2.5 w-[15px] sm:h-3 sm:w-[19px]"
          />
          {BANDERAS[peleador.pais].nombre}
        </p>
        {/* Inclinado como el lettering de las pantallas de selección. Anton
            no tiene cursiva, así que la inclinación es un skew.
            leading holgado a propósito: `texto-oro` usa background-clip:text
            y con la caja de línea corta se recorta la tilde de la Ñ. */}
        <h3 className="texto-oro -skew-x-6 break-words text-[20px] leading-[1.08] drop-shadow-[0_8px_22px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-[1.02] sm:text-[30px] lg:text-[36px]">
          {peleador.nombre}
        </h3>
        {/* El botón solo en escritorio: por debajo la esquina no da alto sin
            llegar a la cabeza. El nombre y la foto ya son el enlace. */}
        <span className="hidden items-center gap-2 rounded-sm border border-oro bg-oro-tinte px-3 py-1.5 font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-oro transition-colors duration-300 group-hover:bg-oro group-hover:text-noche lg:flex">
          Ver ficha
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
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </Link>
    </div>
  );
}

/**
 * Ficha física de un peleador: edad, altura y peso. Va fuera de la foto, que
 * es lo que no había que tapar: en escritorio a un costado de la parrilla,
 * en la zona de piernas que ya está en penumbra; por debajo de lg, debajo de
 * la parrilla. Lleva el nombre chico y el número porque queda lejos del
 * rótulo grande.
 */
function Ficha({
  peleador,
  lado,
  className = "",
}: {
  peleador: Peleador;
  lado: Lado;
  className?: string;
}) {
  const izq = lado === "a";
  const estilo = LADO[lado];
  return (
    <div
      key={peleador.slug}
      className={`cambio-texto flex flex-col gap-2 rounded-sm bg-noche/70 px-3 py-2.5 backdrop-blur-sm lg:px-4 lg:py-3.5 ${
        izq
          ? `items-start border-l-2 text-left ${estilo.borde}`
          : `items-end border-r-2 text-right ${estilo.borde}`
      } ${className}`}
    >
      <p
        className={`flex items-center gap-2 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-tenue ${
          izq ? "" : "flex-row-reverse"
        }`}
      >
        <span
          className={`grid size-4 place-items-center font-display text-[11px] leading-none text-white ${estilo.fondo}`}
        >
          {estilo.numero}
        </span>
        <span className="truncate">{peleador.nombre}</span>
      </p>
      <dl className={`flex gap-4 sm:gap-5 lg:flex-col lg:gap-2 ${izq ? "" : "flex-row-reverse lg:flex-col"}`}>
        {FILAS_TAPE.map((fila) => {
          const v = fila.valor(peleador);
          return (
            <div
              key={fila.etiqueta}
              className={`flex flex-col gap-0.5 ${izq ? "items-start" : "items-end"}`}
            >
              <dt className="font-cond text-[10px] font-bold uppercase tracking-[0.18em] text-oro-medio sm:text-[11px]">
                {fila.etiqueta}
              </dt>
              <dd
                className={`whitespace-nowrap font-display text-[14px] leading-none sm:text-[18px] lg:text-[20px] ${
                  v ? "text-crema" : "text-tenue"
                }`}
              >
                {v ?? "—"}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}

/**
 * Ficha comparada para pantallas chicas: el elegido a la izquierda, el dato una
 * sola vez al centro y su contrincante a la derecha. Arriba, los nombres con su
 * número. Cabe en cualquier ancho porque cada fila es una sola línea de tres
 * celdas.
 */
function FichaComparada({
  izq,
  der,
  clave,
}: {
  /** El elegido, que siempre va a la izquierda. */
  izq: Peleador;
  /** Su contrincante. */
  der: Peleador;
  /** Remonta el nodo al cambiar de combate, para redisparar la animación. */
  clave: string;
}) {
  return (
    <dl
      key={clave}
      className="cambio-texto overflow-hidden rounded-sm border border-linea bg-noche/70"
    >
      <div className="flex items-center justify-between gap-3 border-b border-linea bg-[#08080b] px-3 py-2.5">
        {/* Solo el nombre con su número: el enlace a la ficha ya está en el
            botón dorado sobre cada figura, y repetirlo aquí era el tercer
            "Ver ficha" por peleador en la misma pantalla. */}
        {(["a", "b"] as const).map((lado) => {
          const primero = lado === "a";
          const p = primero ? izq : der;
          return (
            <span
              key={lado}
              className={`flex min-w-0 items-center gap-2 ${
                primero ? "" : "flex-row-reverse text-right"
              }`}
            >
              <span
                className={`grid size-4 shrink-0 place-items-center font-display text-[11px] leading-none text-white ${LADO[lado].fondo}`}
              >
                {LADO[lado].numero}
              </span>
              <span className="truncate font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-crema">
                {p.nombre}
              </span>
            </span>
          );
        })}
      </div>
      {FILAS_TAPE.map((fila, i) => {
        const a = fila.valor(izq);
        const b = fila.valor(der);
        return (
          <div
            key={fila.etiqueta}
            className={`flex items-center gap-2 px-3 py-2 ${i > 0 ? "border-t border-linea/70" : ""}`}
          >
            <dd
              className={`flex-1 whitespace-nowrap text-left font-display text-[17px] leading-none ${
                a ? "text-crema" : "text-tenue"
              }`}
            >
              {a ?? "—"}
            </dd>
            <dt className="w-[68px] shrink-0 text-center font-cond text-[10px] font-bold uppercase tracking-[0.2em] text-oro">
              {fila.etiqueta}
            </dt>
            <dd
              className={`flex-1 whitespace-nowrap text-right font-display text-[17px] leading-none ${
                b ? "text-crema" : "text-tenue"
              }`}
            >
              {b ?? "—"}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

export function CaraACara() {
  // Se guarda el PELEADOR elegido, no el combate. Antes se guardaba el
  // combate y se pintaba siempre por el lado oficial del cartel, así que al
  // tocar a alguien del lado b aparecía a la derecha y su rival a la
  // izquierda: el que elegías nunca podía ser el primero. Con el clip de
  // fondo el fallo se volvió obvio, porque sonaba el del rival.
  // `fichaDe` ya devuelve el combate, el elegido y su contrincante.
  const [elegido, setElegido] = useState(COMBATES[0].a.slug);
  const ficha = fichaDe(elegido) ?? fichaDe(COMBATES[0].a.slug)!;
  const { combate } = ficha;
  // Izquierda es SIEMPRE el elegido; derecha, su rival. De aquí en adelante
  // "a" y "b" son posiciones en pantalla, no las esquinas del cartel.
  const izq = ficha.peleador;
  const der = ficha.rival;

  // Clip de fondo del escenario: el del ELEGIDO y, si no tiene, el del rival.
  // Con uno basta para ambientar el combate; dos a la vez serían dos descargas
  // para un solo fondo. Diez de los dieciséis tienen clip; en los combates
  // donde no lo tiene ninguno, el escenario se ve exactamente como siempre.
  const clip = izq.video ?? der.video;

  // Al azar elige PELEADOR, no combate: así el sorteo también decide quién se
  // pone delante, y repetir combate cambiando de esquina es un resultado
  // válido.
  const alAzar = () => {
    const otros = PELEADORES.filter((p) => p.slug !== elegido);
    setElegido(otros[Math.floor(Math.random() * otros.length)].slug);
  };

  // Posición que ocupa un peleador en pantalla, o null si no es de este combate
  const ladoDe = (slug: string): Lado | null =>
    izq.slug === slug ? "a" : der.slug === slug ? "b" : null;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {/* Sin marco ni fondo propio: el escenario se funde con el fondo de la
          sección hacia los bordes, así no se lee como un rectángulo. */}
      <div className="relative w-full overflow-hidden">
        {/* ESCENARIO. Los dos peleadores frente a frente, el marcador arriba
            y un fogonazo con el VS en el centro. La parrilla de abajo se le
            monta encima con margen negativo, como en la pantalla de
            selección: las piernas asoman a los costados. */}
        {/* En escritorio la altura sigue a la ventana, con piso y techo: la
            idea es que título, escenario y parrilla se vean juntos sin
            hacer scroll en un monitor normal. */}
        <div className="relative h-[340px] w-full overflow-hidden sm:h-[480px] lg:h-[clamp(460px,58vh,680px)]">
          {/* Clip del combate elegido, de fondo del escenario. La `key` lo
              remonta al cambiar de combate: sin ella el <video> conserva el
              reproductor anterior y el fundido de entrada no se redispara. */}
          {clip && (
            <VideoFondo
              key={clip}
              src={clip}
              // La máscara radial es lo que evita que el clip se lea como un
              // rectángulo pegado encima: sin ella corta en seco y dibuja una
              // caja negra dentro de la sección. Así se apaga hacia los cantos
              // y el escenario sigue fundiéndose con el fondo, que es como
              // estaba pensado desde el principio.
              className="absolute inset-0 size-full object-cover [mask-image:radial-gradient(75%_78%_at_50%_45%,#000_30%,transparent_100%)]"
            />
          )}
          <div
            aria-hidden
            // Termina en el color de la página antes de llegar a los bordes,
            // para que el escenario no marque un rectángulo.
            // Con clip detrás va en rgba, para que se vea; sin clip, opaco
            // como siempre. Es lo que mantiene legibles los nombres de las
            // esquinas sobre una imagen en movimiento.
            className={
              clip
                ? "absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_42%,rgba(42,33,20,0.5)_0%,rgba(21,20,25,0.72)_40%,rgba(11,11,13,0.92)_78%)]"
                : "absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_42%,#2a2114_0%,#151419_40%,#0b0b0d_78%)]"
            }
          />
          {/* Fogonazo central entre los dos */}
          <div
            aria-hidden
            className="respirar absolute inset-0 bg-[radial-gradient(26%_36%_at_50%_44%,rgba(255,246,216,0.6)_0%,rgba(212,175,55,0.3)_32%,rgba(212,175,55,0)_72%)]"
          />
          {/* Haces de luz que cruzan el fondo */}
          <div
            aria-hidden
            className="absolute left-1/2 top-[44%] h-px w-[170%] -translate-x-1/2 -rotate-[14deg] bg-[linear-gradient(90deg,transparent_26%,rgba(247,227,161,0.5)_50%,transparent_74%)]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[44%] h-px w-[170%] -translate-x-1/2 rotate-[9deg] bg-[linear-gradient(90deg,transparent_26%,rgba(247,227,161,0.35)_50%,transparent_74%)]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[44%] h-px w-[130%] -translate-x-1/2 -rotate-[38deg] bg-[linear-gradient(90deg,transparent_24%,rgba(247,227,161,0.25)_50%,transparent_76%)]"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-[44%] h-px w-[130%] -translate-x-1/2 rotate-[52deg] bg-[linear-gradient(90deg,transparent_24%,rgba(247,227,161,0.2)_50%,transparent_76%)]"
          />
          {/* VS en el corazón del fogonazo, detrás de los peleadores: en móvil
              las dos figuras se pisan en el centro y por delante les taparía
              la cara. */}
          <p
            aria-hidden
            className="texto-oro absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 -skew-x-6 font-display text-[56px] leading-none opacity-90 drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] sm:text-[104px] lg:text-[112px]"
          >
            VS
          </p>
          {/* Fundido superior: sin él, el degradado y los haces llegaban al
              borde de arriba con luz y el escenario se veía cortado. Va por
              encima del fondo y por debajo de las figuras. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 z-[5] h-[32%] bg-[linear-gradient(to_bottom,rgba(11,11,13,1)_0%,rgba(11,11,13,0.6)_45%,transparent_100%)]"
          />

          <Figura peleador={izq} lado="a" />
          <Figura peleador={der} lado="b" />

          {/* Fundido al pie de TODO el escenario, no de cada figura: ahí la
              pisa la parrilla y el corte de los recortes queda camuflado. Si
              cada foto llevara el suyo, su caja se marcaría como un
              rectángulo más oscuro sobre el fondo. Va sobre las figuras y
              debajo de los rótulos. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 z-[15] h-[55%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(11,11,13,0.55)_45%,rgba(11,11,13,0.98)_100%)]"
          />

          <Rotulo peleador={izq} lado="a" />
          <Rotulo peleador={der} lado="b" />

          {/* Botón "Ver ficha" sobre cada figura, solo por debajo de lg: ahí
              las esquinas no tienen sitio para el botón y nada decía que la
              foto lleva a la página del peleador. Va fuera del enlace de la
              foto para quedar por encima del fundido del pie. */}
          {(["a", "b"] as const).map((lado) => {
            const p = lado === "a" ? izq : der;
            return (
              <Link
                key={p.slug}
                href={`/peleadores/${p.slug}`}
                // whitespace-nowrap: posicionado a la derecha, el ancho
                // disponible es solo lo que queda hasta el borde y el texto
                // se partía en dos líneas.
                // min-h-11: es el objetivo táctil principal del escenario.
                className={`cambio-texto absolute bottom-[18%] z-20 flex min-h-11 items-center gap-2 whitespace-nowrap rounded-sm bg-oro px-3.5 py-2 font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-noche shadow-[0_8px_22px_rgba(0,0,0,0.6)] transition-colors hover:bg-oro-claro sm:px-4 lg:hidden ${
                  lado === "a" ? "left-3 sm:left-5" : "right-3 flex-row-reverse sm:right-5"
                }`}
              >
                <span
                  className={`grid size-4 place-items-center rounded-[2px] font-display text-[11px] leading-none text-white ${LADO[lado].fondo}`}
                >
                  {LADO[lado].numero}
                </span>
                Ver ficha
                <svg
                  aria-hidden
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            );
          })}

          {/* Rótulo del combate arriba al centro, solo en escritorio: por
              debajo de lg chocaría con los nombres de las esquinas, así que
              ahí baja debajo de la parrilla. Lleva los nombres solo para el
              lector de pantalla: en la pantalla ya están en cada esquina. */}
          <p
            aria-live="polite"
            className="absolute left-1/2 top-5 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-sm border border-oro-profundo bg-noche/80 px-4 py-2 font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro backdrop-blur-sm lg:block"
          >
            {combate.billing ?? `Combate ${combate.n}`}
            <span className="sr-only">
              : {izq.nombre} contra {der.nombre}
            </span>
            <span className="text-oro-medio"> · </span>3 rounds
          </p>
        </div>

        {/* PARRILLA. Los 16 en dos filas de ocho, chicas a propósito para que
            escenario y parrilla se vean juntos en móvil; ahí no va la casilla
            del azar. Desde sm se abre el "?" en el centro y quedan 4 + ? + 4
            por fila. Los dos del combate elegido llevan borde de color y su
            número. */}
        <div className="relative z-20 -mt-12 px-2 pb-3 sm:-mt-20 sm:px-6 sm:pb-5 lg:pb-6">
          {/* Fichas a los costados de la parrilla, solo en escritorio: cada
              una centrada en el hueco que queda entre el borde y la parrilla
              de 800. */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[calc((100%-800px)/2)] items-center justify-center lg:flex">
            <Ficha peleador={izq} lado="a" className="pointer-events-auto" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[calc((100%-800px)/2)] items-center justify-center lg:flex">
            <Ficha peleador={der} lado="b" className="pointer-events-auto" />
          </div>
          <ul className="mx-auto grid max-w-[880px] grid-cols-8 gap-1.5 sm:grid-cols-9 sm:gap-2.5 lg:max-w-[800px] lg:gap-3">
            {PARRILLA.map((p) => {
              const lado = ladoDe(p.slug);
              const estilo = lado ? LADO[lado] : null;
              return (
                <li key={p.slug} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => setElegido(p.slug)}
                    // Precarga por intención, que es la ÚNICA que hace la
                    // sección: el puntero encima —o el dedo apoyado, que
                    // también dispara `pointerenter`— llega antes que el clic,
                    // y con eso la silueta se va pidiendo mientras el dedo
                    // todavía baja. Así solo se descarga lo que la persona
                    // está a punto de mirar.
                    onPointerEnter={() => precargarFigura(p.cuerpo ?? p.foto)}
                    onFocus={() => precargarFigura(p.cuerpo ?? p.foto)}
                    aria-pressed={lado !== null}
                    aria-label={`${p.nombre}: ver su combate`}
                    title={p.nombre}
                    className={`group relative block aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-[3px] border bg-[#0e0e12] outline-none transition duration-300 ${
                      estilo
                        ? `${estilo.borde} ${estilo.brillo} -translate-y-0.5`
                        : "border-linea opacity-65 hover:-translate-y-0.5 hover:border-oro-profundo hover:opacity-100"
                    }`}
                  >
                    {/* El retrato de cara recortado del arte, el mismo de la
                        tira de peleadores de antes. */}
                    <Image
                      src={p.foto}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 90px, 12vw"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    {estilo && (
                      <span aria-hidden className={`absolute inset-0 ${estilo.tinte}`} />
                    )}
                    {/* El nombre solo desde sm: en móvil la casilla mide
                        menos de 40 px y no hay dónde ponerlo. */}
                    <span className="absolute inset-x-0 bottom-0 hidden truncate bg-gradient-to-t from-noche/95 via-noche/70 to-transparent px-1 pb-1 pt-4 text-center font-cond text-[11px] font-bold uppercase leading-none tracking-[0.04em] text-crema sm:block">
                      {p.nombre}
                    </span>
                    {estilo && (
                      <span
                        className={`absolute left-0 top-0 grid size-4 place-items-center font-display text-[11px] leading-none text-white sm:size-5 sm:text-[12px] ${estilo.fondo}`}
                      >
                        {estilo.numero}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
            {/* Casilla del azar, solo desde sm: se declara al final pero se
                coloca en la columna del medio, ocupando las dos filas. */}
            <li className="hidden sm:col-start-5 sm:row-start-1 sm:row-span-2 sm:block">
              <button
                type="button"
                onClick={alAzar}
                aria-label="Elegir un combate al azar"
                className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[3px] border border-oro-profundo bg-[#0e0e12]/95 outline-none transition duration-300 hover:border-oro hover:bg-oro-tinte"
              >
                <span className="texto-oro font-display text-[44px] leading-none transition-transform duration-300 group-hover:scale-110 lg:text-[56px]">
                  ?
                </span>
                <span className="font-cond text-[11px] font-bold uppercase tracking-[0.2em] text-oro-medio transition-colors group-hover:text-oro">
                  Al azar
                </span>
              </button>
            </li>
          </ul>
          {/* Por debajo de lg no hay costados libres: las fichas van debajo
              de la parrilla, una a cada lado. */}
          {/* Por debajo de lg la ficha va debajo de la parrilla como UNA sola
              tabla comparativa. Dos tarjetas lado a lado no entraban en 360 px
              (se salía la edad del jugador 2) y dejaban un hueco negro en el
              medio; aquí el centro lo ocupa el dato, una sola vez. */}
          <div className="mt-3 sm:mt-4 lg:hidden">
            <FichaComparada izq={izq} der={der} clave={combate.n} />
          </div>
          {/* El mismo rótulo del combate que en escritorio va arriba. */}
          <p
            aria-live="polite"
            className="mx-auto mt-3 w-fit rounded-sm border border-oro-profundo bg-oro-tinte px-3.5 py-1.5 text-center font-cond text-[11px] font-bold uppercase tracking-[0.18em] text-oro lg:hidden"
          >
            {combate.billing ?? `Combate ${combate.n}`}
            <span className="sr-only">
              : {izq.nombre} contra {der.nombre}
            </span>
            <span className="text-oro-medio"> · </span>3 rounds
          </p>
        </div>
      </div>

      {/* Solo la nota del asterisco: la interfaz se explica sola y las
          ayudas de uso sobraban. */}
      <NotaAprox />
    </div>
  );
}
