import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Usuario } from "@/lib/api/tipos";
import type { Database } from "./tipos";

// Las credenciales viven solo en el servidor. Se aceptan los nombres viejos
// con prefijo NEXT_PUBLIC_ para no romper un deploy a medio migrar: como
// ningún archivo del cliente las nombra, Next no las mete en el bundle.
function credenciales() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave =
    process.env.SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !clave) {
    throw new Error(
      "Faltan SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en el entorno.",
    );
  }
  return { url, clave };
}

let publico: ReturnType<typeof createClient<Database>> | undefined;

// Cliente sin sesión: solo llega a lo que la RLS deja ver a un anónimo (el
// cartel y el conteo). Se reutiliza entre peticiones.
export function clientePublico() {
  if (!publico) {
    const { url, clave } = credenciales();
    publico = createClient<Database>(url, clave, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return publico;
}

// Como el navegador ya no lee la sesión, las cookies van HttpOnly: un script
// inyectado no puede robar el token. El nombre es propio para que no delate el
// ref del proyecto (por defecto sería `sb-<ref>-auth-token`).
const COOKIE_SESION = {
  name: "nd2-sesion",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Cliente con la sesión del visitante, leída de las cookies. Solo para route
// handlers: es donde Next deja escribir cookies, y el refresco del token las
// escribe.
export async function clienteServidor() {
  const galleta = await cookies();
  const { url, clave } = credenciales();

  // Las cookies de antes del BFF (`sb-<ref>-auth-token*`) no son HttpOnly y
  // el servidor ya no las lee: se borran en cuanto el navegador vuelve a
  // pasar por aquí para que no sigan viajando ni sean legibles por scripts.
  for (const { name } of galleta.getAll()) {
    if (/^sb-.*-auth-token/.test(name)) {
      try {
        galleta.delete(name);
      } catch {}
    }
  }

  return createServerClient<Database>(url, clave, {
    cookieOptions: COOKIE_SESION,
    cookies: {
      getAll: () => galleta.getAll(),
      setAll: (porEscribir) => {
        try {
          for (const { name, value, options } of porEscribir) {
            galleta.set(name, value, {
              ...options,
              httpOnly: true,
              secure: COOKIE_SESION.secure,
            });
          }
        } catch {}
      },
    },
  });
}

function texto(valor: unknown) {
  return typeof valor === "string" && valor.trim() ? valor.trim() : null;
}

// Verifica el JWT de la cookie (firma incluida) y devuelve lo mínimo que la
// web necesita saber de la persona. Nada de esto se confía sin verificar.
export async function sesion() {
  const supabase = await clienteServidor();
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (!claims) return { supabase, usuario: null as Usuario | null };

  const meta = (claims.user_metadata ?? {}) as Record<string, unknown>;
  const usuario: Usuario = {
    id: claims.sub,
    nombre:
      texto(meta.full_name) ?? texto(meta.name) ?? texto(claims.email) ?? "Tú",
    avatar: texto(meta.avatar_url) ?? texto(meta.picture),
  };
  return { supabase, usuario };
}
