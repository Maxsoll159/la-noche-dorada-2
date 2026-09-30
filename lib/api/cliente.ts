// Única puerta del navegador hacia el servidor. Todo lo que antes iba directo
// a Supabase pasa por aquí: mismo origen, cookies de sesión y JSON.

export class ErrorApi extends Error {
  status: number;

  constructor(mensaje: string, status: number) {
    super(mensaje);
    this.name = "ErrorApi";
    this.status = status;
  }
}

const GENERICO = "No pudimos completar la acción. Inténtalo de nuevo.";

export async function pedir<T>(
  ruta: string,
  init: Omit<RequestInit, "body"> & { json?: unknown } = {},
): Promise<T> {
  const { json, headers, ...resto } = init;
  const res = await fetch(ruta, {
    ...resto,
    credentials: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(json !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(json !== undefined && { body: JSON.stringify(json) }),
  });

  if (res.status === 204) return undefined as T;

  const datos: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const mensaje =
      datos && typeof datos === "object" && "error" in datos
        ? String((datos as { error: unknown }).error)
        : GENERICO;
    throw new ErrorApi(mensaje, res.status);
  }
  return datos as T;
}

export function mensajeDe(error: unknown) {
  return error instanceof ErrorApi ? error.message : GENERICO;
}
