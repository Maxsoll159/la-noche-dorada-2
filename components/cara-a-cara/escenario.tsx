import Link from "next/link";
import type { Combate, Peleador } from "@/lib/evento";
import { VideoFondo } from "@/components/ui/video-fondo";
import { LADO } from "./constantes";
import { Barrido, Figura, FlechaFicha, Rotulo } from "./figura";
import { RotuloCruce } from "./rotulo-cruce";

export function Escenario({
  izq,
  der,
  oficial,
}: {
  izq: Peleador;
  der: Peleador;
  oficial: Combate | null;
}) {
  const clip = izq.video ?? der.video;

  return (
    <div className="relative h-[340px] w-full overflow-hidden sm:h-[480px] lg:h-[clamp(460px,58vh,680px)]">
      {clip && (
        <VideoFondo
          key={clip}
          src={clip}
          className="absolute inset-0 size-full [mask-image:radial-gradient(75%_78%_at_50%_45%,#000_30%,transparent_100%)] object-cover"
        />
      )}
      <div
        aria-hidden
        className={
          clip
            ? "absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_42%,rgba(42,33,20,0.5)_0%,rgba(21,20,25,0.72)_40%,rgba(11,11,13,0.92)_78%)]"
            : "absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_42%,#2a2114_0%,#151419_40%,#0b0b0d_78%)]"
        }
      />
      <div
        aria-hidden
        className="absolute inset-0 respirar bg-[radial-gradient(26%_36%_at_50%_44%,rgba(255,246,216,0.6)_0%,rgba(212,175,55,0.3)_32%,rgba(212,175,55,0)_72%)]"
      />
      <div
        aria-hidden
        className="absolute top-[44%] left-1/2 h-px w-[170%] -translate-x-1/2 -rotate-[14deg] bg-[linear-gradient(90deg,transparent_26%,rgba(247,227,161,0.5)_50%,transparent_74%)]"
      />
      <div
        aria-hidden
        className="absolute top-[44%] left-1/2 h-px w-[170%] -translate-x-1/2 rotate-[9deg] bg-[linear-gradient(90deg,transparent_26%,rgba(247,227,161,0.35)_50%,transparent_74%)]"
      />
      <div
        aria-hidden
        className="absolute top-[44%] left-1/2 h-px w-[130%] -translate-x-1/2 -rotate-[38deg] bg-[linear-gradient(90deg,transparent_24%,rgba(247,227,161,0.25)_50%,transparent_76%)]"
      />
      <div
        aria-hidden
        className="absolute top-[44%] left-1/2 h-px w-[130%] -translate-x-1/2 rotate-[52deg] bg-[linear-gradient(90deg,transparent_24%,rgba(247,227,161,0.2)_50%,transparent_76%)]"
      />
      <p
        aria-hidden
        className="absolute top-[40%] left-1/2 texto-oro -translate-x-1/2 -translate-y-1/2 -skew-x-6 font-display text-[56px] leading-none opacity-90 drop-shadow-[0_0_30px_rgba(212,175,55,0.6)] sm:text-[104px] lg:text-[112px]"
      >
        VS
      </p>
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[5] h-[32%] bg-[linear-gradient(to_bottom,rgba(11,11,13,1)_0%,rgba(11,11,13,0.6)_45%,transparent_100%)]"
      />

      <Figura peleador={izq} lado="a" />
      <Figura peleador={der} lado="b" />

      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[15] h-[55%] bg-[linear-gradient(to_bottom,transparent_0%,rgba(11,11,13,0.55)_45%,rgba(11,11,13,0.98)_100%)]"
      />

      <Rotulo peleador={izq} lado="a" />
      <Rotulo peleador={der} lado="b" />

      {(["a", "b"] as const).map((lado) => {
        const p = lado === "a" ? izq : der;
        return (
          <Link
            key={p.slug}
            href={`/peleadores/${p.slug}`}
            className={`absolute bottom-[18%] z-20 flex min-h-11 cambio-pulso items-center gap-2 overflow-hidden rounded-sm border border-oro-claro bg-oro px-3.5 py-2.5 font-cond text-[12px] font-bold tracking-[0.16em] whitespace-nowrap text-noche uppercase transition-colors hover:bg-oro-claro sm:px-4 lg:hidden ${
              lado === "a"
                ? "left-3 sm:left-5"
                : "right-3 flex-row-reverse sm:right-5"
            }`}
          >
            <Barrido claro />
            <span
              className={`relative grid size-4 place-items-center rounded-[2px] font-display text-[11px] leading-none text-white ${LADO[lado].fondo}`}
            >
              {LADO[lado].numero}
            </span>
            <span className="relative">Ver su ficha</span>
            <FlechaFicha className="relative" />
          </Link>
        );
      })}

      <RotuloCruce
        oficial={oficial}
        izq={izq}
        der={der}
        className="absolute top-5 left-1/2 z-20 hidden -translate-x-1/2 rounded-sm border border-oro-profundo bg-noche/80 px-4 py-2 font-cond text-[11px] font-bold tracking-[0.18em] whitespace-nowrap text-oro uppercase backdrop-blur-sm lg:block"
      />
    </div>
  );
}
