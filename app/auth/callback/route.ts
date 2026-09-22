import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { COOKIE_VOLVER, rutaSegura } from "@/lib/volver";
import { clienteServidor } from "@/lib/supabase/servidor";

const DESTINO = "/#pronosticos";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const reenviado = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "development" || !reenviado
      ? origin
      : `https://${reenviado}`;

  const galleta = await cookies();
  const guardada = galleta.get(COOKIE_VOLVER)?.value;
  galleta.delete(COOKIE_VOLVER);
  const volver = rutaSegura(guardada ? decodeURIComponent(guardada) : null);

  if (code) {
    const supabase = await clienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${base}${volver ?? DESTINO}`);
  }

  return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
}
