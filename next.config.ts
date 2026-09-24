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
    qualities: [50, 70, 75],
    imageSizes: [32, 48, 64, 96, 128, 256, 320, 384, 512],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
