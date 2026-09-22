export const COOKIE_VOLVER = "nd2-volver";

export function rutaSegura(ruta: string | null | undefined) {
  return ruta && ruta.startsWith("/") && !ruta.startsWith("//") ? ruta : null;
}
