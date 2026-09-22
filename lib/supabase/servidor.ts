import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./tipos";

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
          } catch {}
        },
      },
    },
  );
}
