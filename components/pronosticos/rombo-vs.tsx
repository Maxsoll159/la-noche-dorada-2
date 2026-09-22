export function RomboVS() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute top-1/2 left-1/2 z-10 grid size-[36px] -translate-x-1/2 -translate-y-1/2 place-items-center sm:size-[46px]"
    >
      <span className="absolute inset-0 rotate-45 rounded-[3px] border border-oro bg-noche shadow-[0_0_18px_rgba(0,0,0,0.85)]" />
      <span className="relative font-display text-[12px] text-oro sm:text-[14px]">
        VS
      </span>
    </span>
  );
}
