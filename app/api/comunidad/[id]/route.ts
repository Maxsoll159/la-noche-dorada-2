import { COLUMNAS_PRONOSTICO, pronosticosPublicos } from "@/lib/api/comunidad";
import { fallo, idValido, json, peticionInvalida } from "@/lib/api/servidor";
import type { RespuestaPronostico } from "@/lib/api/tipos";
import { sesion } from "@/lib/supabase/servidor";

// Un pronóstico publicado, con `propio` y la reacción de quien lo pide.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = idValido((await params).id);
  if (!id) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  const { data, error } = await supabase
    .from("pronosticos_publicados")
    .select(COLUMNAS_PRONOSTICO)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("comunidad: no se pudo leer el pronóstico", error);
    return fallo("No pudimos cargar el pronóstico.", 502);
  }
  if (!data) return fallo("No encontramos ese pronóstico.", 404);

  const [pronostico] = await pronosticosPublicos(supabase, [data], usuario);
  return json<RespuestaPronostico>({ pronostico });
}
