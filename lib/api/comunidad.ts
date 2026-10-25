import "server-only";
import { nombreOculto } from "./servidor";
import type { PronosticoPublico, Reaccion, Usuario } from "./tipos";
import type { clienteServidor } from "@/lib/supabase/servidor";

// Lo que se lee de `pronosticos_publicados`. El `usuario_id` solo sirve para
// marcar `propio`: nunca sale al navegador.
export const COLUMNAS_PRONOSTICO =
  "id, usuario_id, codigo, descripcion, autor_nombre, autor_avatar, me_gusta, no_me_gusta, comentarios, creado_en, actualizado_en";

export type FilaPronostico = {
  id: number;
  usuario_id: string;
  codigo: string;
  descripcion: string | null;
  autor_nombre: string;
  autor_avatar: string | null;
  me_gusta: number;
  no_me_gusta: number;
  comentarios: number;
  creado_en: string;
  actualizado_en: string;
};

type Cliente = Awaited<ReturnType<typeof clienteServidor>>;

export function aReaccion(valor: unknown): Reaccion | null {
  return valor === "gusta" || valor === "no_gusta" ? valor : null;
}

export function pronosticoPublico(
  fila: FilaPronostico,
  usuario: Usuario | null,
  reaccion: Reaccion | null,
): PronosticoPublico {
  return {
    id: fila.id,
    codigo: fila.codigo,
    descripcion: fila.descripcion,
    autor_nombre: nombreOculto(fila.autor_nombre),
    autor_avatar: fila.autor_avatar,
    meGusta: fila.me_gusta,
    noMeGusta: fila.no_me_gusta,
    comentarios: fila.comentarios,
    creado_en: fila.creado_en,
    actualizado_en: fila.actualizado_en,
    propio: fila.usuario_id === usuario?.id,
    reaccion,
  };
}

// Las reacciones de la persona sobre un grupo de pronósticos. La RLS solo le
// deja ver las suyas, así que basta filtrar por id.
async function reaccionesDe(
  supabase: Cliente,
  usuario: Usuario | null,
  ids: number[],
) {
  const reacciones = new Map<number, Reaccion>();
  if (!usuario || ids.length === 0) return reacciones;

  const { data, error } = await supabase
    .from("pronostico_reacciones")
    .select("pronostico_id, tipo")
    .in("pronostico_id", ids);
  if (error) {
    console.error("comunidad: no se pudieron leer las reacciones", error);
    return reacciones;
  }
  for (const r of data) {
    const tipo = aReaccion(r.tipo);
    if (tipo) reacciones.set(r.pronostico_id, tipo);
  }
  return reacciones;
}

export async function pronosticosPublicos(
  supabase: Cliente,
  filas: FilaPronostico[],
  usuario: Usuario | null,
) {
  const reacciones = await reaccionesDe(
    supabase,
    usuario,
    filas.map((f) => f.id),
  );
  return filas.map((f) =>
    pronosticoPublico(f, usuario, reacciones.get(f.id) ?? null),
  );
}
