import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENTO, PELEADORES, BANDERAS, fichaDe } from "@/lib/evento";
import { SITIO } from "@/lib/sitio";
import { Patrocinador } from "@/components/inicio/patrocinador";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CabeceraPeleador } from "@/components/peleador/cabecera-peleador";
import { NavegacionPeleadores } from "@/components/peleador/navegacion-peleadores";
import { OtrosCombates } from "@/components/peleador/otros-combates";
import { SuCombate } from "@/components/peleador/su-combate";
import { ApoyoPeleador } from "@/components/pronosticos/apoyo-peleador";
import { EncabezadoSeccion } from "@/components/ui/encabezado-seccion";
import { FileteOro } from "@/components/ui/filete-oro";
import { Revelar } from "@/components/ui/revelar";

export function generateStaticParams() {
  return PELEADORES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(
  props: PageProps<"/peleadores/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const ficha = fichaDe(slug);
  if (!ficha) return {};

  const { peleador, rival, combate } = ficha;
  const titulo = `${peleador.nombre} vs ${rival.nombre}`;
  const descripcion = `${peleador.nombre} (${BANDERAS[peleador.pais].nombre}) pelea contra ${rival.nombre} en el combate ${combate.n} de ${EVENTO.nombre}. ${EVENTO.fechaLarga} en el ${EVENTO.sede}, Lima.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: `/peleadores/${peleador.slug}` },
    openGraph: {
      type: "profile",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      url: `/peleadores/${peleador.slug}`,
      images: [
        {
          url: combate.arte,
          width: 1080,
          height: 1140,
          alt: `${combate.a.nombre} vs ${combate.b.nombre}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${titulo} · ${EVENTO.nombre}`,
      description: descripcion,
      images: [combate.arte],
    },
  };
}

export default async function Page(props: PageProps<"/peleadores/[slug]">) {
  const { slug } = await props.params;
  const ficha = fichaDe(slug);
  if (!ficha) notFound();

  const { peleador, rival, combate, lado } = ficha;
  const diaYMes = EVENTO.fechaLarga.split(" ").slice(1).join(" ");

  const migas = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: EVENTO.nombre, item: SITIO },
      {
        "@type": "ListItem",
        position: 2,
        name: "Combates",
        item: `${SITIO}/#combates`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: peleador.nombre,
        item: `${SITIO}/peleadores/${peleador.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migas) }}
      />
      <SiteHeader />
      <main>
        <CabeceraPeleador peleador={peleador} rival={rival} combate={combate} />

        <FileteOro />

        <section className="bg-superficie">
          <div className="mx-auto flex max-w-contenido flex-col gap-12 px-6 py-16 lg:px-14 lg:py-20">
            <Revelar
              id="pronostico"
              className="flex scroll-mt-28 flex-col gap-8"
            >
              <EncabezadoSeccion
                antetitulo="La comunidad"
                titulo="Pronóstico"
              />
              <ApoyoPeleador
                combate={combate}
                peleador={peleador}
                rival={rival}
                lado={lado}
              />
            </Revelar>

            {peleador.resena && (
              <Revelar className="flex flex-col items-center gap-4 text-center">
                <EncabezadoSeccion
                  antetitulo="El personaje"
                  titulo="Quién es"
                />
                <p className="max-w-[52rem] text-[17px] leading-relaxed text-tenue">
                  {peleador.resena}
                </p>
              </Revelar>
            )}

            <Revelar
              id="combate"
              retardo={80}
              className="flex scroll-mt-28 flex-col gap-8"
            >
              <EncabezadoSeccion antetitulo={diaYMes} titulo="Su combate" />
              <SuCombate peleador={peleador} rival={rival} combate={combate} />
            </Revelar>

            <Revelar retardo={80} className="flex flex-col gap-8">
              <OtrosCombates combate={combate} />
            </Revelar>

            <Revelar retardo={80}>
              <NavegacionPeleadores peleador={peleador} />
            </Revelar>
          </div>
        </section>

        <Patrocinador />
      </main>
      <SiteFooter />
    </>
  );
}
