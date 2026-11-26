import type { NextConfig } from "next";
import { DOMINIO, DOMINIOS_ANTERIORES } from "./lib/sitio";

const nextConfig: NextConfig = {
  async redirects() {
    return DOMINIOS_ANTERIORES.map((host) => ({
      source: "/:ruta*",
      has: [{ type: "host" as const, value: host }],
      destination: `https://${DOMINIO}/:ruta*`,
      permanent: true,
    }));
  },
  experimental: {
    inlineCss: true,
  },
  images: {
    // Las imágenes de public/ salen ya preparadas como estáticos
    // (scripts/optimizar-imagenes.mjs): /_next/image pasaba por el Worker y
    // era el 44 % de las peticiones. Los anchos deben coincidir con ANCHOS
    // del script.
    loader: "custom",
    loaderFile: "./lib/imagenes/loader.ts",
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
    qualities: [50, 70, 75],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;

// Da acceso a los bindings de Cloudflare (KV, Images…) durante `next dev`.
import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
