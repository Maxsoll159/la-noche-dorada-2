import type { ReactNode } from "react";
import { FileteOro } from "@/components/ui/filete-oro";
import { Revelar } from "@/components/ui/revelar";

type Props = {
  id?: string;
  antetitulo: string;
  titulo: string;
  bajada?: string;
  fondo?: "noche" | "superficie";
  ancho?: "contenido" | "amplio";
  revelarCuerpo?: boolean;
  children: ReactNode;
};

export function Seccion({
  id,
  antetitulo,
  titulo,
  bajada,
  fondo = "noche",
  ancho = "contenido",
  revelarCuerpo = true,
  children,
}: Props) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 ${fondo === "superficie" ? "bg-superficie" : "bg-noche"}`}
    >
      <FileteOro />
      <div
        className={`mx-auto flex flex-col items-center gap-8 px-6 py-14 sm:py-16 lg:px-14 lg:py-20 ${
          ancho === "amplio" ? "max-w-[88rem]" : "max-w-contenido"
        }`}
      >
        <Revelar>
          <header className="flex flex-col items-center gap-3 text-center">
            <p className="flex items-center gap-3 font-cond text-[13px] font-semibold tracking-[0.28em] text-oro uppercase">
              <span aria-hidden className="h-px w-8 bg-oro-profundo" />
              {antetitulo}
              <span aria-hidden className="h-px w-8 bg-oro-profundo" />
            </p>
            <h2 className="text-[42px] leading-none tracking-wide text-crema sm:text-[52px]">
              {titulo}
            </h2>
            {bajada && (
              <p className="max-w-[40rem] text-[17px] leading-relaxed text-tenue">
                {bajada}
              </p>
            )}
          </header>
        </Revelar>
        {revelarCuerpo ? (
          <Revelar retardo={120} className="w-full">
            {children}
          </Revelar>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </div>
    </section>
  );
}
