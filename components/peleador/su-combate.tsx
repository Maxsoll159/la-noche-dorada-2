import Image from "next/image";
import Link from "next/link";
import {
  IconoBanderin,
  IconoExterno,
  IconoPin,
  IconoReloj,
  IconoSenal,
} from "@/assets/icons";
import { BANDERAS, EVENTO, type Combate, type Peleador } from "@/lib/evento";
import { FrenteAFrente } from "./frente-a-frente";

export function SuCombate({
  peleador,
  rival,
  combate,
}: {
  peleador: Peleador;
  rival: Peleador;
  combate: Combate;
}) {
  const DETALLE = [
    { Icono: IconoReloj, etiqueta: "Formato", valor: "3 rounds de 2 minutos" },
    {
      Icono: IconoBanderin,
      etiqueta: "Esquinas",
      valor: `${BANDERAS[peleador.pais].nombre} vs ${BANDERAS[rival.pais].nombre}`,
    },
    {
      Icono: IconoPin,
      etiqueta: "Sede",
      valor: `${EVENTO.sede}, ${EVENTO.distrito}`,
    },
    {
      Icono: IconoSenal,
      etiqueta: "Transmisión",
      valor: `En vivo por Kick ${EVENTO.streamCanal}`,
    },
  ];

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <Link
          href="/#combates"
          className="mx-auto block w-full max-w-[360px] overflow-hidden rounded-sm border border-linea transition duration-300 hover:-translate-y-1 hover:border-oro hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)]"
        >
          <Image
            src={combate.arte}
            alt={`${combate.a.nombre} vs ${combate.b.nombre}`}
            width={1080}
            height={1140}
            sizes="360px"
            className="h-auto w-full"
          />
        </Link>

        <div className="overflow-hidden rounded-sm border border-linea">
          <p className="flex items-center gap-2.5 bg-oro px-5 py-2.5 font-cond text-[12px] font-bold tracking-[0.16em] text-noche uppercase">
            <span aria-hidden className="size-2 rotate-45 bg-noche/70" />
            Combate {combate.n}
            {combate.billing && ` · ${combate.billing}`}
          </p>

          <div className="flex flex-col gap-6 bg-carbon px-5 py-6 sm:px-7">
            <div>
              <p className="font-display text-[24px] leading-tight text-oro-claro uppercase sm:text-[30px]">
                {peleador.nombre} <span className="text-oro">vs</span>{" "}
                {rival.nombre}
              </p>
              <span aria-hidden className="mt-3 block h-[3px] w-14 bg-oro" />
            </div>

            <dl className="flex flex-col gap-4">
              {DETALLE.map((d) => (
                <div key={d.etiqueta} className="flex items-start gap-3">
                  <span className="mt-0.5 text-oro">
                    <d.Icono size={15} />
                  </span>
                  <div className="min-w-0">
                    <dt className="font-cond text-[11px] font-bold tracking-[0.18em] text-oro-medio uppercase">
                      {d.etiqueta}
                    </dt>
                    <dd className="font-cond text-[15px] font-semibold tracking-[0.06em] text-crema uppercase">
                      {d.valor}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <a
              href={EVENTO.entradasUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-sm bg-oro px-6 py-3.5 font-cond text-[13px] font-bold tracking-[0.14em] text-noche uppercase transition-colors hover:bg-oro-claro"
            >
              Comprar en Ticketmaster.pe
              <IconoExterno size={15} strokeWidth={2.4} />
            </a>
          </div>
        </div>
      </div>

      <FrenteAFrente peleador={peleador} rival={rival} />
    </>
  );
}
