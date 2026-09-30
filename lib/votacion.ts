"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { ErrorApi, mensajeDe, pedir } from "./api/cliente";
import type {
  RespuestaConteo,
  RespuestaConteos,
  RespuestaVotos,
} from "./api/tipos";
import {
  estaAbierto,
  puntaje,
  type Conteo,
  type Lado,
  type Metodo,
} from "./conteo";
import {
  cerrarSesion,
  iniciarSesion,
  marcarSinSesion,
  useUsuario,
  type Proveedor,
} from "./sesion";

export { estaAbierto, puntaje };
export type { Conteo, Lado, Metodo };

const PENDIENTE = "nd2:voto-pendiente";

// Los conteos ya no llegan por Realtime (el navegador no habla con Supabase):
// se piden al BFF cada tanto mientras la pestaña está visible. El estado es
// uno para toda la página, así el ranking y las tarjetas se mueven a la vez y
// un voto propio se refleja en todos sin esperar al siguiente sondeo.
const INTERVALO_MS = 15_000;

type EstadoConteos = {
  conteos: Record<string, Conteo>;
  cargando: boolean;
  errorCarga: boolean;
};

const SIN_CARGAR: EstadoConteos = {
  conteos: {},
  cargando: true,
  errorCarga: false,
};
const INACTIVO: EstadoConteos = {
  conteos: {},
  cargando: false,
  errorCarga: false,
};

let estado: EstadoConteos = SIN_CARGAR;
let pidiendo: Promise<void> | null = null;
let temporizador: ReturnType<typeof setTimeout> | undefined;
let suscritos = 0;
const oyentes = new Set<() => void>();

function publicar(parcial: Partial<EstadoConteos>) {
  estado = { ...estado, ...parcial };
  for (const oyente of oyentes) oyente();
}

function pedirConteos() {
  pidiendo ??= pedir<RespuestaConteos>("/api/combates")
    .then(({ conteos }) =>
      publicar({ conteos, cargando: false, errorCarga: false }),
    )
    .catch(() =>
      publicar({
        cargando: false,
        // Si ya hay conteos en pantalla, un sondeo fallido no los borra.
        errorCarga: Object.keys(estado.conteos).length === 0,
      }),
    )
    .finally(() => {
      pidiendo = null;
    });
  return pidiendo;
}

function programar() {
  clearTimeout(temporizador);
  temporizador = setTimeout(async () => {
    if (suscritos === 0) return;
    if (document.visibilityState === "visible") await pedirConteos();
    programar();
  }, INTERVALO_MS);
}

function alVolverALaPestana() {
  if (document.visibilityState === "visible") pedirConteos();
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  if (suscritos++ === 0) {
    pedirConteos();
    programar();
    document.addEventListener("visibilitychange", alVolverALaPestana);
  }
  return () => {
    oyentes.delete(oyente);
    if (--suscritos === 0) {
      clearTimeout(temporizador);
      document.removeEventListener("visibilitychange", alVolverALaPestana);
    }
  };
}

const sinSuscripcion = () => () => {};
const leer = () => estado;
const leerEnServidor = () => SIN_CARGAR;

export function actualizarConteo(numero: string, conteo: Conteo) {
  publicar({ conteos: { ...estado.conteos, [numero]: conteo } });
}

export function useConteos(activo: boolean) {
  const actual = useSyncExternalStore(
    activo ? suscribir : sinSuscripcion,
    leer,
    leerEnServidor,
  );
  return activo ? actual : INACTIVO;
}

export function useVotacion(activo: boolean) {
  const { conteos, cargando, errorCarga } = useConteos(activo);
  const { usuario } = useUsuario(activo);
  const [votos, setVotos] = useState<Record<string, Lado>>({});
  const [metodos, setMetodos] = useState<Record<string, Metodo>>({});
  const [enviando, setEnviando] = useState<string | null>(null);
  const [enviandoMetodo, setEnviandoMetodo] = useState<string | null>(null);
  const [errorAccion, setError] = useState<string | null>(null);
  const error = errorCarga
    ? "No pudimos cargar los pronósticos. Recarga la página."
    : errorAccion;

  const idUsuario = usuario?.id;
  useEffect(() => {
    if (!activo || !idUsuario) return;
    let vivo = true;

    pedir<RespuestaVotos>("/api/votos")
      .then((r) => {
        if (!vivo) return;
        setVotos(r.votos);
        setMetodos(r.metodos);
      })
      .catch((e) => {
        if (e instanceof ErrorApi && e.status === 401) marcarSinSesion();
      });

    return () => {
      vivo = false;
    };
  }, [activo, idUsuario]);

  const fallo = useCallback((e: unknown) => {
    if (e instanceof ErrorApi && e.status === 401) {
      marcarSinSesion();
      setError("Tu sesión expiró. Vuelve a entrar para votar.");
      return;
    }
    setError(mensajeDe(e));
  }, []);

  // Tocar un lado sin sesión entra directo con Google; Discord se elige desde
  // su botón.
  const entrar = useCallback((proveedor: Proveedor = "google") => {
    const { pathname } = window.location;
    iniciarSesion(
      proveedor,
      pathname === "/" ? "/#pronosticos" : `${pathname}#pronostico`,
    );
  }, []);

  const salir = useCallback(async () => {
    setVotos({});
    setMetodos({});
    await cerrarSesion();
  }, []);

  const votar = useCallback(
    async (numero: string, lado: Lado) => {
      setError(null);

      if (!usuario) {
        try {
          sessionStorage.setItem(PENDIENTE, `${numero}:${lado}`);
        } catch {}
        entrar();
        return;
      }

      const retira = votos[numero] === lado;
      setEnviando(numero);
      try {
        const { conteo } = await pedir<RespuestaConteo>(
          "/api/votos",
          retira
            ? { method: "DELETE", json: { combate: numero } }
            : { method: "POST", json: { combate: numero, lado } },
        );
        actualizarConteo(numero, conteo);
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
      } catch (e) {
        fallo(e);
      } finally {
        setEnviando(null);
      }
    },
    [entrar, fallo, usuario, votos],
  );

  // Tocar el método ya elegido lo quita. Solo se puede con voto hecho: la
  // fila de `votos` es la que guarda el método.
  const elegirMetodo = useCallback(
    async (numero: string, metodo: Metodo) => {
      if (!usuario || !votos[numero]) return;
      setError(null);
      const nuevo = metodos[numero] === metodo ? null : metodo;
      setEnviandoMetodo(numero);

      try {
        const { conteo } = await pedir<RespuestaConteo>("/api/votos", {
          method: "PATCH",
          json: { combate: numero, metodo: nuevo },
        });
        actualizarConteo(numero, conteo);
        setMetodos((prev) => {
          const siguiente = { ...prev };
          if (nuevo) siguiente[numero] = nuevo;
          else delete siguiente[numero];
          return siguiente;
        });
      } catch (e) {
        fallo(e);
      } finally {
        setEnviandoMetodo(null);
      }
    },
    [fallo, metodos, usuario, votos],
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
    setError("No se pudo completar el inicio de sesión. Inténtalo de nuevo.");
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
