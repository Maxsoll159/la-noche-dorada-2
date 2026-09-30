import {
  fallo,
  json,
  ladoValido,
  leerJson,
  metodoValido,
  numeroDeCombate,
  peticionInvalida,
  sinSesion,
} from "@/lib/api/servidor";
import type { RespuestaConteo, RespuestaVotos } from "@/lib/api/tipos";
import { aMetodo, type Lado, type Metodo } from "@/lib/compartir";
import { COLUMNAS_COMBATE, aConteo } from "@/lib/conteo";
import { PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { sesion } from "@/lib/supabase/servidor";

// Las reglas (un voto por combate, cierre, conteo) las vigila la base con sus
// triggers y RLS. Aquí solo se valida la forma de la petición y se traduce el
// error de la base a un mensaje para la persona.
const cerrado = () => fallo("La votación se habilita en la segunda fase.", 409);

// Los votos propios de la persona con sesión.
export async function GET() {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data, error } = await supabase
    .from("votos")
    .select("combate_numero, lado, metodo");
  if (error) {
    console.error("votos: no se pudieron leer", error);
    return fallo("No pudimos cargar tus pronósticos.", 502);
  }

  const votos: Record<string, Lado> = {};
  const metodos: Record<string, Metodo> = {};
  for (const v of data) {
    const lado = ladoValido(v.lado);
    if (!lado) continue;
    votos[v.combate_numero] = lado;
    const m = aMetodo(v.metodo);
    if (m) metodos[v.combate_numero] = m;
  }
  return json<RespuestaVotos>({ votos, metodos });
}

// Vota o cambia el voto. Devuelve el combate ya recontado.
export async function POST(request: Request) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  const cuerpo = await leerJson(request);
  const combate = numeroDeCombate(cuerpo?.combate);
  const lado = ladoValido(cuerpo?.lado);
  if (!combate || !lado) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data, error } = await supabase.rpc("votar", {
    p_combate: combate,
    p_lado: lado,
  });
  if (error || !data) return fallo(error?.message ?? "No se pudo votar.", 400);

  return json<RespuestaConteo>({ conteo: aConteo(data) });
}

// Retira el voto (y con él, el método).
export async function DELETE(request: Request) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  const cuerpo = await leerJson(request);
  const combate = numeroDeCombate(cuerpo?.combate);
  if (!combate) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data, error } = await supabase.rpc("quitar_voto", {
    p_combate: combate,
  });
  if (error || !data)
    return fallo(error?.message ?? "No se pudo quitar el voto.", 400);

  return json<RespuestaConteo>({ conteo: aConteo(data) });
}

// Elige o quita el método (`metodo: null`). Cuelga del voto: sin voto no hay
// fila que actualizar y la base no cambia nada.
export async function PATCH(request: Request) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  const cuerpo = await leerJson(request);
  const combate = numeroDeCombate(cuerpo?.combate);
  const crudo = cuerpo?.metodo;
  const metodo = crudo === null ? null : metodoValido(crudo);
  if (!combate || (crudo !== null && metodo === null))
    return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { error } = await supabase
    .from("votos")
    .update({ metodo })
    .eq("usuario_id", usuario.id)
    .eq("combate_numero", combate);
  if (error) return fallo(error.message, 400);

  const { data: fila, error: errorFila } = await supabase
    .from("combates")
    .select(COLUMNAS_COMBATE)
    .eq("numero", combate)
    .single();
  if (errorFila || !fila) return fallo("No pudimos releer el combate.", 502);

  return json<RespuestaConteo>({ conteo: aConteo(fila) });
}
