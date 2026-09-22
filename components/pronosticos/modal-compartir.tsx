"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  IconoCerrar,
  IconoCompartir,
  IconoDescargar,
  IconoEnlace,
  IconoFacebook,
  IconoInstagram,
  IconoWhatsApp,
  IconoX,
} from "@/assets/icons";
import { EVENTO } from "@/lib/evento";
import { rutaDePronostico } from "@/lib/compartir";

const REDES = [
  {
    id: "whatsapp",
    nombre: "WhatsApp",
    color: "#25D366",
    Icono: IconoWhatsApp,
    size: 22,
  },
  {
    id: "instagram",
    nombre: "Instagram",
    color: "#E1306C",
    Icono: IconoInstagram,
    size: 22,
  },
  {
    id: "facebook",
    nombre: "Facebook",
    color: "#1877F2",
    Icono: IconoFacebook,
    size: 22,
  },
  { id: "x", nombre: "X", color: "#f5eedc", Icono: IconoX, size: 20 },
] as const;

type Red = (typeof REDES)[number]["id"];

export function ModalCompartir({
  codigo,
  texto,
  resumen,
  onCerrar,
}: {
  codigo: string;
  texto: string;
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnlace(`${window.location.origin}${ruta}`);
    setNativo(typeof navigator !== "undefined" && !!navigator.share);
  }, [ruta]);

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

  useEffect(() => {
    if (!aviso) return;
    const id = setTimeout(() => setAviso(null), 4000);
    return () => clearTimeout(id);
  }, [aviso]);

  const abrirVentana = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=680,height=700");
  }, []);

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
        abrirVentana(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(enlace)}`,
        );
        return;
      }

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
    } catch {}
  }, [enlace, texto]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-compartir"
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onCerrar}
        className="absolute inset-0 cursor-default bg-noche/80 backdrop-blur-sm"
      />

      <div
        ref={panel}
        className="relative max-h-[92dvh] w-full entrada overflow-y-auto rounded-t-lg border border-oro-profundo bg-carbon shadow-[0_-18px_60px_rgba(0,0,0,0.7)] sm:max-w-[520px] sm:rounded-sm sm:shadow-[0_24px_70px_rgba(0,0,0,0.7)]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-linea bg-[#08080b] px-5 py-4">
          <div className="min-w-0">
            <p
              id="titulo-compartir"
              className="font-display text-[20px] leading-tight text-oro-claro uppercase"
            >
              Comparte tus pronósticos
            </p>
            <p className="mt-0.5 font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
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
            <IconoCerrar size={16} strokeWidth={2.4} />
          </button>
        </header>

        <div className="flex flex-col gap-5 px-5 py-5">
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
                <span className="absolute inset-0 flex items-center justify-center font-cond text-[12px] font-bold tracking-[0.2em] text-oro-medio uppercase">
                  Preparando la imagen
                </span>
              )}
            </div>
          </figure>

          <div className="flex flex-col gap-2.5">
            <p className="font-cond text-[11px] font-bold tracking-[0.22em] text-oro-medio uppercase">
              Compartir en
            </p>
            <ul className="grid grid-cols-4 gap-2">
              {REDES.map(({ id, nombre, color, Icono, size }) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => compartirEn(id)}
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
                      <Icono size={size} />
                    </span>
                    <span className="font-cond text-[11px] font-bold tracking-[0.06em] text-crema uppercase">
                      {ocupado === id ? "…" : nombre}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="font-cond text-[11px] font-semibold tracking-[0.1em] text-tenue uppercase">
              En Instagram se comparte la imagen: la descargas y la subes.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={soloDescargar}
                disabled={cargandoImagen || ocupado !== null}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-oro px-4 py-3 font-cond text-[12px] font-bold tracking-[0.14em] text-noche uppercase transition-colors hover:bg-oro-claro disabled:cursor-wait disabled:opacity-50"
              >
                <IconoDescargar
                  size={15}
                  strokeWidth={2.2}
                  className="shrink-0"
                />
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
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-oro-profundo px-4 py-3 font-cond text-[12px] font-bold tracking-[0.14em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte disabled:opacity-50"
              >
                <IconoEnlace size={15} strokeWidth={2.2} className="shrink-0" />
                Copiar enlace
              </button>
            </div>

            {nativo && (
              <button
                type="button"
                onClick={compartirNativo}
                disabled={!enlace}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-linea px-4 py-2.5 font-cond text-[12px] font-bold tracking-[0.14em] text-tenue uppercase transition-colors hover:border-oro-profundo hover:text-oro disabled:opacity-50"
              >
                <IconoCompartir
                  size={15}
                  strokeWidth={2.2}
                  className="shrink-0"
                />
                Más opciones
              </button>
            )}
          </div>

          <p
            role="status"
            aria-live="polite"
            className="min-h-[16px] text-center font-cond text-[11px] font-bold tracking-[0.14em] text-oro uppercase"
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
