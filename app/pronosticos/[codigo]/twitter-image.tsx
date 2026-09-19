// X lee `og:image` cuando no hay `twitter:image`, pero solo si el consumidor
// respeta ese respaldo. Declararlo explícitamente cuesta un reexport y quita
// la duda: la tarjeta de X usa exactamente la misma imagen que el resto.
export { default, alt, size, contentType } from "./opengraph-image";

// `revalidate` no se puede reexportar: Next lo lee del código, no del módulo
// ya evaluado, así que tiene que estar escrito aquí tal cual. Mismo valor que
// en `opengraph-image.tsx`; si uno cambia, cambian los dos.
export const revalidate = 604800; // una semana

export function generateStaticParams() {
  return [];
}
