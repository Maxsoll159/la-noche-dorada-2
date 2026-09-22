import Link from "next/link";
import { IconoChevronAbajo, IconoChevronIzquierda } from "@/assets/icons";
import { BANDERAS, EVENTO, type Combate, type Peleador } from "@/lib/evento";
import { Bandera } from "@/components/ui/bandera";
import { VideoFondo } from "@/components/ui/video-fondo";
import { FichaFisica } from "./ficha-fisica";
import { RedesPeleador } from "./redes-peleador";
import { RetratoPeleador } from "./retrato-peleador";
import { TarjetaRival } from "./tarjeta-rival";

export function CabeceraPeleador({
  peleador,
  rival,
  combate,
}: {
  peleador: Peleador;
  rival: Peleador;
  combate: Combate;
}) {
  const pais = BANDERAS[peleador.pais];
  const espera = peleador.video ? 4000 : 0;
  const entra = (ms: number) => ({ animationDelay: `${espera + ms}ms` });

  const sombra = peleador.video
    ? "[text-shadow:0_2px_12px_rgba(11,11,13,0.95)]"
    : "";

  return (
    <section className="relative isolate overflow-hidden bg-noche pt-24 pb-16 lg:pt-32 lg:pb-20">
      {peleador.video && (
        <VideoFondo
          src={peleador.video}
          className="absolute inset-x-0 top-[81px] -z-20 h-[calc(100%-81px)] w-full object-cover lg:top-[89px] lg:h-[calc(100%-89px)]"
        />
      )}
      <div
        aria-hidden
        className={`absolute -z-10 ${
          peleador.video
            ? "inset-x-0 top-[81px] bottom-0 bg-[radial-gradient(95%_85%_at_50%_38%,rgba(20,16,10,0.34)_0%,rgba(13,13,16,0.6)_55%,rgba(11,11,13,0.8)_100%)] lg:top-[89px]"
            : "inset-0 bg-[radial-gradient(60%_55%_at_50%_30%,#2a2114_0%,#16151a_55%,#0b0b0d_100%)]"
        }`}
      />
      <div className="mx-auto flex max-w-contenido flex-col gap-8 px-6 lg:px-14">
        <Link
          href="/#combates"
          style={entra(60)}
          className={`flex entrada items-center gap-2 font-cond text-[12px] font-bold tracking-[0.18em] text-oro-medio uppercase transition-colors hover:text-oro ${sombra}`}
        >
          <IconoChevronIzquierda size={14} strokeWidth={2.4} />
          Volver a la cartelera
        </Link>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[430px_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:items-center lg:gap-x-12 lg:gap-y-6">
          <div
            style={entra(140)}
            className={`flex entrada flex-col items-center gap-1.5 text-center sm:gap-3 lg:col-start-2 lg:row-start-1 lg:items-start lg:self-end lg:text-left ${sombra}`}
          >
            <p className="flex flex-wrap items-center justify-center gap-2 font-cond text-[11px] font-bold tracking-[0.18em] uppercase lg:justify-start">
              <span
                className={`rounded-sm px-2 py-1 leading-none ${
                  combate.estelar
                    ? "bg-oro text-noche"
                    : combate.billing
                      ? "border border-oro text-oro"
                      : "border border-oro-profundo text-oro"
                }`}
              >
                {combate.billing ?? `Combate ${combate.n}`}
              </span>
              {combate.billing && (
                <span className="text-oro-medio">Combate {combate.n}</span>
              )}
              <span aria-hidden className="hidden text-oro-medio sm:inline">
                ·
              </span>
              <span className="hidden text-oro-medio sm:inline">
                {EVENTO.fechaLarga}
              </span>
            </p>
            <h1 className="texto-oro w-full text-[36px] leading-[1.12] break-words sm:text-[58px] lg:text-[72px]">
              {peleador.nombre}
            </h1>
            <p className="flex items-center gap-2.5 font-cond text-[12px] font-bold tracking-[0.18em] text-oro uppercase">
              <Bandera pais={peleador.pais} className="h-3.5 w-[21px]" />
              {pais.nombre}
            </p>
          </div>

          <RetratoPeleador peleador={peleador} style={entra(240)} />

          <div className="flex min-w-0 flex-col gap-5 lg:col-start-2 lg:row-start-2 lg:self-start">
            <FichaFisica
              peleador={peleador}
              sombra={sombra}
              style={entra(340)}
            />
            <TarjetaRival rival={rival} style={entra(420)} />
          </div>
        </div>

        <RedesPeleador peleador={peleador} style={entra(580)} />
      </div>

      {peleador.video && (
        <div
          aria-hidden
          style={entra(900)}
          className="absolute inset-x-0 bottom-6 hidden entrada justify-center lg:flex"
        >
          <IconoChevronAbajo size={22} className="flotar text-oro-medio" />
        </div>
      )}
    </section>
  );
}
