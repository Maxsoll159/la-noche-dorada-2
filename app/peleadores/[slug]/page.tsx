import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EVENTO, PELEADORES, BANDERAS, fichaDe, COMBATES } from "@/lib/evento";
import { SITIO } from "@/lib/sitio";
import { Patrocinador } from "@/components/inicio/patrocinador";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Comentarios } from "@/components/peleador/comentarios";
import { CabeceraPeleador } from "@/components/peleador/cabecera-peleador";
import { NavegacionPeleadores } from "@/components/peleador/navegacion-peleadores";
import { OtrosCombates } from "@/components/peleador/otros-combates";
import { SuCombate } from "@/components/peleador/su-combate";
import { ApoyoPeleador } from "@/components/pronosticos/apoyo-peleador";
import { Seccion } from "@/components/ui/seccion";

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
      locale: "es_PE",
      siteName: EVENTO.nombre,
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

  const url = `${SITIO}/peleadores/${peleador.slug}`;

  const perfil = {
    "@type": "ProfilePage",
    "@id": `${url}#perfil`,
    url,
    inLanguage: "es-PE",
    mainEntity: {
      "@type": "Person",
      name: peleador.nombre,
      image: `${SITIO}${peleador.foto}`,
      nationality: { "@type": "Country", name: BANDERAS[peleador.pais].nombre },
      ...(peleador.resena && { description: peleador.resena }),
      ...(peleador.redes?.length && {
        sameAs: peleador.redes.map((r) => r.url),
      }),
    },
  };

  const migas = {
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
        item: url,
      },
    ],
  };

  const grafo = {
    "@context": "https://schema.org",
    "@graph": [perfil, migas],
  };

  const secciones = [
    {
      id: "pronostico",
      antetitulo: "La comunidad",
      titulo: "Pronóstico",
      cuerpo: (
        <ApoyoPeleador
          combate={combate}
          peleador={peleador}
          rival={rival}
          lado={lado}
        />
      ),
    },
    ...(peleador.resena
      ? [
          {
            id: "quien-es",
            antetitulo: "El personaje",
            titulo: "Quién es",
            cuerpo: (
              <p className="mx-auto max-w-[52rem] text-center text-[17px] leading-relaxed text-tenue">
                {peleador.resena}
              </p>
            ),
          },
        ]
      : []),
    {
      id: "combate",
      antetitulo: diaYMes,
      titulo: "Su combate",
      cuerpo: <SuCombate peleador={peleador} rival={rival} combate={combate} />,
    },
    {
      id: "comentarios",
      antetitulo: "La comunidad opina",
      titulo: "Comentarios",
      cuerpo: <Comentarios slug={peleador.slug} nombre={peleador.nombre} />,
    },
    {
      id: "otros-combates",
      antetitulo: "La cartelera completa",
      titulo: `Los otros ${COMBATES.length - 1} combates`,
      cuerpo: (
        <div className="flex flex-col gap-10">
          <OtrosCombates combate={combate} />
          <NavegacionPeleadores peleador={peleador} />
        </div>
      ),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(grafo) }}
      />
      <SiteHeader />
      <main>
        <CabeceraPeleador peleador={peleador} rival={rival} combate={combate} />

        {secciones.map((sec, i) => (
          <Seccion
            key={sec.id}
            id={sec.id}
            fondo={i % 2 === 0 ? "superficie" : "noche"}
            antetitulo={sec.antetitulo}
            titulo={sec.titulo}
          >
            {sec.cuerpo}
          </Seccion>
        ))}

        <Patrocinador
          fondo={secciones.length % 2 === 0 ? "superficie" : "noche"}
        />
      </main>
      <SiteFooter />
    </>
  );
}
