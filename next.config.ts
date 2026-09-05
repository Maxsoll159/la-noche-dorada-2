import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Miniatura del video de la presentación. Es lo único que se pide a
      // YouTube antes de que el usuario le dé play.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
      // Foto de perfil de quien entra con Google, en la barra de la quiniela.
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
