import "server-only";
import { NextResponse } from "next/server";
import { COMBATES, PELEADORES } from "@/lib/evento";
import { aMetodo, type Lado, type Metodo } from "@/lib/compartir";

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

// Detrás del proxy de Vercel el origen de la petición es interno: la URL
// pública viene en `x-forwarded-host`.
export function basePublica(request: Request) {
  const { origin } = new URL(request.url);
  const reenviado = request.headers.get("x-forwarded-host");
  return process.env.NODE_ENV === "development" || !reenviado
    ? origin
    : `https://${reenviado}`;
}
