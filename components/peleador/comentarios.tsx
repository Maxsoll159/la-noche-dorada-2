"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LogoGoogle } from "@/assets/icons";
import { iniciarSesionConGoogle, useUsuario } from "@/lib/sesion";
import { clienteNavegador } from "@/lib/supabase/cliente";

type Comentario = {
  id: number;
  usuario_id: string;
  autor_nombre: string;
  autor_avatar: string | null;
  texto: string;
  creado_en: string;
};

const POR_PAGINA = 20;
const MAXIMO = 500;
const COLUMNAS = "id, usuario_id, autor_nombre, autor_avatar, texto, creado_en";

const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });
const UNIDADES: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

function haceCuanto(iso: string) {
  const segundos = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unidad, tamano] of UNIDADES) {
    if (Math.abs(segundos) >= tamano)
      return relativo.format(Math.round(segundos / tamano), unidad);
  }
  return "ahora";
}

function Avatar({ nombre, url }: { nombre: string; url: string | null }) {
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={40}
        height={40}
        unoptimized
        referrerPolicy="no-referrer"
        className="size-10 shrink-0 rounded-full border border-oro-profundo object-cover"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="grid size-10 shrink-0 place-items-center rounded-full border border-oro-profundo bg-oro-tinte font-display text-[16px] text-oro uppercase"
    >
      {nombre.charAt(0)}
    </span>
  );
}

function ItemComentario({
  comentario,
  propio,
  onEliminar,
}: {
  comentario: Comentario;
  propio: boolean;
  onEliminar: (id: number) => Promise<void>;
}) {
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  return (
    <li className="flex gap-3 border-t border-linea px-4 py-4 first:border-t-0 sm:gap-4 sm:px-6">
      <Avatar nombre={comentario.autor_nombre} url={comentario.autor_avatar} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-cond text-[14px] font-bold tracking-[0.06em] text-crema uppercase">
            {comentario.autor_nombre}
          </span>
          {propio && (
            <span className="rounded-full border border-oro-profundo px-1.5 py-px font-cond text-[9px] font-bold tracking-[0.16em] text-oro uppercase">
              Tú
            </span>
          )}
          <time
            dateTime={comentario.creado_en}
            title={new Date(comentario.creado_en).toLocaleString("es-PE")}
            className="font-cond text-[11px] font-semibold tracking-[0.1em] text-tenue uppercase"
          >
            {haceCuanto(comentario.creado_en)}
          </time>
        </p>
        <p className="mt-1 text-[15px] leading-relaxed break-words whitespace-pre-line text-crema/90">
          {comentario.texto}
        </p>
        {propio && (
          <div className="mt-2 flex items-center gap-3 font-cond text-[11px] font-bold tracking-[0.14em] uppercase">
            {confirmando ? (
              <>
                <span className="text-tenue">¿Eliminar tu comentario?</span>
                <button
                  type="button"
                  disabled={borrando}
                  onClick={async () => {
                    setBorrando(true);
                    await onEliminar(comentario.id);
                    setBorrando(false);
                    setConfirmando(false);
                  }}
                  className="text-[#ffb4b4] transition-colors hover:text-white disabled:cursor-wait disabled:opacity-50"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmando(false)}
                  className="text-tenue transition-colors hover:text-crema"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="text-tenue underline transition-colors hover:text-oro"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

export function Comentarios({
  slug,
  nombre,
}: {
  slug: string;
  nombre: string;
}) {
  const { usuario, listo } = useUsuario();
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [hayMas, setHayMas] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(
    async (desde: number) => {
      const { data, error } = await clienteNavegador()
        .from("comentarios")
        .select(COLUMNAS)
        .eq("peleador", slug)
        .order("creado_en", { ascending: false })
        .range(desde, desde + POR_PAGINA);
      if (error) {
        setError("No pudimos cargar los comentarios.");
        return;
      }
      setHayMas(data.length > POR_PAGINA);
      const pagina = data.slice(0, POR_PAGINA);
      setComentarios((prev) => (desde === 0 ? pagina : [...prev, ...pagina]));
    },
    [slug],
  );

  useEffect(() => {
    let vivo = true;
    (async () => {
      await cargar(0);
      if (vivo) setCargando(false);
    })();
    return () => {
      vivo = false;
    };
  }, [cargar]);

  const enviar = async (e?: FormEvent) => {
    e?.preventDefault();
    const limpio = texto.trim();
    if (!usuario || !limpio || enviando) return;
    setEnviando(true);
    setError(null);
    const { data, error } = await clienteNavegador()
      .from("comentarios")
      .insert({ peleador: slug, texto: limpio })
      .select(COLUMNAS)
      .single();
    setEnviando(false);
    if (error) {
      setError(error.message);
      return;
    }
    setTexto("");
    setComentarios((prev) => [data, ...prev]);
  };

  const eliminar = async (id: number) => {
    const { error } = await clienteNavegador()
      .from("comentarios")
      .delete()
      .eq("id", id);
    if (error) {
      setError("No pudimos eliminar el comentario.");
      return;
    }
    setComentarios((prev) => prev.filter((c) => c.id !== id));
  };

  const restantes = MAXIMO - texto.length;

  return (
    <div className="mx-auto w-full max-w-[780px] overflow-hidden rounded-sm border border-oro-profundo bg-carbon">
      <div className="border-b border-linea bg-[#08080b] px-4 py-4 sm:px-6">
        {!listo ? (
          <p className="font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
            Cargando…
          </p>
        ) : usuario ? (
          <form onSubmit={enviar} className="flex flex-col gap-3">
            <label
              htmlFor={`comentario-${slug}`}
              className="font-cond text-[11px] font-bold tracking-[0.2em] text-oro uppercase"
            >
              ¿Qué opinas de {nombre}?
            </label>
            <textarea
              id={`comentario-${slug}`}
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, MAXIMO))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) enviar();
              }}
              maxLength={MAXIMO}
              rows={3}
              placeholder="Escribe tu comentario…"
              className="w-full resize-y rounded-sm border border-linea bg-noche px-3.5 py-3 text-[15px] leading-relaxed text-crema placeholder:text-humo focus:border-oro focus:outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span
                className={`font-cond text-[11px] font-semibold tracking-[0.12em] uppercase ${
                  restantes < 50 ? "text-oro" : "text-tenue"
                }`}
              >
                {restantes} caracteres
              </span>
              <button
                type="submit"
                disabled={enviando || texto.trim().length === 0}
                className="rounded-sm bg-oro px-6 py-2.5 font-cond text-[13px] font-bold tracking-[0.14em] text-noche uppercase transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:opacity-40"
              >
                {enviando ? "Publicando…" : "Comentar"}
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="font-cond text-[13px] font-semibold tracking-[0.12em] text-tenue uppercase">
              Entra con tu cuenta de Google para comentar
            </p>
            <button
              type="button"
              onClick={() =>
                iniciarSesionConGoogle(
                  `${window.location.pathname}#comentarios`,
                )
              }
              className="flex shrink-0 items-center justify-center gap-2.5 rounded-sm bg-crema px-5 py-2.5 font-cond text-[13px] font-bold tracking-[0.13em] text-noche uppercase transition-colors hover:bg-white"
            >
              <LogoGoogle className="size-[16px] shrink-0" />
              Entrar con Google
            </button>
          </div>
        )}
        {error && (
          <p
            role="status"
            className="mt-3 rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-3 py-2 font-cond text-[12px] font-semibold tracking-[0.1em] text-[#ffb4b4] uppercase"
          >
            {error}
          </p>
        )}
      </div>

      {cargando ? (
        <p className="px-6 py-8 text-center font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
          Cargando comentarios…
        </p>
      ) : comentarios.length === 0 ? (
        <p className="px-6 py-8 text-center font-cond text-[13px] font-semibold tracking-[0.12em] text-tenue uppercase">
          Todavía nadie comentó. ¡Sé el primero!
        </p>
      ) : (
        <>
          <ul aria-label={`Comentarios sobre ${nombre}`}>
            {comentarios.map((c) => (
              <ItemComentario
                key={c.id}
                comentario={c}
                propio={c.usuario_id === usuario?.id}
                onEliminar={eliminar}
              />
            ))}
          </ul>
          {hayMas && (
            <div className="border-t border-linea px-6 py-3 text-center">
              <button
                type="button"
                onClick={() => cargar(comentarios.length)}
                className="font-cond text-[12px] font-bold tracking-[0.16em] text-oro-medio uppercase transition-colors hover:text-oro"
              >
                Ver más comentarios
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
