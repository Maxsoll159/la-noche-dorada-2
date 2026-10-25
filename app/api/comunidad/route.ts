import type { NextRequest } from "next/server";
import {
  COLUMNAS_PRONOSTICO,
  pronosticoPublico,
  pronosticosPublicos,
} from "@/lib/api/comunidad";
import {
  esOrigenAjeno,
  fallo,
  json,
  leerJson,
  mensajeDeBase,
  origenAjeno,
  peticionInvalida,
  sinSesion,
  votosDeFilas,
} from "@/lib/api/servidor";
import {
  COMUNIDAD_POR_PAGINA as POR_PAGINA,
  MAX_DESCRIPCION,
  ORDENES_COMUNIDAD,
  type OrdenComunidad,
  type RespuestaComunidad,
  type RespuestaPronostico,
} from "@/lib/api/tipos";
import { codigoDeVotos } from "@/lib/compartir";
import { PRONOSTICOS_ACTIVOS } from "@/lib/evento";
import { sesion } from "@/lib/supabase/servidor";

const cerrado = () =>
  fallo("La comunidad se habilita en la segunda fase.", 409);

function ordenValido(valor: string | null): OrdenComunidad | null {
  if (valor === null) return "recientes";
  return (ORDENES_COMUNIDAD as readonly string[]).includes(valor)
    ? (valor as OrdenComunidad)
    : null;
}

// Página del feed. Es pública; con sesión marca los propios y la reacción.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const orden = ordenValido(searchParams.get("orden"));
  const desde = Number(searchParams.get("desde") ?? "0");
  if (!orden || !Number.isInteger(desde) || desde < 0)
    return peticionInvalida();

  const { supabase, usuario } = await sesion();
  let consulta = supabase
    .from("pronosticos_publicados")
    .select(COLUMNAS_PRONOSTICO, { count: "exact" });
  if (orden === "populares")
    consulta = consulta.order("me_gusta", { ascending: false });
  if (orden === "comentados")
    consulta = consulta.order("comentarios", { ascending: false });

  const { data, error, count } = await consulta
    .order("actualizado_en", { ascending: false })
    .range(desde, desde + POR_PAGINA);

  if (error) {
    console.error("comunidad: no se pudo leer el feed", error);
    return fallo("No pudimos cargar la comunidad.", 502);
  }

  return json<RespuestaComunidad>({
    pronosticos: await pronosticosPublicos(
      supabase,
      data.slice(0, POR_PAGINA),
      usuario,
    ),
    total: count ?? data.length,
    hayMas: data.length > POR_PAGINA,
  });
}

// Publica o actualiza el pronóstico propio. El código no viene del navegador:
// se arma aquí con los votos reales de la persona.
export async function POST(request: Request) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  if (esOrigenAjeno(request)) return origenAjeno();
  const cuerpo = await leerJson(request);
  const crudo = cuerpo?.descripcion;
  if (crudo !== undefined && crudo !== null && typeof crudo !== "string")
    return peticionInvalida();
  const descripcion =
    typeof crudo === "string"
      ? crudo.trim().slice(0, MAX_DESCRIPCION) || null
      : null;

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data: filas, error: errorVotos } = await supabase
    .from("votos")
    .select("combate_numero, lado, metodo");
  if (errorVotos) {
    console.error("comunidad: no se pudieron leer los votos", errorVotos);
    return fallo("No pudimos leer tus pronósticos.", 502);
  }

  const { votos, metodos } = votosDeFilas(filas);
  if (Object.keys(votos).length === 0)
    return fallo("Vota al menos un combate antes de publicar.", 409);

  const { data, error } = await supabase
    .from("pronosticos_publicados")
    .upsert(
      {
        usuario_id: usuario.id,
        codigo: codigoDeVotos(votos, metodos),
        descripcion,
      },
      { onConflict: "usuario_id" },
    )
    .select(COLUMNAS_PRONOSTICO)
    .single();
  if (error || !data)
    return fallo(mensajeDeBase(error, "No se pudo publicar."), 400);

  return json<RespuestaPronostico>({
    pronostico: pronosticoPublico(data, usuario, null),
  });
}

// Quita la publicación propia. Sus comentarios y reacciones caen en cascada.
export async function DELETE(request: Request) {
  if (!PRONOSTICOS_ACTIVOS) return cerrado();
  if (esOrigenAjeno(request)) return origenAjeno();
  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { error } = await supabase
    .from("pronosticos_publicados")
    .delete()
    .eq("usuario_id", usuario.id);
  if (error) {
    console.error("comunidad: no se pudo quitar la publicación", error);
    return fallo("No pudimos quitar tu publicación.", 400);
  }
  return new Response(null, { status: 204 });
}
