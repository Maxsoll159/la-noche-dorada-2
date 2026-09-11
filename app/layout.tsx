import type { Metadata, Viewport } from "next";
import { Anton, Barlow, Barlow_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  "La segunda edición del evento de boxeo entre creadores de contenido más grande del Perú. Ocho combates, dieciséis creadores, una sola noche. Sábado 28 de noviembre en el Coliseo Eduardo Dibós, Lima.";

export const metadata: Metadata = {
  // Base para que las URLs de Open Graph y el canónico salgan absolutas.
  // Cambia NEXT_PUBLIC_SITIO al dominio real antes de publicar.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITIO ?? "https://lanochedorada.pe",
  ),
  // El título es siempre la marca: `default` para la home y `template` para
  // que cualquier ruta futura lo conserve al final.
  title: {
    default: "La Noche Dorada II",
    template: "%s · La Noche Dorada II",
  },
  description: DESCRIPCION,
  applicationName: "La Noche Dorada II",
  authors: [{ name: "Vastion" }],
  creator: "Vastion",
  publisher: "Vastion",
  keywords: [
    "La Noche Dorada",
    "La Noche Dorada II",
    "boxeo creadores de contenido",
    "Coliseo Eduardo Dibós",
    "Cañita",
    "JH de la Cruz",
    "entradas",
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
    title: "La Noche Dorada II",
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: "La Noche Dorada II",
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
      </body>
    </html>
  );
}
