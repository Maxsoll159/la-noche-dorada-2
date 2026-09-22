export const SITIO = (
  process.env.NEXT_PUBLIC_SITIO ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://la-noche-dorada-2.vercel.app")
).replace(/\/$/, "");

export const NOMBRES_ALTERNOS = [
  "La Noche Dorada",
  "La Noche Dorada 2",
  "Noche Dorada 2",
  "Noche Dorada II",
  "lanochedorada",
  "La Noche Dorada Perú",
];

export const DESARROLLADOR: { nombre: string; url?: string } = {
  nombre: "Martin Rios Tineo",
  url: "https://portafolio-martin-rios-v2.vercel.app",
};
