import { NextResponse } from "next/server";
import { clienteServidor } from "@/lib/supabase/servidor";

/**
 * Vuelta de Google. Supabase manda aquí un `code` de un solo uso; lo cambiamos
 * por la sesión y la dejamos en cookies. A partir de ahí el navegador se
 * refresca solo, así que esta es la única ruta de servidor que necesita la
 * votación.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // Solo rutas propias: un `siguiente` con host ajeno convertiría el callback
  // en un redirector abierto.
  const pedido = searchParams.get("siguiente") ?? "";
  const siguiente =
    pedido.startsWith("/") && !pedido.startsWith("//")
      ? pedido
      : "/#pronosticos";

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
    if (!error) return NextResponse.redirect(`${base}${siguiente}`);
  }

  // Google canceló, el código venció o llegaron sin él: se vuelve a la sección
  // con una marca para que la web explique lo que pasó.
  return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
}
