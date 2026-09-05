import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./tipos";

/**
 * Cliente de Supabase para el navegador.
 *
 * Guarda la sesión en cookies (no en localStorage), que es lo que permite que
 * el servidor de Next también la vea. Se memoiza porque cada instancia abre su
 * propio canal de realtime y su propio temporizador de refresco del token.
 */
let cliente: ReturnType<typeof crear> | undefined;

function crear() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export function clienteNavegador() {
  cliente ??= crear();
  return cliente;
}
