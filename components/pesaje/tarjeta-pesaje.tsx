import Image from "next/image";
import Link from "next/link";
import { PESOS_OFICIALES, type Combate, type Peleador } from "@/lib/evento";
import { coma } from "@/lib/formato";
import { Bandera } from "@/components/ui/bandera";

export const kg = (n: number) => (Number.isInteger(n) ? String(n) : coma(n, 1));

export function PuntoVivo({ color = "bg-lado-a" }: { color?: string }) {
  return (
    <span aria-hidden className="relative flex size-2">
      <span
        className={`absolute inset-0 animate-ping rounded-full opacity-75 ${color}`}
      />
      <span className={`relative size-2 rounded-full ${color}`} />
    </span>
  );
}

// La pantalla de la balanza: el número grande, lo de antes debajo.
function Balanza({ p, derecha }: { p: Peleador; derecha?: boolean }) {
  const pesaje = PESOS_OFICIALES[p.slug];
  const cambio =
    pesaje?.antes !== undefined
      ? Math.round((pesaje.ahora - pesaje.antes) * 10) / 10
      : null;

  return (
    <div
      className={`relative flex flex-col gap-2 overflow-hidden rounded-sm border px-3 py-3 sm:px-4 ${
        derecha ? "items-end text-right" : "items-start"
      } ${
        pesaje
          ? "border-oro-profundo bg-[radial-gradient(120%_100%_at_50%_0%,#2a210d_0%,#0a0a0c_70%)] shadow-[inset_0_0_24px_rgba(212,175,55,0.12)]"
          : "border-linea bg-[#09090b]"
      }`}
    >
      <Link
        href={`/peleadores/${p.slug}`}
        className={`flex max-w-full items-center gap-1.5 font-cond text-[12px] font-bold tracking-[0.12em] uppercase transition-colors hover:text-oro ${
          derecha ? "flex-row-reverse" : ""
        } ${pesaje ? "text-crema" : "text-tenue"}`}
      >
        <Bandera pais={p.pais} className="h-2.5 w-4 shrink-0" />
        <span className="truncate">{p.nombre}</span>
      </Link>

      {pesaje ? (
        <p className="flex items-baseline gap-1 font-display leading-none">
          <span className="texto-oro text-[44px] tabular-nums drop-shadow-[0_0_14px_rgba(212,175,55,0.35)] sm:text-[52px]">
            {kg(pesaje.ahora)}
          </span>
          <span className="font-cond text-[14px] font-bold tracking-[0.1em] text-oro uppercase">
            kg
          </span>
        </p>
      ) : (
        <p className="flex items-baseline gap-1 font-display leading-none text-[#26262d]">
          <span className="text-[44px] tabular-nums sm:text-[52px]">00,0</span>
          <span className="font-cond text-[14px] font-bold tracking-[0.1em] uppercase">
            kg
          </span>
        </p>
      )}

      <div
        className={`flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1 font-cond text-[11px] font-bold tracking-[0.12em] uppercase ${
          derecha ? "justify-end" : ""
        }`}
      >
        {!pesaje && <span className="text-humo">Por pesar</span>}
        {pesaje?.antes !== undefined && (
          <span className="text-tenue">
            Antes{" "}
            <span className="text-crema/60 line-through decoration-lado-a">
              {kg(pesaje.antes)}
            </span>
          </span>
        )}
        {cambio !== null && (
          <span
            className={`rounded-sm px-1.5 py-1 leading-none ${
              cambio < 0
                ? "bg-kick/15 text-kick"
                : cambio > 0
                  ? "bg-lado-a/15 text-[#ff7a70]"
                  : "bg-oro-tinte text-oro"
            }`}
          >
            {cambio === 0
              ? "Igual"
              : `${cambio > 0 ? "▲ +" : "▼ −"}${kg(Math.abs(cambio))} kg`}
          </span>
        )}
      </div>
    </div>
  );
}

export function TarjetaPesaje({ c }: { c: Combate }) {
  const pesados = [c.a, c.b].filter((p) => PESOS_OFICIALES[p.slug]).length;
  const estado =
    pesados === 2 ? "listo" : pesados === 1 ? "balanza" : "pendiente";

  return (
    <article
      className={`group relative isolate flex flex-col overflow-hidden rounded-sm border transition duration-300 ${
        estado === "balanza"
          ? "border-oro shadow-[0_0_50px_-12px_rgba(212,175,55,0.6)]"
          : estado === "listo"
            ? "border-oro-profundo hover:border-oro"
            : "border-linea"
      } bg-carbon`}
    >
      <div className="relative h-44 overflow-hidden sm:h-52">
        <div className="absolute inset-0 grid grid-cols-2">
          {[c.a, c.b].map((p) => (
            <div
              key={p.slug}
              className="relative overflow-hidden bg-[radial-gradient(80%_90%_at_50%_30%,#3a2c10_0%,#101015_75%)]"
            >
              <Image
                src={p.cuerpo ?? p.foto}
                alt={p.nombre}
                fill
                sizes="(min-width: 768px) 300px, 50vw"
                className={`object-cover object-top transition duration-500 group-hover:scale-[1.04] ${
                  PESOS_OFICIALES[p.slug] ? "" : "opacity-40 grayscale"
                }`}
              />
            </div>
          ))}
        </div>
        <span
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-linear-to-b from-oro-claro/0 via-oro to-oro-claro/0"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-carbon to-transparent"
        />
        <header className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3 font-cond text-[11px] font-bold tracking-[0.18em] uppercase sm:p-4">
          <span className="rounded-sm bg-noche/80 px-2 py-1 leading-none text-oro backdrop-blur-sm">
            Combate {c.n}
            {c.billing && (
              <span className="text-oro-claro"> · {c.billing}</span>
            )}
          </span>
          {estado === "listo" && (
            <span className="rounded-sm bg-oro px-2 py-1 leading-none text-noche">
              ✓ Pesados
            </span>
          )}
          {estado === "balanza" && (
            <span className="flex items-center gap-1.5 rounded-sm bg-lado-a px-2 py-1 leading-none text-crema">
              <PuntoVivo color="bg-crema" />
              En la balanza
            </span>
          )}
          {estado === "pendiente" && (
            <span className="rounded-sm bg-noche/80 px-2 py-1 leading-none text-tenue backdrop-blur-sm">
              Pendiente
            </span>
          )}
        </header>
      </div>

      <div className="relative grid grid-cols-2 gap-2 p-3 sm:gap-3 sm:p-4">
        <Balanza p={c.a} />
        <Balanza p={c.b} derecha />
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center"
        >
          <span className="absolute inset-0 rotate-45 rounded-[3px] border border-oro bg-noche" />
          <span className="relative font-cond text-[11px] font-bold tracking-[0.1em] text-oro">
            VS
          </span>
        </span>
      </div>
    </article>
  );
}
