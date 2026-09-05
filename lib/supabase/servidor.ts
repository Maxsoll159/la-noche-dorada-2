import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./tipos";

/**
 * Cliente de Supabase para Server Components y Route Handlers.
 *
 * Se crea uno por petición: lleva las cookies de quien está pidiendo la
 * página, así que no se puede compartir entre peticiones.
 */
export async function clienteServidor() {
  const galleta = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => galleta.getAll(),
        setAll: (porEscribir) => {
          try {
            for (const { name, value, options } of porEscribir) {
              galleta.set(name, value, options);
            }
          } catch {
            // Un Server Component no puede escribir cookies. No es un problema:
            // el proxy ya refrescó la sesión antes de llegar aquí.
          }
        },
      },
    },
  );
}
