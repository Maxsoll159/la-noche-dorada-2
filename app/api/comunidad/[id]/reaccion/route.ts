import { aReaccion } from "@/lib/api/comunidad";
import {
  esOrigenAjeno,
  fallo,
  idValido,
  json,
  leerJson,
  mensajeDeBase,
  origenAjeno,
  peticionInvalida,
  sinSesion,
} from "@/lib/api/servidor";
import type { Reaccion, RespuestaReaccion } from "@/lib/api/tipos";
import { PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { sesion } from "@/lib/supabase/servidor";

type Contexto = { params: Promise<{ id: string }> };

const cerrado = () =>
  fallo("La comunidad se habilita en la segunda fase.", 409);

// Relee los contadores ya actualizados por el trigger.
async function conteo(
  supabase: Awaited<ReturnType<typeof sesion>>["supabase"],
  id: number,
  reaccion: Reaccion | null,
) {
  const { data, error } = await supabase
    .from("pronosticos_publicados")
    .select("me_gusta, no_me_gusta")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return fallo("No pudimos releer el pronóstico.", 502);
  return json<RespuestaReaccion>({
    meGusta: data.me_gusta,
    noMeGusta: data.no_me_gusta,
    reaccion,
  });
}

// Pone la reacción (`{ tipo: "gusta" | "no_gusta" }`). Si ya había una, la
// cambia: la clave primaria es (pronóstico, usuario).
export async function PUT(request: Request, { params }: Contexto) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  if (esOrigenAjeno(request)) return origenAjeno();
  const id = idValido((await params).id);
  const cuerpo = await leerJson(request);
  const tipo = aReaccion(cuerpo?.tipo);
  if (!id || !tipo) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data: existe } = await supabase
    .from("pronosticos_publicados")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (!existe) return fallo("No encontramos ese pronóstico.", 404);

  const { error } = await supabase
    .from("pronostico_reacciones")
    .upsert(
      { pronostico_id: id, usuario_id: usuario.id, tipo },
      { onConflict: "pronostico_id,usuario_id" },
    );
  if (error)
    return fallo(mensajeDeBase(error, "No se pudo guardar tu reacción."), 400);

  return conteo(supabase, id, tipo);
}

// Quita la reacción.
export async function DELETE(request: Request, { params }: Contexto) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  if (esOrigenAjeno(request)) return origenAjeno();
  const id = idValido((await params).id);
  if (!id) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { error } = await supabase
    .from("pronostico_reacciones")
    .delete()
    .eq("pronostico_id", id)
    .eq("usuario_id", usuario.id);
  if (error)
    return fallo(mensajeDeBase(error, "No se pudo quitar tu reacción."), 400);

  return conteo(supabase, id, null);
}
