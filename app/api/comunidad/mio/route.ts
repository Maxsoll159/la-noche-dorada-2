import { COLUMNAS_PRONOSTICO, pronosticoPublico } from "@/lib/api/comunidad";
import { fallo, json, sinSesion } from "@/lib/api/servidor";
import type { RespuestaPronostico } from "@/lib/api/tipos";
import { sesion } from "@/lib/supabase/servidor";

// La publicación de la persona con sesión, o null si todavía no publicó.
export async function GET() {
  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data, error } = await supabase
    .from("pronosticos_publicados")
    .select(COLUMNAS_PRONOSTICO)
    .eq("usuario_id", usuario.id)
    .maybeSingle();
  if (error) {
    console.error("comunidad: no se pudo leer la publicación propia", error);
    return fallo("No pudimos leer tu publicación.", 502);
  }

  return json<RespuestaPronostico>({
    pronostico: data ? pronosticoPublico(data, usuario, null) : null,
  });
}
