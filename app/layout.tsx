import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NOMBRES_ALTERNOS, SITIO } from "@/lib/sitio";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "La Noche Dorada II · Boxeo entre creadores · Lima, 28 de noviembre",
    description: DESCRIPCION,
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
      className={`${anton.variable} ${barlow.variable} ${barlowCondensed.variable} antialiased`}
    >
      <body className="min-h-screen bg-noche text-crema">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
