import { LogoGoogle } from "@/assets/icons";

export function BotonGoogle({
  onClick,
  children,
}: {
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 cursor-pointer items-center justify-center gap-2.5 rounded-sm bg-crema px-6 py-3 font-cond text-[13px] font-bold tracking-[0.13em] text-noche uppercase transition-colors hover:bg-white"
    >
      <LogoGoogle className="size-[18px] shrink-0" />
      {children}
    </button>
  );
}
