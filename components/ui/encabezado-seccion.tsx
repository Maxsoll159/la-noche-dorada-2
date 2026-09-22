export function EncabezadoSeccion({
  antetitulo,
  titulo,
}: {
  antetitulo: string;
  titulo: string;
}) {
  return (
    <header className="flex flex-col items-center gap-3 text-center">
      <p className="flex items-center gap-3 font-cond text-[12px] font-bold tracking-[0.28em] text-oro uppercase">
        <span aria-hidden className="h-px w-8 bg-oro-profundo" />
        {antetitulo}
        <span aria-hidden className="h-px w-8 bg-oro-profundo" />
      </p>
      <h2 className="text-[38px] leading-none tracking-wide text-crema sm:text-[48px]">
        {titulo}
      </h2>
    </header>
  );
}
