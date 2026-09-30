import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { basePublica } from "@/lib/api/servidor";
import { clienteServidor } from "@/lib/supabase/servidor";
import { COOKIE_VOLVER, rutaSegura } from "@/lib/volver";

// Arranca el acceso con Google o Discord. Guarda en una cookie a dónde volver
// (la lee /auth/callback), pide a Supabase la URL del proveedor y redirige.
export async function GET(request: NextRequest) {
  const base = basePublica(request);
  const proveedor = request.nextUrl.searchParams.get("proveedor");
  if (proveedor !== "google" && proveedor !== "discord") {
    return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
  }

  const volver = rutaSegura(request.nextUrl.searchParams.get("volver")) ?? "/";
  const galleta = await cookies();
  galleta.set(COOKIE_VOLVER, encodeURIComponent(volver), {
    path: "/",
    maxAge: 600,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: proveedor,
    options: {
      redirectTo: `${base}/auth/callback`,
      // Supabase pide a Discord `prompt=consent`, que muestra la pantalla de
      // autorizar en cada entrada. Con `none` solo sale la primera vez.
      ...(proveedor === "discord" && { queryParams: { prompt: "none" } }),
    },
  });

  if (error || !data.url) {
    console.error("auth: no se pudo iniciar el acceso", error);
    return NextResponse.redirect(`${base}/?error=sesion#pronosticos`);
  }
  return NextResponse.redirect(data.url);
}
