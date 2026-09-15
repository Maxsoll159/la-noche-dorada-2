import type { ReactNode } from "react";
import { FileteOro } from "./filete-oro";
import { Revelar } from "./revelar";

type Props = {
  id?: string;
  antetitulo: string;
  titulo: string;
  bajada?: string;
  fondo?: "noche" | "superficie";
  /**
   * "amplio" suelta el tope de 1200 del contenido y deja la sección crecer
   * hasta 1408. Es para piezas que se sienten apretadas en el ancho normal,
   * como el escenario del cara a cara; el encabezado sigue igual.
   */
  ancho?: "contenido" | "amplio";
  /**
   * Desactívalo cuando la sección revela sus propias piezas por separado
   * (las cards de combate, por ejemplo): así no se superponen dos fundidos.
   */
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
        className={`mx-auto flex flex-col items-center gap-6 px-6 py-20 lg:px-14 lg:py-24 ${
          ancho === "amplio" ? "max-w-[88rem]" : "max-w-contenido"
        }`}
      >
        <Revelar>
          <header className="flex flex-col items-center gap-3 text-center">
            <p className="flex items-center gap-3 font-cond text-[13px] font-semibold uppercase tracking-[0.28em] text-oro">
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
        {/* El retardo hace que el cuerpo entre justo después del encabezado */}
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
