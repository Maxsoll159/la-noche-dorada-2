import { fallo, json } from "@/lib/api/servidor";
import type { RespuestaConteos } from "@/lib/api/tipos";
import { COLUMNAS_COMBATE, aConteo } from "@/lib/conteo";
import { PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { clientePublico } from "@/lib/supabase/servidor";

// Conteo público de los ocho combates. No pide sesión: es lo mismo que ve
// cualquier visitante.
export async function GET() {
  if (!PRONOSTICOS_ACTIVOS) return json<RespuestaConteos>({ conteos: {} });

  const { data, error } = await clientePublico()
    .from("combates")
    .select(COLUMNAS_COMBATE);

  if (error) {
    console.error("combates: no se pudo leer el conteo", error);
    return fallo("No pudimos leer la votación.", 502);
  }

  return json<RespuestaConteos>({
    conteos: Object.fromEntries(data.map((f) => [f.numero, aConteo(f)])),
  });
}
