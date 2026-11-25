import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";
import { NOMBRES_ALTERNOS, SITIO } from "@/lib/sitio";
import { SCRIPT_CARGA } from "@/lib/carga";
import { PantallaCarga } from "@/components/layout/pantalla-carga";
import { ChatMascota } from "@/components/mascota/chat-mascota";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const barlow = Barlow({
  variable: "--font-barlow",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-cond",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const DESCRIPCION =
  "Boxeo entre creadores de contenido: 8 combates el sábado 28 de noviembre de 2026 en el Coliseo Eduardo Dibós, Lima. Cartelera, pronósticos y entradas.";

// La imagen OG y los íconos viven en `public/` y no como archivos especiales de
// `app/`: Next incrusta esos en el código del servidor (unos 500 KiB
// comprimidos) y el Worker gratis de Cloudflare tiene un tope de 3 MiB.
const IMAGEN_OG = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default:
      "La Noche Dorada II · Boxeo entre creadores · Lima, 28 de noviembre",
    template: "%s · La Noche Dorada II",
  },
  description: DESCRIPCION,
  applicationName: "La Noche Dorada II",
  category: "sports",
  keywords: [
    "La Noche Dorada II",
    ...NOMBRES_ALTERNOS,
    "noche dorada boxeo",
    "la noche dorada 2026",
    "la noche dorada entradas",
    "boxeo creadores de contenido",
    "velada de boxeo Perú",
    "Coliseo Eduardo Dibós",
    "Cañita",
    "JH de la Cruz",
    "Stake",
    "Lima",
    "Perú",
  ],
  alternates: { canonical: "/" },
  verification: {
    google: "3DQ_tEGLL_KxjM45WyB_yLtsaglzKuUemebbI8pGZho",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/",
    siteName: "La Noche Dorada II",
    title: "La Noche Dorada II · Boxeo entre creadores · Lima, 28 de noviembre",
    description: DESCRIPCION,
    images: [IMAGEN_OG],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Noche Dorada II · Boxeo entre creadores · Lima, 28 de noviembre",
    description: DESCRIPCION,
    images: [IMAGEN_OG],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0d",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-PE"
      suppressHydrationWarning
      className={`${anton.variable} ${barlow.variable} ${barlowCondensed.variable} antialiased`}
    >
      <body className="min-h-screen bg-noche text-crema">
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_CARGA }} />
        <PantallaCarga />
        {children}
        <ChatMascota />
      </body>
    </html>
  );
}
