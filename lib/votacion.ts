"use client";

import { useCallback, useEffect, useId, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { clienteNavegador } from "./supabase/cliente";
import { aMetodo, type Lado, type Metodo } from "./compartir";
import { iniciarSesionConGoogle } from "./sesion";

export type { Lado, Metodo };

export type Conteo = {
  votosA: number;
  votosB: number;
  pctA: number | null;
  cierraEn: string;
  ganador: Lado | null;
  metodo: Metodo | null;
  resuelto: boolean;
  votosMetodo: Record<Metodo, number>;
};

type FilaCombate = {
  numero: string;
  votos_a: number;
  votos_b: number;
  pct_a: number | null;
  cierra_en: string;
  ganador: string | null;
  metodo: string | null;
  metodo_ko: number;
  metodo_kot: number;
  metodo_unanime: number;
  metodo_descalificacion: number;
  metodo_empate: number;
};

const COLUMNAS =
  "numero, votos_a, votos_b, pct_a, cierra_en, ganador, metodo, metodo_ko, metodo_kot, metodo_unanime, metodo_descalificacion, metodo_empate";

const PENDIENTE = "nd2:voto-pendiente";

function aConteo(fila: FilaCombate): Conteo {
  const ganador =
    fila.ganador === "a" || fila.ganador === "b" ? fila.ganador : null;
  const metodo = aMetodo(fila.metodo);
  return {
    votosA: fila.votos_a,
    votosB: fila.votos_b,
    pctA: fila.pct_a,
    cierraEn: fila.cierra_en,
    ganador,
    metodo,
    resuelto: ganador !== null || metodo === "empate",
    votosMetodo: {
      ko: fila.metodo_ko ?? 0,
      kot: fila.metodo_kot ?? 0,
      unanime: fila.metodo_unanime ?? 0,
      descalificacion: fila.metodo_descalificacion ?? 0,
      empate: fila.metodo_empate ?? 0,
    },
  };
}

export function estaAbierto(conteo: Conteo | undefined) {
  return conteo ? new Date(conteo.cierraEn).getTime() > Date.now() : false;
}

export function puntaje(
  conteos: Record<string, Conteo>,
  votos: Record<string, Lado>,
  metodos: Record<string, Metodo> = {},
) {
  let resueltos = 0;
  let aciertos = 0;
  let aciertosMetodo = 0;
  for (const [numero, conteo] of Object.entries(conteos)) {
    if (!conteo.resuelto) continue;
    resueltos += 1;
    if (conteo.ganador && votos[numero] === conteo.ganador) aciertos += 1;
    if (conteo.metodo && votos[numero] && metodos[numero] === conteo.metodo)
      aciertosMetodo += 1;
  }
  return { resueltos, aciertos, aciertosMetodo };
}

export function useConteos(activo: boolean) {
  const idCanal = useId();
  const [conteos, setConteos] = useState<Record<string, Conteo>>({});
  const [cargando, setCargando] = useState(activo);
  const [errorCarga, setErrorCarga] = useState(false);

  useEffect(() => {
    if (!activo) return;
    const supabase = clienteNavegador();
    let vivo = true;

    (async () => {
      const { data, error } = await supabase.from("combates").select(COLUMNAS);
      if (!vivo) return;
      if (error) setErrorCarga(true);
      else
        setConteos(Object.fromEntries(data.map((f) => [f.numero, aConteo(f)])));
      setCargando(false);
    })();

    const canal = supabase
      .channel(`conteo-combates-${idCanal}`)
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
  }, [activo, idCanal]);

  return { conteos, setConteos, cargando, errorCarga };
}

export function useVotacion(activo: boolean) {
  const { conteos, setConteos, cargando, errorCarga } = useConteos(activo);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [votos, setVotos] = useState<Record<string, Lado>>({});
  const [metodos, setMetodos] = useState<Record<string, Metodo>>({});
  const [enviando, setEnviando] = useState<string | null>(null);
  const [enviandoMetodo, setEnviandoMetodo] = useState<string | null>(null);
  const [errorAccion, setError] = useState<string | null>(null);
  const error = errorCarga
    ? "No pudimos cargar los pronósticos. Recarga la página."
    : errorAccion;

  useEffect(() => {
    if (!activo) return;
    const supabase = clienteNavegador();
    const { data } = supabase.auth.onAuthStateChange((_evento, sesion) => {
      setUsuario(sesion?.user ?? null);
      if (!sesion?.user) {
        setVotos({});
        setMetodos({});
      }
    });
    return () => data.subscription.unsubscribe();
  }, [activo]);

  const idUsuario = usuario?.id;
  useEffect(() => {
    if (!activo || !idUsuario) return;
    const supabase = clienteNavegador();
    let vivo = true;

    (async () => {
      const { data, error } = await supabase
        .from("votos")
        .select("combate_numero, lado, metodo");
      if (!vivo || error || !data) return;
      setVotos(
        Object.fromEntries(data.map((v) => [v.combate_numero, v.lado as Lado])),
      );
      const elegidos: Record<string, Metodo> = {};
      for (const v of data) {
        const m = aMetodo(v.metodo);
        if (m) elegidos[v.combate_numero] = m;
      }
      setMetodos(elegidos);
    })();

    return () => {
      vivo = false;
    };
  }, [activo, idUsuario]);

  const entrar = useCallback(async () => {
    const { pathname } = window.location;
    const ok = await iniciarSesionConGoogle(
      pathname === "/" ? "/#pronosticos" : `${pathname}#pronostico`,
    );
    if (!ok) setError("No pudimos abrir el acceso con Google.");
  }, []);

  const salir = useCallback(async () => {
    await clienteNavegador().auth.signOut();
    setVotos({});
    setMetodos({});
  }, []);

  const votar = useCallback(
    async (numero: string, lado: Lado) => {
      setError(null);

      if (!usuario) {
        try {
          sessionStorage.setItem(PENDIENTE, `${numero}:${lado}`);
        } catch {}
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

      if (data) setConteos((prev) => ({ ...prev, [numero]: aConteo(data) }));
      setVotos((prev) => {
        const siguiente = { ...prev };
        if (retira) delete siguiente[numero];
        else siguiente[numero] = lado;
        return siguiente;
      });
      if (retira)
        setMetodos((prev) => {
          const siguiente = { ...prev };
          delete siguiente[numero];
          return siguiente;
        });
    },
    [entrar, setConteos, usuario, votos],
  );

  // Tocar el método ya elegido lo quita. Solo se puede con voto hecho: la
  // fila de `votos` es la que guarda el método.
  const elegirMetodo = useCallback(
    async (numero: string, metodo: Metodo) => {
      if (!usuario || !votos[numero]) return;
      setError(null);
      const nuevo = metodos[numero] === metodo ? null : metodo;
      setEnviandoMetodo(numero);

      const supabase = clienteNavegador();
      const { error } = await supabase
        .from("votos")
        .update({ metodo: nuevo })
        .eq("usuario_id", usuario.id)
        .eq("combate_numero", numero);

      if (error) {
        setEnviandoMetodo(null);
        setError(error.message);
        return;
      }

      const { data: fila } = await supabase
        .from("combates")
        .select(COLUMNAS)
        .eq("numero", numero)
        .single();
      setEnviandoMetodo(null);
      if (fila) setConteos((prev) => ({ ...prev, [numero]: aConteo(fila) }));
      setMetodos((prev) => {
        const siguiente = { ...prev };
        if (nuevo) siguiente[numero] = nuevo;
        else delete siguiente[numero];
        return siguiente;
      });
    },
    [metodos, setConteos, usuario, votos],
  );

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError("No se pudo completar el acceso con Google. Inténtalo de nuevo.");
  }, []);

  useEffect(() => {
    if (!activo || !usuario) return;
    let guardado: string | null = null;
    try {
      guardado = sessionStorage.getItem(PENDIENTE);
      sessionStorage.removeItem(PENDIENTE);
    } catch {}
    if (!guardado) return;

    const [numero, lado] = guardado.split(":");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (numero && (lado === "a" || lado === "b")) votar(numero, lado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activo, usuario]);

  return {
    usuario,
    conteos,
    votos,
    metodos,
    cargando,
    enviando,
    enviandoMetodo,
    error,
    votar,
    elegirMetodo,
    entrar,
    salir,
  };
}
