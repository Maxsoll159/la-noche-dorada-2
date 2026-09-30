"use client";

import { useSyncExternalStore } from "react";
import { pedir } from "./api/cliente";
import type { RespuestaYo, Usuario } from "./api/tipos";
import { rutaSegura } from "./volver";

export type { Usuario };
export type Proveedor = "google" | "discord";

// Un solo estado de sesión para toda la página: cada componente que lo usa se
// suscribe aquí y `/api/auth/yo` se pide una vez, no una por componente.
type Estado = { usuario: Usuario | null; listo: boolean };

const SIN_CARGAR: Estado = { usuario: null, listo: false };
const INACTIVO: Estado = { usuario: null, listo: true };

let estado: Estado = SIN_CARGAR;
let pedido: Promise<void> | null = null;
const oyentes = new Set<() => void>();

function publicar(nuevo: Estado) {
  estado = nuevo;
  for (const oyente of oyentes) oyente();
}

function cargar() {
  pedido ??= pedir<RespuestaYo>("/api/auth/yo")
    .then(({ usuario }) => publicar({ usuario, listo: true }))
    .catch(() => publicar({ usuario: null, listo: true }));
  return pedido;
}

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  cargar();
  return () => {
    oyentes.delete(oyente);
  };
}

const sinSuscripcion = () => () => {};
const leer = () => estado;
const leerEnServidor = () => SIN_CARGAR;

export function useUsuario(activo = true) {
  const actual = useSyncExternalStore(
    activo ? suscribir : sinSuscripcion,
    leer,
    leerEnServidor,
  );
  return activo ? actual : INACTIVO;
}

// El servidor guarda a dónde volver, pide la URL del proveedor a Supabase y
// redirige. El navegador solo navega.
export function iniciarSesion(proveedor: Proveedor, volverA: string) {
  const volver = rutaSegura(volverA) ?? "/";
  const destino = new URL("/api/auth/entrar", window.location.origin);
  destino.searchParams.set("proveedor", proveedor);
  destino.searchParams.set("volver", volver);
  window.location.assign(destino);
}

// Cuando el servidor responde 401 la cookie ya no sirve: se refleja aquí para
// que la interfaz vuelva al estado sin sesión.
export function marcarSinSesion() {
  if (estado.usuario === null && estado.listo) return;
  publicar({ usuario: null, listo: true });
}

export async function cerrarSesion() {
  marcarSinSesion();
  pedido = Promise.resolve();
  try {
    await pedir<void>("/api/auth/salir", { method: "POST" });
  } catch {}
}
