import { CaraACara } from "./components/cara-a-cara";
import { Combates } from "./components/combates";
import { DatosEstructurados } from "./components/datos-estructurados";
import { DondeVerlo } from "./components/donde-verlo";
import { Entradas } from "./components/entradas";
import { Hero } from "./components/hero";
import { Patrocinador } from "./components/patrocinador";
import { Pronosticos } from "./components/pronosticos";
import { Seccion } from "./components/seccion";
import { Sede } from "./components/sede";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";

export default function Page() {
  return (
    <>
      <DatosEstructurados />
      <SiteHeader />
      <main>
        <Hero />
        <Seccion
          id="cara-a-cara"
          antetitulo="Interactivo"
          titulo="Cara a cara"
          bajada="Elige a cualquier peleador del cartel y mira su combate frente a frente."
        >
          <CaraACara />
        </Seccion>
        <Combates />
        <Seccion
          id="pronosticos"
          antetitulo="Segunda fase · Próximamente"
          titulo="Pronósticos"
          bajada="Pronto podrás elegir a tu favorito en cada uno de los ocho combates, armar tu quiniela y compartirla antes de la gran noche."
        >
          <Pronosticos />
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
