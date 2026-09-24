import Link from "next/link";
import { IconoPerfil } from "@/assets/icons";
import type { Peleador } from "@/lib/evento";
import type { Lado } from "@/lib/votacion";

// Va encima de la loseta de voto, como hermano y no como hijo: un enlace no
// puede vivir dentro del botón que vota.
export function BotonFicha({
  peleador,
  lado,
  votado,
}: {
  peleador: Peleador;
  lado: Lado;
  votado: boolean;
}) {
  return (
    <Link
      href={`/peleadores/${peleador.slug}`}
      aria-label={`Ver la ficha de ${peleador.nombre}`}
      title={`Ver la ficha de ${peleador.nombre}`}
      className={`group/ficha absolute z-20 flex h-8 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-oro-profundo bg-noche/85 px-2.5 font-cond text-[11px] font-bold tracking-[0.14em] text-oro-claro uppercase shadow-[0_0_14px_-3px_rgba(212,175,55,0.55)] backdrop-blur-sm transition duration-300 hover:border-oro hover:bg-oro hover:text-noche sm:px-3 ${
        votado ? "top-12" : "top-7"
      } ${lado === "a" ? "left-1.5 sm:left-2" : "right-1.5 sm:right-2"}`}
    >
      <IconoPerfil size={15} strokeWidth={2.2} className="shrink-0" />
      <span>Ficha</span>
    </Link>
  );
}
