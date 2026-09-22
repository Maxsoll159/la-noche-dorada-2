import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./tipos";

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
