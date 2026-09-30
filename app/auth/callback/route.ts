import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { basePublica } from "@/lib/api/servidor";
import { COOKIE_VOLVER, rutaSegura } from "@/lib/volver";
import { clienteServidor } from "@/lib/supabase/servidor";

const DESTINO = "/#pronosticos";

export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code");
  const base = basePublica(request);

  const galleta = await cookies();
  const guardada = galleta.get(COOKIE_VOLVER)?.value;
  galleta.delete(COOKIE_VOLVER);
  const volver = rutaSegura(guardada ? decodeURIComponent(guardada) : null);

  if (code) {
    const supabase = await clienteServidor();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      // La sesión que devuelve el canje trae también el token de Google o
      // Discord (`provider_token`). La web no lo usa: se vuelve a guardar la
      // sesión solo con lo nuestro para que la cookie no lo lleve.
      const { access_token, refresh_token } = data.session;
      const { error: errorSesion } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });
      if (!errorSesion)
        return NextResponse.redirect(`${base}${volver ?? DESTINO}`);
      console.error("auth: no se pudo guardar la sesión", errorSesion);
    } else {
      console.error("auth: no se pudo canjear el código", error);
    }
  }

  return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
}
