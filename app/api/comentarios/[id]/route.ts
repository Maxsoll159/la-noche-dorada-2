import {
  esOrigenAjeno,
  fallo,
  origenAjeno,
  peticionInvalida,
  sinSesion,
} from "@/lib/api/servidor";
import { sesion } from "@/lib/supabase/servidor";

// Elimina un comentario propio. La RLS ignora en silencio los ajenos: no hay
// forma de borrar el de otra persona aunque se adivine el id.
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (esOrigenAjeno(request)) return origenAjeno();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) return peticionInvalida();

  const { supabase, usuario } = await sesion();
  if (!usuario) return sinSesion();

  const { error } = await supabase.from("comentarios").delete().eq("id", id);
  if (error) {
    console.error("comentarios: no se pudo eliminar", error);
    return fallo("No pudimos eliminar el comentario.", 400);
  }

  return new Response(null, { status: 204 });
}
