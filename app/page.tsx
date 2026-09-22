import { CaraACara } from "@/components/cara-a-cara/cara-a-cara";
import { Combates } from "@/components/inicio/combates";
import { DatosEstructurados } from "@/components/inicio/datos-estructurados";
import { DondeVerlo } from "@/components/inicio/donde-verlo";
import { Entradas } from "@/components/inicio/entradas";
import { Hero } from "@/components/inicio/hero";
import { Patrocinador } from "@/components/inicio/patrocinador";
import { Presentacion } from "@/components/inicio/presentacion";
import { Pronosticos } from "@/components/pronosticos/pronosticos";
import { Seccion } from "@/components/ui/seccion";
import { Sede } from "@/components/inicio/sede";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export default function Page() {
  return (
    <>
      <DatosEstructurados />
      <SiteHeader />
      <main>
        <Hero />
        <Seccion
          id="cara-a-cara"
          ancho="amplio"
          antetitulo="Interactivo"
          titulo="Cara a cara"
          bajada="Arma el combate que quieras: elige a los dos peleadores, estén o no emparejados en la cartelera, y míralos frente a frente."
        >
          <CaraACara />
        </Seccion>
        <Seccion
          id="pronosticos"
          antetitulo="Votación abierta"
          titulo="Pronósticos"
          bajada="Elige a tu favorito en cada uno de los ocho combates, arma tus pronósticos y compártelos antes de la gran noche."
        >
          <Pronosticos />
        </Seccion>
        <Combates />
        <Seccion
          id="presentacion"
          antetitulo="La gala"
          titulo="La presentación"
          bajada="La noche en que se anunció la cartelera completa: los dieciséis creadores en el escenario, cara a cara por primera vez."
        >
          <Presentacion />
        </Seccion>
        <Entradas />
        <Sede />
        <DondeVerlo />
        <Patrocinador />
      </main>
      <SiteFooter />
    </>
  );
}
