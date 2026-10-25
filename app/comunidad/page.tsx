import type { Metadata } from "next";
import { COMBATES, EVENTO } from "@/lib/evento";
import { FeedComunidad } from "@/components/comunidad/feed-comunidad";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Seccion } from "@/components/ui/seccion";

const DESCRIPCION = `Los pronósticos de la comunidad para ${EVENTO.nombre}: mira quién eligió a quién en los ${COMBATES.length} combates, reacciona y comenta. Publica los tuyos.`;

export const metadata: Metadata = {
  title: "Comunidad · Pronósticos de la gente",
  description: DESCRIPCION,
  alternates: { canonical: "/comunidad" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: EVENTO.nombre,
    url: "/comunidad",
    title: `Comunidad · Pronósticos de la gente · ${EVENTO.nombre}`,
    description: DESCRIPCION,
  },
  twitter: {
    card: "summary_large_image",
    title: `Comunidad · Pronósticos de la gente · ${EVENTO.nombre}`,
    description: DESCRIPCION,
  },
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="pt-[81px] lg:pt-[89px]">
        <Seccion
          id="comunidad"
          antetitulo="La comunidad"
          titulo="Pronósticos de la gente"
          bajada={`Publica tu quiniela de los ${COMBATES.length} combates, mira las de los demás, dales me gusta y comenta quién se equivoca.`}
          revelarCuerpo={false}
        >
          <FeedComunidad />
        </Seccion>
      </main>
      <SiteFooter />
    </>
  );
}
