import type { NextRequest } from "next/server";
import {
  fallo,
  json,
  leerJson,
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

// El navegador no recibe el id de otros usuarios: solo si el comentario es
// suyo, que es lo que necesita para mostrar el botón de eliminar.
const publico = (fila: Fila, propioDe: string | undefined): Comentario => ({
  id: fila.id,
  autor_nombre: fila.autor_nombre,
  autor_avatar: fila.autor_avatar,
  texto: fila.texto,
  creado_en: fila.creado_en,
  propio: fila.usuario_id === propioDe,
});

// Página de comentarios de un peleador, del más nuevo al más viejo.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const peleador = slugDePeleador(searchParams.get("peleador"));
  const desde = Number(searchParams.get("desde") ?? "0");
  if (!peleador || !Number.isInteger(desde) || desde < 0)
    return peticionInvalida();

  const { supabase, usuario } = await sesion();
  const { data, error, count } = await supabase
    .from("comentarios")
    .select(COLUMNAS, { count: "exact" })
    .eq("peleador", peleador)
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
  const cuerpo = await leerJson(request);
  const peleador = slugDePeleador(cuerpo?.peleador);
  const texto =
    typeof cuerpo?.texto === "string"
      ? cuerpo.texto.trim().slice(0, MAXIMO)
      : "";
  if (!peleador || !texto) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { data, error } = await supabase
    .from("comentarios")
    .insert({ peleador, texto })
    .select(COLUMNAS)
    .single();
  if (error || !data)
    return fallo(error?.message ?? "No se pudo publicar.", 400);

  return json<RespuestaComentario>(
    { comentario: publico(data, usuario.id) },
    { status: 201 },
  );
}
