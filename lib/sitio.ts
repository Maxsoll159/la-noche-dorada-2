/**
 * URL pública del sitio, sin barra final. Es la base del canónico, del
 * sitemap, del robots y de las URLs absolutas de Open Graph y JSON-LD.
 *
 * Orden: el dominio fijado a mano (NEXT_PUBLIC_SITIO) manda; si no está, el
 * dominio de producción que Vercel inyecta solo en cada build; y por último el
 * dominio definitivo. Antes el fallback era directamente lanochedorada.pe, y
 * mientras ese dominio no apunte al despliegue, el canónico de la web
 * publicada señalaba a un sitio que no existe: Google descarta páginas así.
 */
export const SITIO = (
  process.env.NEXT_PUBLIC_SITIO ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://lanochedorada.pe")
).replace(/\/$/, "");

/** Nombres con los que la gente busca el evento. Van al JSON-LD y a las keywords. */
export const NOMBRES_ALTERNOS = [
  "La Noche Dorada",
  "La Noche Dorada 2",
  "Noche Dorada 2",
  "Noche Dorada II",
  "lanochedorada",
  "La Noche Dorada Perú",
];
