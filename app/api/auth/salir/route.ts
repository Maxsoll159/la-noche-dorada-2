import { esOrigenAjeno, origenAjeno } from "@/lib/api/servidor";
import { clienteServidor } from "@/lib/supabase/servidor";

export async function POST(request: Request) {
  if (esOrigenAjeno(request)) return origenAjeno();
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  return new Response(null, { status: 204 });
}
