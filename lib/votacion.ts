"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { clienteNavegador } from "./supabase/cliente";

export type Lado = "a" | "b";

/** Lo que la web necesita de un combate para pintar la votación. */
export type Conteo = {
  votosA: number;
  votosB: number;
  /** Porcentaje del peleador A. Nulo mientras no haya ni un voto. */
  pctA: number | null;
  /** Pasada esta hora la base rechaza cualquier voto. */
  cierraEn: string;
};

type FilaCombate = {
  numero: string;
  votos_a: number;
  votos_b: number;
  pct_a: number | null;
  cierra_en: string;
};

const COLUMNAS = "numero, votos_a, votos_b, pct_a, cierra_en";

/**
 * Voto que el visitante quiso emitir sin haber iniciado sesión. Se guarda
 * antes de mandarlo a Google y se emite solo al volver, para que el rodeo del
 * login no le cueste un segundo clic.
 */
const PENDIENTE = "nd2:voto-pendiente";

function aConteo(fila: FilaCombate): Conteo {
  return {
    votosA: fila.votos_a,
    votosB: fila.votos_b,
    pctA: fila.pct_a,
    cierraEn: fila.cierra_en,
  };
}

/** true mientras el combate siga admitiendo votos. */
export function estaAbierto(conteo: Conteo | undefined) {
  return conteo ? new Date(conteo.cierraEn).getTime() > Date.now() : false;
}

/**
 * Toda la votación: sesión de Google, conteos públicos y el voto propio.
 *
 * Los conteos son públicos y llegan aunque nadie haya iniciado sesión: el
 * visitante ve los porcentajes de la comunidad y solo se le pide la cuenta
 * cuando quiere votar. Mientras la pestaña esté abierta, Realtime va
 * empujando los cambios que hacen los demás.
 */
export function useVotacion(activo: boolean) {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [conteos, setConteos] = useState<Record<string, Conteo>>({});
  const [votos, setVotos] = useState<Record<string, Lado>>({});
  const [cargando, setCargando] = useState(activo);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Conteos públicos + suscripción en vivo. No depende de la sesión.
  useEffect(() => {
    if (!activo) return;
    const supabase = clienteNavegador();
    let vivo = true;

    (async () => {
      const { data, error } = await supabase.from("combates").select(COLUMNAS);
      if (!vivo) return;
      if (error) {
        setError("No pudimos cargar los pronósticos. Recarga la página.");
      } else {
        setConteos(
          Object.fromEntries(data.map((f) => [f.numero, aConteo(f)])),
        );
      }
      setCargando(false);
    })();

    const canal = supabase
      .channel("conteo-combates")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "combates" },
        ({ new: fila }) => {
          const f = fila as FilaCombate;
          setConteos((prev) => ({ ...prev, [f.numero]: aConteo(f) }));
        },
      )
      .subscribe();

    return () => {
      vivo = false;
      supabase.removeChannel(canal);
    };
  }, [activo]);

  // Sesión. `onAuthStateChange` avisa también al arrancar con la sesión que ya
  // hubiera en las cookies, así que aquí no hace falta un getUser() aparte.
  useEffect(() => {
    if (!activo) return;
    const supabase = clienteNavegador();
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      // Ojo: dentro de este callback no se llama a supabase. La consulta de
      // los votos va en el efecto de abajo, colgada del id del usuario.
      setUsuario(sesion?.user ?? null);
      // Al cerrar sesión la quiniela deja de ser de nadie: se vacía aquí y no
      // en el efecto de abajo, que solo sabe traer.
      if (!sesion?.user) setVotos({});
    });
    return () => data.subscription.unsubscribe();
  }, [activo]);

  // Los votos propios, cada vez que cambia quién está dentro.
  const idUsuario = usuario?.id;
  useEffect(() => {
    if (!activo || !idUsuario) return;
    const supabase = clienteNavegador();
    let vivo = true;

    (async () => {
      const { data, error } = await supabase
        .from("votos")
        .select("combate_numero, lado");
      if (!vivo || error || !data) return;
      setVotos(
        Object.fromEntries(
          data.map((v) => [v.combate_numero, v.lado as Lado]),
        ),
      );
    })();

    return () => {
      vivo = false;
    };
  }, [activo, idUsuario]);

  const entrar = useCallback(async () => {
    const supabase = clienteNavegador();
    // Sin query params a propósito: Supabase compara esta URL entera contra su
    // lista blanca de Redirect URLs, así que cualquier `?loquesea` obligaría a
    // poner un comodín `/**` en vez de la ruta exacta. Si no casa, no avisa:
    // manda el código al Site URL y el acceso se pierde.
    const vuelta = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: vuelta },
    });
    if (error) setError("No pudimos abrir el acceso con Google.");
  }, []);

  const salir = useCallback(async () => {
    await clienteNavegador().auth.signOut();
    setVotos({});
  }, []);

  /**
   * Vota, cambia el voto o lo retira (volver a pulsar el lado ya elegido lo
   * quita). Sin sesión, guarda la intención y manda a Google.
   */
  const votar = useCallback(
    async (numero: string, lado: Lado) => {
      setError(null);

      if (!usuario) {
        try {
          sessionStorage.setItem(PENDIENTE, `${numero}:${lado}`);
        } catch {
          /* modo privado: se pierde la intención, no el login */
        }
        await entrar();
        return;
      }

      const supabase = clienteNavegador();
      const retira = votos[numero] === lado;
      setEnviando(numero);

      const { data, error } = retira
        ? await supabase.rpc("quitar_voto", { p_combate: numero })
        : await supabase.rpc("votar", { p_combate: numero, p_lado: lado });

      setEnviando(null);

      if (error) {
        setError(error.message);
        return;
      }

      // La función devuelve el combate ya recontado: la barra queda al día sin
      // un segundo viaje y sin inventarnos el número.
      if (data) setConteos((prev) => ({ ...prev, [numero]: aConteo(data) }));
      setVotos((prev) => {
        const siguiente = { ...prev };
        if (retira) delete siguiente[numero];
        else siguiente[numero] = lado;
        return siguiente;
      });
    },
    [entrar, usuario, votos],
  );

  // El callback deja `?error=sesion` en la URL cuando Google no completó el
  // acceso. Se lee una sola vez al montar y se borra de la barra de
  // direcciones, para que el aviso no reaparezca al recargar.
  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get("error") !== "sesion") return;

    parametros.delete("error");
    const busqueda = parametros.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${busqueda ? `?${busqueda}` : ""}${window.location.hash}`,
    );
    // La URL es un sistema externo que solo se puede leer ya montados: es el
    // caso que contempla la regla, aunque aquí se lea una vez en vez de
    // suscribirse a ella.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError("No se pudo completar el acceso con Google. Inténtalo de nuevo.");
  }, []);

  // Al volver de Google se emite el voto que quedó a medias.
  useEffect(() => {
    if (!activo || !usuario) return;
    let guardado: string | null = null;
    try {
      guardado = sessionStorage.getItem(PENDIENTE);
      sessionStorage.removeItem(PENDIENTE);
    } catch {
      /* sin sessionStorage no hay nada pendiente que emitir */
    }
    if (!guardado) return;

    const [numero, lado] = guardado.split(":");
    // Reanudar el voto es justo lo que el usuario pidió antes de irse a
    // Google; que arranque un render de más al volver es lo de menos.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (numero && (lado === "a" || lado === "b")) votar(numero, lado);
    // `votar` cambia en cada render (depende de `votos`); si estuviera en las
    // dependencias, este efecto se repetiría en bucle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, usuario]);

  return {
    usuario,
    conteos,
    votos,
    cargando,
    enviando,
    error,
    votar,
    entrar,
    salir,
  };
}
