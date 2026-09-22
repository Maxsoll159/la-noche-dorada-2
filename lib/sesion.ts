"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { clienteNavegador } from "./supabase/cliente";
import { COOKIE_VOLVER, rutaSegura } from "./volver";

export async function iniciarSesionConGoogle(volverA: string) {
  const ruta = rutaSegura(volverA) ?? "/";
  document.cookie = `${COOKIE_VOLVER}=${encodeURIComponent(ruta)}; path=/; max-age=600; samesite=lax`;
  const { error } = await clienteNavegador().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  return !error;
}

export function useUsuario(activo = true) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [listo, setListo] = useState(!activo);

  useEffect(() => {
    if (!activo) return;
    const { data } = clienteNavegador().auth.onAuthStateChange(
      (_evento, sesion) => {
        setUsuario(sesion?.user ?? null);
        setListo(true);
      },
    );
    return () => data.subscription.unsubscribe();
  }, [activo]);

  return { usuario, listo };
}
