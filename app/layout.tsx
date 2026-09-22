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

// Arranca con el nombre y su variante más buscada ("Noche Dorada 2"): es el
// texto que Google muestra bajo el título y donde más pesa la coincidencia.
const DESCRIPCION =
  "La Noche Dorada II (Noche Dorada 2): la segunda edición del evento de boxeo entre creadores de contenido más grande del Perú. Ocho combates, dieciséis creadores, una sola noche. Sábado 28 de noviembre de 2026 en el Coliseo Eduardo Dibós, Lima. Cartelera, pronósticos y entradas.";

export const metadata: Metadata = {
  // Base para que las URLs de Open Graph y el canónico salgan absolutas.
  // Ver lib/sitio.ts para el orden de prioridad del dominio.
  metadataBase: new URL(SITIO),
  // La home lleva marca más qué es y dónde: así el resultado de búsqueda
  // dice algo aunque quien busca no conozca el evento. Las demás rutas
  // conservan la marca al final con `template`.
  title: {
    default: "La Noche Dorada II · Boxeo entre creadores · Lima, 28 de noviembre",
    template: "%s · La Noche Dorada II",
  },
  description: DESCRIPCION,
  applicationName: "La Noche Dorada II",
  authors: [{ name: "Vastion" }],
  creator: "Vastion",
  publisher: "Vastion",
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
    //"Vastion",
    "Lima",
    "Perú",
  ],
  alternates: { canonical: "/" },
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
  // Las imágenes de openGraph y twitter las toma Next de
  // app/opengraph-image.jpg y app/twitter-image.jpg.
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
        {/* Analítica de Vercel. La subruta `/next` es la del App Router: se
            encarga sola de registrar los cambios de ruta del router cliente.
            En desarrollo no envía nada, solo deja trazas en consola. */}
        <Analytics />
        {/* Core Web Vitals de visitas reales. Mide lo que de verdad sufre el
            usuario, a diferencia de Lighthouse, que es un laboratorio. Aquí
            interesa sobre todo el LCP del hero, que carga el cartel. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
