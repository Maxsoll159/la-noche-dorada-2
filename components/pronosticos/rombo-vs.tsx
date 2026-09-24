export function RomboVS({ pequeno = false }: { pequeno?: boolean }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute top-1/2 left-1/2 z-10 grid -translate-x-1/2 -translate-y-1/2 place-items-center ${
        pequeno ? "size-[28px] sm:size-[34px]" : "size-[40px] sm:size-[50px]"
      }`}
    >
      <span className="absolute inset-0 rotate-45 rounded-[4px] border border-oro bg-[linear-gradient(135deg,#2a2010_0%,#0b0b0d_70%)] shadow-[0_0_0_4px_rgba(11,11,13,0.92),0_0_24px_rgba(212,175,55,0.35)]" />
      <span
        className={`relative texto-oro font-display ${
          pequeno ? "text-[10px] sm:text-[12px]" : "text-[13px] sm:text-[16px]"
        }`}
      >
        VS
      </span>
    </span>
  );
}
