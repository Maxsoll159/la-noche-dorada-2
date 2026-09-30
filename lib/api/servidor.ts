import "server-only";
import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { COMBATES, PELEADORES } from "@/lib/evento";
import { aMetodo, type Lado, type Metodo } from "@/lib/compartir";
import { DOMINIO, SITIO } from "@/lib/sitio";

export const SIN_CACHE = { "Cache-Control": "no-store" } as const;

export function json<T>(datos: T, init: ResponseInit = {}) {
  return NextResponse.json(datos, {
    ...init,
    headers: { ...SIN_CACHE, ...init.headers },
  });
}

export function fallo(mensaje: string, status: number) {
  return json({ error: mensaje }, { status });
}

export const sinSesion = () => fallo("Tienes que iniciar sesión.", 401);
export const peticionInvalida = () => fallo("No entendimos la petición.", 400);
export const origenAjeno = () => fallo("La petición no viene de la web.", 403);

// Los triggers de la base hablan para la persona ("la votación cerró") con un
// RAISE EXCEPTION, código P0001. Cualquier otro error de Postgres describe el
// esquema (tablas, restricciones) y se queda en el log del servidor.
export function mensajeDeBase(
  error: Pick<PostgrestError, "code" | "message"> | null,
  generico: string,
) {
  if (error && error.code !== "P0001") console.error("supabase:", error);
  return error?.code === "P0001" ? error.message : generico;
}

// Las rutas que cambian algo solo aceptan peticiones que el navegador marca
// como del mismo sitio. La cookie va SameSite=Lax, así que un formulario ajeno
// ya no la llevaría; esto es la segunda cerradura.
export function esOrigenAjeno(request: Request) {
  const sitio = request.headers.get("sec-fetch-site");
  if (sitio && sitio !== "same-origin" && sitio !== "none") return true;
  const origen = request.headers.get("origin");
  if (!origen) return false;
  try {
    const host = new URL(origen).host;
    return host !== new URL(request.url).host && !esHostPropio(host);
  } catch {
    return true;
  }
}

export async function leerJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const cuerpo: unknown = await request.json().catch(() => null);
  return cuerpo && typeof cuerpo === "object" && !Array.isArray(cuerpo)
    ? (cuerpo as Record<string, unknown>)
    : null;
}

export function numeroDeCombate(valor: unknown): string | null {
  return typeof valor === "string" && COMBATES.some((c) => c.n === valor)
    ? valor
    : null;
}

export function ladoValido(valor: unknown): Lado | null {
  return valor === "a" || valor === "b" ? valor : null;
}

export function metodoValido(valor: unknown): Metodo | null {
  return typeof valor === "string" ? aMetodo(valor) : null;
}

export function slugDePeleador(valor: unknown): string | null {
  return typeof valor === "string" && PELEADORES.some((p) => p.slug === valor)
    ? valor
    : null;
}

// Hosts desde los que sirve la web: el dominio y los deploys de Vercel.
const VERCEL_PREVIEW = /^la-noche-dorada-2(-[a-z0-9-]+)?\.vercel\.app$/;

export function esHostPropio(host: string) {
  return (
    host === DOMINIO || host === `www.${DOMINIO}` || VERCEL_PREVIEW.test(host)
  );
}

// Detrás del proxy de Vercel el origen de la petición es interno: la URL
// pública viene en `x-forwarded-host`. Solo se confía en ella si es uno de
// nuestros hosts; si no, se vuelve al dominio fijo y nunca se redirige a un
// host que alguien haya metido en la cabecera.
export function basePublica(request: Request) {
  const { origin } = new URL(request.url);
  if (process.env.NODE_ENV === "development") return origin;
  const reenviado = request.headers.get("x-forwarded-host");
  return reenviado && esHostPropio(reenviado) ? `https://${reenviado}` : SITIO;
}
