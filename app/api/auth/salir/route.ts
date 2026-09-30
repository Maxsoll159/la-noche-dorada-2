import { clienteServidor } from "@/lib/supabase/servidor";

export async function POST() {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  return new Response(null, { status: 204 });
}
