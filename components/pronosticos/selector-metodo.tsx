import { METODOS, type Metodo } from "@/lib/compartir";

export function SelectorMetodo({
  metodo,
  votos,
  puedeElegir,
  abierto,
  enviando,
  onElegir,
}: {
  metodo: Metodo | undefined;
  votos: Record<Metodo, number>;
  puedeElegir: boolean;
  abierto: boolean;
  enviando: boolean;
  onElegir: (metodo: Metodo) => void;
}) {
  const total = METODOS.reduce((suma, m) => suma + votos[m.id], 0);
  const mayor = Math.max(...METODOS.map((m) => votos[m.id]));
  const pct = (n: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  const nota = !abierto
    ? `Lo que eligió la comunidad · ${total} ${total === 1 ? "voto" : "votos"}`
    : !puedeElegir
      ? "Vota por un peleador para elegir"
      : metodo
        ? "Toca de nuevo para quitarlo"
        : "Opcional · Suma un punto más";

  return (
    <div className="flex flex-col items-center gap-2.5 border-t border-linea/70 px-2.5 py-3 text-center sm:px-3.5">
      <p className="flex flex-col items-center gap-0.5 font-cond text-[11px] font-bold tracking-[0.16em] uppercase">
        <span className="text-oro">¿Cómo termina?</span>
        <span className="text-[10px] tracking-[0.12em] text-tenue">{nota}</span>
      </p>
      <ul className="grid w-full grid-cols-6 gap-1.5 sm:flex sm:w-auto sm:flex-wrap sm:justify-center">
        {METODOS.map((m, i) => {
          const elegido = metodo === m.id;
          const n = votos[m.id];
          const lidera = total > 0 && n === mayor;
          return (
            <li key={m.id} className={i < 3 ? "col-span-2" : "col-span-3"}>
              <button
                type="button"
                disabled={!puedeElegir || enviando}
                onClick={() => onElegir(m.id)}
                aria-pressed={puedeElegir ? elegido : undefined}
                aria-label={`${m.nombre}: ${pct(n)} % de la comunidad`}
                className={`relative isolate flex size-full min-h-11 flex-col items-center justify-center gap-0.5 overflow-hidden rounded-[10px] border px-1.5 py-1.5 text-center font-cond text-[11px] leading-tight font-bold tracking-[0.1em] uppercase transition-colors duration-300 sm:min-h-8 sm:w-auto sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3 sm:py-1 sm:text-[12px] ${
                  puedeElegir
                    ? "cursor-pointer disabled:cursor-wait disabled:opacity-60"
                    : "cursor-default"
                } ${
                  elegido
                    ? "border-oro bg-oro text-noche shadow-[0_0_14px_-3px_rgba(212,175,55,0.6)]"
                    : `bg-noche/60 ${
                        lidera
                          ? "border-oro-profundo text-oro-claro"
                          : "border-linea text-crema/80"
                      } ${puedeElegir ? "hover:border-oro-profundo hover:text-oro" : ""}`
                }`}
              >
                {!elegido && total > 0 && (
                  <span
                    aria-hidden
                    style={{ width: `${pct(n)}%` }}
                    className={`absolute inset-y-0 left-0 -z-10 transition-[width] duration-500 ${
                      lidera ? "bg-oro/20" : "bg-oro/10"
                    }`}
                  />
                )}
                <span>{m.nombre}</span>
                {total > 0 && (
                  <span
                    className={`tabular-nums ${
                      elegido ? "text-noche/75" : "text-oro"
                    }`}
                  >
                    {pct(n)}%
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
