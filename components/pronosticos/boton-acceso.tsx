import { LogoDiscord, LogoGoogle } from "@/assets/icons";
import type { Proveedor } from "@/lib/sesion";

const ESTILO: Record<
  Proveedor,
  { texto: string; clase: string; Logo: typeof LogoGoogle }
> = {
  google: {
    texto: "Entrar con Google",
    clase: "bg-crema text-noche hover:bg-white",
    Logo: LogoGoogle,
  },
  discord: {
    texto: "Entrar con Discord",
    clase: "bg-[#5865F2] text-white hover:bg-[#4752C4]",
    Logo: LogoDiscord,
  },
};

export function BotonAcceso({
  proveedor,
  onClick,
}: {
  proveedor: Proveedor;
  onClick: () => void;
}) {
  const { texto, clase, Logo } = ESTILO[proveedor];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-sm px-6 py-3 font-cond text-[13px] font-bold tracking-[0.13em] uppercase transition-colors ${clase}`}
    >
      <Logo className="size-[18px] shrink-0" />
      {texto}
    </button>
  );
}

// Los dos botones con el mismo ancho: apilados en móvil, en dos columnas en
// tablet y otra vez apilados en pc, donde van al lado de un texto que necesita
// el espacio.
export function BotonesAcceso({
  onEntrar,
}: {
  onEntrar: (proveedor: Proveedor) => void;
}) {
  return (
    <div className="grid w-full gap-2.5 sm:w-auto sm:grid-cols-2 lg:grid-cols-1">
      <BotonAcceso proveedor="google" onClick={() => onEntrar("google")} />
      <BotonAcceso proveedor="discord" onClick={() => onEntrar("discord")} />
    </div>
  );
}
