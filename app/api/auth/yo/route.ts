import { json } from "@/lib/api/servidor";
import type { RespuestaYo } from "@/lib/api/tipos";
import { sesion } from "@/lib/supabase/servidor";

export async function GET() {
  const { usuario } = await sesion();
  return json<RespuestaYo>({ usuario });
}
