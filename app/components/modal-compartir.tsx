"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EVENTO } from "@/lib/evento";
import { rutaDePronostico } from "@/lib/compartir";

/* ------------------------------------------------------------------ iconos */

type PropsIcono = { className?: string };

function IconoWhatsApp({ className = "size-[22px]" }: PropsIcono) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.04 2C6.6 2 2.18 6.42 2.18 11.86c0 1.74.46 3.44 1.33 4.94L2 22l5.34-1.4a9.9 9.9 0 0 0 4.7 1.19h.01c5.43 0 9.85-4.42 9.85-9.86 0-2.63-1.03-5.11-2.89-6.97A9.78 9.78 0 0 0 12.04 2Zm0 1.82c2.15 0 4.17.84 5.69 2.36a7.98 7.98 0 0 1 2.35 5.68c0 4.44-3.6 8.04-8.05 8.04a8.03 8.03 0 0 1-4.1-1.12l-.3-.18-3.04.8.81-2.96-.19-.3a8 8 0 0 1-1.23-4.28c0-4.43 3.61-8.04 8.06-8.04Zm-2.5 4.02c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.56 4.07 3.59.57.24 1.01.39 1.36.5.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.03.14-1.13-.06-.1-.22-.16-.46-.28-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.77-.19-.46-.38-.4-.53-.41h-.46Z" />
    </svg>
  );
}

function IconoX({ className = "size-[20px]" }: PropsIcono) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.53 3h3.18l-6.95 7.95L22 21h-6.4l-5.01-6.55L4.85 21H1.66l7.43-8.5L2 3h6.56l4.53 5.99L17.53 3Zm-1.12 16.06h1.76L7.67 4.84H5.78l10.63 14.22Z" />
    </svg>
  );
}

function IconoFacebook({ className = "size-[22px]" }: PropsIcono) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
    </svg>
  );
}

function IconoInstagram({ className = "size-[22px]" }: PropsIcono) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconoDescargar() {
  return (
    <svg
      aria-hidden
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M12 3v12m-5-5 5 5 5-5M4 20h16" />
    </svg>
  );
}

function IconoEnlace() {
  return (
    <svg
      aria-hidden
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <path d="M10 13a5 5 0 0 0 7.5.5l2-2A5 5 0 0 0 12.5 4.5l-1 1" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-2 2A5 5 0 0 0 11.5 19.5l1-1" />
    </svg>
  );
}

function IconoCompartir() {
  return (
    <svg
      aria-hidden
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------- modal */

/**
 * Nada de esto abre la app de destino con la imagen ya puesta, porque ninguna
 * red lo permite desde la web: WhatsApp, Facebook y X reciben un ENLACE y son
 * ellos quienes van a buscar la imagen en las etiquetas Open Graph de esa
 * página (de ahí `/pronosticos/[codigo]`, que existe sobre todo para eso).
 * Instagram ni siquiera acepta enlaces para publicar, así que es el único caso
 * donde hace falta el archivo: se comparte con la hoja nativa del móvil si el
 * navegador la tiene, y si no se descarga el PNG para subirlo a mano.
 */
const REDES = [
  { id: "whatsapp", nombre: "WhatsApp", color: "#25D366", Icono: IconoWhatsApp },
  { id: "instagram", nombre: "Instagram", color: "#E1306C", Icono: IconoInstagram },
  { id: "facebook", nombre: "Facebook", color: "#1877F2", Icono: IconoFacebook },
  { id: "x", nombre: "X", color: "#f5eedc", Icono: IconoX },
] as const;

type Red = (typeof REDES)[number]["id"];

export function ModalCompartir({
  codigo,
  texto,
  resumen,
  onCerrar,
}: {
  /** El código de los votos, que es lo que viaja en la URL compartida. */
  codigo: string;
  /** Las líneas de los pronósticos, sin el enlace: se le pega al final. */
  texto: string;
  /** Una línea de contexto para el encabezado del modal. */
  resumen: string;
  onCerrar: () => void;
}) {
  const ruta = rutaDePronostico(codigo);
  const urlImagen = `${ruta}/opengraph-image`;

  const panel = useRef<HTMLDivElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const [enlace, setEnlace] = useState("");
  const [aviso, setAviso] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState<Red | "descarga" | null>(null);
  const [cargandoImagen, setCargandoImagen] = useState(true);
  const [nativo, setNativo] = useState(false);

  // El origen solo se conoce en el navegador, y tiene que salir de ahí y no de
  // `SITIO`: mientras el dominio definitivo no apunte al despliegue (ver
  // README), `SITIO` anuncia lanochedorada.pe y compartiríamos un enlace
  // muerto. `window.location.origin` siempre es el sitio desde el que la
  // persona está votando.
  useEffect(() => {
    // La URL y las capacidades del navegador son sistemas externos que solo se
    // pueden leer ya montados: el mismo caso que contempla la regla en
    // `lib/votacion.ts`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnlace(`${window.location.origin}${ruta}`);
    setNativo(typeof navigator !== "undefined" && !!navigator.share);
  }, [ruta]);

  // Scroll del fondo bloqueado, Esc para cerrar, foco dentro del panel y de
  // vuelta a donde estaba al salir.
  useEffect(() => {
    const previo = document.body.style.overflow;
    const enfocadoAntes = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    cerrar.current?.focus();

    const alTecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCerrar();
        return;
      }
      if (e.key !== "Tab" || !panel.current) return;

      // Trampa de foco: con el fondo inerte, tabular fuera del panel manda el
      // foco a un botón que no se ve y el teclado se queda sin salida.
      const focables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focables.length === 0) return;
      const primero = focables[0];
      const ultimo = focables[focables.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener("keydown", alTecla);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", alTecla);
      enfocadoAntes?.focus();
    };
  }, [onCerrar]);

  // Los avisos ("Enlace copiado") se apagan solos; el temporizador se limpia
  // para que no dispare sobre un componente ya desmontado.
  useEffect(() => {
    if (!aviso) return;
    const id = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(id);
  }, [aviso]);

  const abrirVentana = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=680,height=700");
  }, []);

  /** El PNG que genera `opengraph-image`, ya como archivo. */
  const archivoImagen = useCallback(async () => {
    const res = await fetch(urlImagen);
    if (!res.ok) throw new Error("No se pudo generar la imagen");
    const blob = await res.blob();
    return new File([blob], `pronosticos-noche-dorada-${codigo}.png`, {
      type: "image/png",
    });
  }, [codigo, urlImagen]);

  const descargar = useCallback((archivo: File) => {
    const url = URL.createObjectURL(archivo);
    const a = document.createElement("a");
    a.href = url;
    a.download = archivo.name;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const compartirEn = useCallback(
    async (red: Red) => {
      if (!enlace) return;
      const conEnlace = `${texto}\n${enlace}`;

      if (red === "whatsapp") {
        abrirVentana(`https://wa.me/?text=${encodeURIComponent(conEnlace)}`);
        return;
      }
      if (red === "x") {
        abrirVentana(
          `https://x.com/intent/post?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(enlace)}`,
        );
        return;
      }
      if (red === "facebook") {
        // El sharer de Facebook solo acepta la URL: el texto lo escribe la
        // persona y la imagen sale de las etiquetas Open Graph de la página.
        abrirVentana(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(enlace)}`,
        );
        return;
      }

      // Instagram: no hay forma de publicar desde la web, así que se le pasa
      // el archivo a la hoja nativa del móvil y, en escritorio, se descarga.
      setOcupado("instagram");
      try {
        const archivo = await archivoImagen();
        if (navigator.canShare?.({ files: [archivo] })) {
          await navigator.share({
            files: [archivo],
            title: EVENTO.nombre,
            text: conEnlace,
          });
        } else {
          descargar(archivo);
          setAviso(
            "Imagen descargada. Súbela como publicación o historia en Instagram.",
          );
        }
      } catch (e) {
        // `AbortError` es la persona cerrando la hoja de compartir: no es un
        // fallo y no tiene que dejar un aviso rojo en pantalla.
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setAviso("No pudimos preparar la imagen. Inténtalo de nuevo.");
        }
      } finally {
        setOcupado(null);
      }
    },
    [abrirVentana, archivoImagen, descargar, enlace, texto],
  );

  const soloDescargar = useCallback(async () => {
    setOcupado("descarga");
    try {
      descargar(await archivoImagen());
      setAviso("Imagen descargada.");
    } catch {
      setAviso("No pudimos preparar la imagen. Inténtalo de nuevo.");
    } finally {
      setOcupado(null);
    }
  }, [archivoImagen, descargar]);

  const copiarEnlace = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(enlace);
      setAviso("Enlace copiado.");
    } catch {
      setAviso("No pudimos copiar. Copia el enlace de la barra de abajo.");
    }
  }, [enlace]);

  const compartirNativo = useCallback(async () => {
    try {
      await navigator.share({
        title: EVENTO.nombre,
        text: texto,
        url: enlace,
      });
    } catch {
      /* la persona cerró la hoja de compartir */
    }
  }, [enlace, texto]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-compartir"
    >
      {/* Velo: tocarlo cierra, como en el menú del header */}
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onCerrar}
        className="absolute inset-0 cursor-default bg-noche/80 backdrop-blur-sm"
      />

      {/* Hoja por abajo en móvil, tarjeta centrada desde sm */}
      <div
        ref={panel}
        className="entrada relative max-h-[92dvh] w-full overflow-y-auto rounded-t-lg border border-oro-profundo bg-carbon shadow-[0_-18px_60px_rgba(0,0,0,0.7)] sm:max-w-[520px] sm:rounded-sm sm:shadow-[0_24px_70px_rgba(0,0,0,0.7)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-linea bg-[#08080b] px-5 py-4">
          <div className="min-w-0">
            <p
              id="titulo-compartir"
              className="font-display text-[20px] uppercase leading-tight text-oro-claro"
            >
              Comparte tus pronósticos
            </p>
            <p className="mt-0.5 font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-tenue">
              {resumen}
            </p>
          </div>
          <button
            ref={cerrar}
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-sm border border-linea text-tenue transition-colors hover:border-oro hover:text-oro"
          >
            <svg
              aria-hidden
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="flex flex-col gap-5 px-5 py-5">
          {/* La imagen que se va a ver en el chat, tal cual. Es la misma que
              generan las etiquetas Open Graph del enlace, así que lo que se
              previsualiza aquí es exactamente lo que llega al otro lado. */}
          <figure className="relative overflow-hidden rounded-sm border border-linea bg-noche">
            <div className="relative aspect-[1200/630] w-full">
              <Image
                src={urlImagen}
                alt="Vista previa de la imagen con tus pronósticos"
                fill
                unoptimized
                sizes="(min-width: 640px) 480px, 92vw"
                onLoad={() => setCargandoImagen(false)}
                onError={() => setCargandoImagen(false)}
                className={`object-cover transition-opacity duration-500 ${
                  cargandoImagen ? "opacity-0" : "opacity-100"
                }`}
              />
              {cargandoImagen && (
                <span className="absolute inset-0 flex items-center justify-center font-cond text-[12px] font-bold uppercase tracking-[0.2em] text-oro-medio">
                  Preparando la imagen
                </span>
              )}
            </div>
          </figure>

          <div className="flex flex-col gap-2.5">
            <p className="font-cond text-[11px] font-bold uppercase tracking-[0.22em] text-oro-medio">
              Compartir en
            </p>
            <ul className="grid grid-cols-4 gap-2">
              {REDES.map(({ id, nombre, color, Icono }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => compartirEn(id)}
                    // Instagram es el único que necesita el archivo, así que
                    // es el único que también espera a que la imagen esté
                    // lista. Los otros tres solo mandan el enlace.
                    disabled={
                      !enlace ||
                      ocupado !== null ||
                      (id === "instagram" && cargandoImagen)
                    }
                    className="group flex w-full cursor-pointer flex-col items-center gap-2 rounded-sm border border-linea bg-[#0e0e12] px-1 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-oro hover:bg-oro-tinte disabled:cursor-wait disabled:opacity-50"
                  >
                    <span
                      style={{ color }}
                      className="grid size-10 place-items-center rounded-full border border-linea bg-noche transition-colors group-hover:border-oro-profundo"
                    >
                      <Icono />
                    </span>
                    <span className="font-cond text-[11px] font-bold uppercase tracking-[0.06em] text-crema">
                      {ocupado === id ? "…" : nombre}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {/* Instagram no acepta publicaciones desde la web: se dice antes
                de tocarlo, no después. */}
            <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.1em] text-tenue">
              En Instagram se comparte la imagen: la descargas y la subes.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              {/* Bloqueado mientras la imagen se está generando: descargar
                  dispara la misma petición que la vista previa, así que antes
                  de que esa termine solo conseguiría encolar otra y bajar un
                  archivo a medias. La vista previa es el indicador: en cuanto
                  carga, el botón se suelta. */}
              <button
                type="button"
                onClick={soloDescargar}
                disabled={cargandoImagen || ocupado !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-oro px-4 py-3 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-noche transition-colors hover:bg-oro-claro disabled:cursor-wait disabled:opacity-50"
              >
                <IconoDescargar />
                {cargandoImagen
                  ? "Generando imagen…"
                  : ocupado === "descarga"
                    ? "Preparando…"
                    : "Descargar imagen"}
              </button>
              <button
                type="button"
                onClick={copiarEnlace}
                disabled={!enlace}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-oro-profundo px-4 py-3 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-oro transition-colors hover:border-oro hover:bg-oro-tinte disabled:opacity-50"
              >
                <IconoEnlace />
                Copiar enlace
              </button>
            </div>

            {/* La hoja del sistema: en móvil es la vía a Telegram, Messenger,
                correo o lo que esa persona tenga instalado. */}
            {nativo && (
              <button
                type="button"
                onClick={compartirNativo}
                disabled={!enlace}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-linea px-4 py-2.5 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-tenue transition-colors hover:border-oro-profundo hover:text-oro disabled:opacity-50"
              >
                <IconoCompartir />
                Más opciones
              </button>
            )}
          </div>

          <p
            role="status"
            aria-live="polite"
            className="min-h-[16px] text-center font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-oro"
          >
            {aviso}
          </p>

          <p className="truncate rounded-sm border border-linea bg-[#08080b] px-3 py-2 text-center font-cond text-[12px] font-semibold tracking-[0.04em] text-tenue">
            {enlace || ruta}
          </p>
        </div>
      </div>
    </div>
  );
}
