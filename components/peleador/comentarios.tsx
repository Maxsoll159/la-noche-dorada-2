"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { IconoComentario, IconoEnviar, LogoGoogle } from "@/assets/icons";
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

function Avatar({
  nombre,
  url,
  grande = false,
}: {
  nombre: string;
  url: string | null | undefined;
  grande?: boolean;
}) {
  const tamano = grande ? "size-12" : "size-11";
  if (url) {
    return (
      <Image
        src={url}
        alt=""
        width={48}
        height={48}
        unoptimized
        referrerPolicy="no-referrer"
        className={`${tamano} shrink-0 rounded-full object-cover ring-2 ring-oro-profundo ring-offset-2 ring-offset-carbon`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${tamano} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-oro-claro to-oro-profundo font-display text-[18px] text-noche uppercase ring-2 ring-oro-profundo ring-offset-2 ring-offset-carbon`}
    >
      {nombre.charAt(0)}
    </span>
  );
}

function TarjetaComentario({
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
    <li
      className={`relative flex cambio gap-3.5 overflow-hidden rounded-sm border p-4 transition-colors duration-300 sm:gap-4 sm:p-5 ${
        propio
          ? "border-oro-profundo bg-oro-tinte/60"
          : "border-linea bg-carbon hover:border-oro-profundo/60"
      }`}
    >
      {propio && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-oro-claro via-oro to-oro-profundo"
        />
      )}
      <Avatar nombre={comentario.autor_nombre} url={comentario.autor_avatar} />
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-cond text-[15px] font-bold tracking-[0.04em] text-crema">
            {comentario.autor_nombre}
          </span>
          {propio && (
            <span className="rounded-full bg-oro px-2 py-0.5 font-cond text-[9px] leading-none font-bold tracking-[0.16em] text-noche uppercase">
              Tú
            </span>
          )}
          <span aria-hidden className="size-1 rounded-full bg-humo" />
          <time
            dateTime={comentario.creado_en}
            title={new Date(comentario.creado_en).toLocaleString("es-PE")}
            className="font-cond text-[12px] font-semibold tracking-[0.06em] text-tenue"
          >
            {haceCuanto(comentario.creado_en)}
          </time>
        </p>
        <p className="mt-1.5 text-[15px] leading-relaxed break-words whitespace-pre-line text-crema/90 sm:text-[16px]">
          {comentario.texto}
        </p>
        {propio && (
          <div className="mt-3 flex items-center gap-3 font-cond text-[11px] font-bold tracking-[0.14em] uppercase">
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
                  className="rounded-sm border border-[#7a2b2b] px-2.5 py-1 text-[#ffb4b4] transition-colors hover:bg-[#7a2b2b] hover:text-white disabled:cursor-wait disabled:opacity-50"
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
                className="text-tenue transition-colors hover:text-oro"
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

function Esqueleto() {
  return (
    <ul aria-hidden className="flex flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <li
          key={i}
          className="flex animate-pulse gap-4 rounded-sm border border-linea bg-carbon p-5"
        >
          <span className="size-11 shrink-0 rounded-full bg-linea" />
          <span className="flex flex-1 flex-col gap-2.5 pt-1">
            <span className="h-3 w-1/3 rounded-full bg-linea" />
            <span className="h-3 w-full rounded-full bg-linea/70" />
            <span className="h-3 w-2/3 rounded-full bg-linea/70" />
          </span>
        </li>
      ))}
    </ul>
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
  const [total, setTotal] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [hayMas, setHayMas] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(
    async (desde: number) => {
      const { data, error, count } = await clienteNavegador()
        .from("comentarios")
        .select(COLUMNAS, { count: "exact" })
        .eq("peleador", slug)
        .order("creado_en", { ascending: false })
        .range(desde, desde + POR_PAGINA);
      if (error) {
        setError("No pudimos cargar los comentarios.");
        return;
      }
      if (count !== null) setTotal(count);
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
    setTotal((t) => (t ?? 0) + 1);
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
    setTotal((t) => Math.max((t ?? 1) - 1, 0));
  };

  const usados = texto.length;
  const avatarPropio = usuario?.user_metadata?.avatar_url as string | undefined;
  const nombrePropio =
    (usuario?.user_metadata?.full_name as string | undefined) ?? "Tú";

  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-linea pb-4">
        <p className="flex items-center gap-2.5 font-display text-[20px] tracking-wide text-crema uppercase sm:text-[22px]">
          <span className="text-oro">
            <IconoComentario size={22} />
          </span>
          {total === null
            ? "Comentarios"
            : `${total} ${total === 1 ? "comentario" : "comentarios"}`}
        </p>
        <p className="font-cond text-[11px] font-semibold tracking-[0.14em] text-tenue uppercase">
          Opina con respeto · Sin insultos ni spam
        </p>
      </div>

      <div className="relative overflow-hidden rounded-sm border border-oro-profundo bg-[linear-gradient(135deg,var(--color-oro-tinte)_0%,var(--color-carbon)_60%)] p-4 transition-shadow duration-300 focus-within:border-oro focus-within:shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_12px_40px_-12px_rgba(212,175,55,0.35)] sm:p-5">
        {!listo ? (
          <div className="h-[92px] animate-pulse rounded-sm bg-linea/40" />
        ) : usuario ? (
          <form onSubmit={enviar} className="flex gap-3.5 sm:gap-4">
            <span className="hidden sm:block">
              <Avatar nombre={nombrePropio} url={avatarPropio} grande />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <label htmlFor={`comentario-${slug}`} className="sr-only">
                Tu comentario sobre {nombre}
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
                placeholder={`¿Qué opinas de ${nombre}?`}
                className="field-sizing-content min-h-[84px] w-full resize-none rounded-sm border border-linea bg-noche/70 px-4 py-3 text-[15px] leading-relaxed text-crema placeholder:text-humo focus:border-oro-profundo focus:outline-none sm:text-[16px]"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    aria-hidden
                    className="h-1 w-24 overflow-hidden rounded-full bg-linea sm:w-32"
                  >
                    <span
                      style={{ width: `${(usados / MAXIMO) * 100}%` }}
                      className={`block h-full rounded-full transition-[width] duration-200 ${
                        usados > MAXIMO - 50
                          ? "bg-oro-claro"
                          : "bg-oro-profundo"
                      }`}
                    />
                  </span>
                  <span
                    className={`font-cond text-[11px] font-semibold tracking-[0.1em] tabular-nums ${
                      usados > MAXIMO - 50 ? "text-oro" : "text-tenue"
                    }`}
                  >
                    {usados}/{MAXIMO}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={enviando || texto.trim().length === 0}
                  className="group flex shrink-0 items-center gap-2 rounded-sm bg-oro px-5 py-2.5 font-cond text-[13px] font-bold tracking-[0.14em] text-noche uppercase shadow-[0_8px_22px_-8px_rgba(212,175,55,0.6)] transition-colors hover:bg-oro-claro disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                  {enviando ? "Publicando…" : "Publicar"}
                  <IconoEnviar
                    size={15}
                    strokeWidth={2.2}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-4 py-2 text-center sm:flex-row sm:text-left">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-oro-profundo bg-noche/60 text-oro">
              <IconoComentario size={22} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[18px] leading-tight tracking-wide text-crema uppercase">
                Únete a la conversación
              </p>
              <p className="mt-1 font-cond text-[12px] font-semibold tracking-[0.12em] text-tenue uppercase">
                Entra con Google para comentar sobre {nombre}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                iniciarSesionConGoogle(
                  `${window.location.pathname}#comentarios`,
                )
              }
              className="flex shrink-0 items-center justify-center gap-2.5 rounded-sm bg-crema px-5 py-3 font-cond text-[13px] font-bold tracking-[0.13em] text-noche uppercase transition-colors hover:bg-white"
            >
              <LogoGoogle className="size-[17px] shrink-0" />
              Entrar con Google
            </button>
          </div>
        )}
      </div>

      {error && (
        <p
          role="status"
          className="rounded-sm border border-[#7a2b2b] bg-[#1c0d0d] px-4 py-2.5 font-cond text-[12px] font-semibold tracking-[0.1em] text-[#ffb4b4] uppercase"
        >
          {error}
        </p>
      )}

      {cargando ? (
        <Esqueleto />
      ) : comentarios.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-oro-profundo/60 px-6 py-10 text-center">
          <span className="text-oro-profundo">
            <IconoComentario size={36} strokeWidth={1.5} />
          </span>
          <p className="font-display text-[20px] tracking-wide text-crema uppercase">
            Todavía no hay comentarios
          </p>
          <p className="font-cond text-[12px] font-semibold tracking-[0.14em] text-tenue uppercase">
            Sé el primero en opinar sobre {nombre}
          </p>
        </div>
      ) : (
        <>
          <ul
            aria-label={`Comentarios sobre ${nombre}`}
            className="flex flex-col gap-3"
          >
            {comentarios.map((c) => (
              <TarjetaComentario
                key={c.id}
                comentario={c}
                propio={c.usuario_id === usuario?.id}
                onEliminar={eliminar}
              />
            ))}
          </ul>
          {hayMas && (
            <button
              type="button"
              onClick={() => cargar(comentarios.length)}
              className="mx-auto rounded-sm border border-oro-profundo px-6 py-2.5 font-cond text-[12px] font-bold tracking-[0.16em] text-oro uppercase transition-colors hover:border-oro hover:bg-oro-tinte"
            >
              Ver más comentarios
            </button>
          )}
        </>
      )}
    </div>
  );
}
