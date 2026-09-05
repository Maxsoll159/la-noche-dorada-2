import { NextResponse } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";

/** Única sección a la que se vuelve tras entrar: la votación. */
const DESTINO = "/#pronosticos";

/**
 * Vuelta de Google. Supabase manda aquí un `code` de un solo uso; lo cambiamos
 * por la sesión y la dejamos en cookies. A partir de ahí el navegador se
 * refresca solo, así que esta es la única ruta de servidor que necesita la
 * votación.
 *
 * La URL no lleva query params: es la que hay que dar de alta tal cual en
 * Supabase → Authentication → URL Configuration → Redirect URLs.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Detrás de un proxy (Vercel) `origin` es el host interno; el bueno viene en
  // la cabecera. En local no hay proxy y `origin` ya es el correcto.
  const reenviado = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "development" || !reenviado
      ? origin
      : `https://${reenviado}`;

  if (code) {
    const supabase = await clienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${base}${DESTINO}`);
  }

  // Google canceló, el código venció o llegaron sin él: se vuelve a la sección
  // con una marca para que la web explique lo que pasó.
  return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
}
