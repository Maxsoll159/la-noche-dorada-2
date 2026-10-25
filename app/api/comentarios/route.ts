import type { NextRequest } from "next/server";
import {
  esOrigenAjeno,
  fallo,
  idValido,
  json,
  leerJson,
  mensajeDeBase,
  nombreOculto,
  origenAjeno,
  peticionInvalida,
  sinSesion,
  slugDePeleador,
} from "@/lib/api/servidor";
import {
  COMENTARIOS_POR_PAGINA as POR_PAGINA,
  MAX_COMENTARIO as MAXIMO,
  type Comentario,
  type RespuestaComentario,
  type RespuestaComentarios,
} from "@/lib/api/tipos";
import { sesion } from "@/lib/supabase/servidor";

const COLUMNAS = "id, usuario_id, autor_nombre, autor_avatar, texto, creado_en";

type Fila = {
  id: number;
  usuario_id: string;
  autor_nombre: string;
  autor_avatar: string | null;
  texto: string;
  creado_en: string;
};

// Un comentario cuelga de un peleador (`peleador=slug`) o de un pronóstico
// publicado (`pronostico=id`): exactamente uno de los dos.
type Destino = { peleador: string } | { pronostico_id: number };

function destinoDe(
  peleadorCrudo: unknown,
  pronosticoCrudo: unknown,
): Destino | null {
  const peleador = slugDePeleador(peleadorCrudo);
  const pronostico = idValido(pronosticoCrudo);
  if (peleador && !pronostico) return { peleador };
  if (pronostico && !peleador) return { pronostico_id: pronostico };
  return null;
}

// El navegador no recibe el id de otros usuarios: solo si el comentario es
// suyo, que es lo que necesita para mostrar el botón de eliminar.
const publico = (fila: Fila, propioDe: string | undefined): Comentario => ({
  id: fila.id,
  autor_nombre: nombreOculto(fila.autor_nombre),
  autor_avatar: fila.autor_avatar,
  texto: fila.texto,
  creado_en: fila.creado_en,
  propio: fila.usuario_id === propioDe,
});

// Página de comentarios de un peleador, del más nuevo al más viejo.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const destino = destinoDe(
    searchParams.get("peleador"),
    searchParams.get("pronostico"),
  );
  const desde = Number(searchParams.get("desde") ?? "0");
  if (!destino || !Number.isInteger(desde) || desde < 0)
    return peticionInvalida();

  const { supabase, usuario } = await sesion();
  const consulta = supabase
    .from("comentarios")
    .select(COLUMNAS, { count: "exact" });
  const { data, error, count } = await (
    "peleador" in destino
      ? consulta.eq("peleador", destino.peleador)
      : consulta.eq("pronostico_id", destino.pronostico_id)
  )
    .order("creado_en", { ascending: false })
    .range(desde, desde + POR_PAGINA);

  if (error) {
    console.error("comentarios: no se pudieron leer", error);
    return fallo("No pudimos cargar los comentarios.", 502);
  }

  return json<RespuestaComentarios>({
    comentarios: data
      .slice(0, POR_PAGINA)
      .map((fila) => publico(fila, usuario?.id)),
    total: count ?? data.length,
    hayMas: data.length > POR_PAGINA,
  });
}

// Publica un comentario. El trigger de la base pone autor, nombre y foto, y
// rechaza el texto vacío o un segundo comentario antes de 20 segundos.
export async function POST(request: Request) {
  if (esOrigenAjeno(request)) return origenAjeno();
  const cuerpo = await leerJson(request);
  const destino = destinoDe(cuerpo?.peleador, cuerpo?.pronostico);
  const texto =
    typeof cuerpo?.texto === "string"
      ? cuerpo.texto.trim().slice(0, MAXIMO)
      : "";
  if (!destino || !texto) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data, error } = await supabase
    .from("comentarios")
    .insert({ ...destino, texto })
    .select(COLUMNAS)
    .single();
  if (error || !data)
    return fallo(mensajeDeBase(error, "No se pudo publicar."), 400);

  return json<RespuestaComentario>(
    { comentario: publico(data, usuario.id) },
    { status: 201 },
  );
}
