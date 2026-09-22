import { NextResponse } from "next/server";
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

  if (code) {
    const supabase = await clienteServidor();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${base}${DESTINO}`);
  }

  return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
}
