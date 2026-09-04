import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Miniatura del video de la presentación. Es lo único que se pide a
    // YouTube antes de que el usuario le dé play.
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
