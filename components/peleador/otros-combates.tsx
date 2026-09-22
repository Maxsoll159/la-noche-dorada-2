import Image from "next/image";
import Link from "next/link";
import { COMBATES, type Combate } from "@/lib/evento";

export function OtrosCombates({ combate }: { combate: Combate }) {
  const otros = COMBATES.filter((c) => c.n !== combate.n);

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {otros.map((c) => (
        <li key={c.n}>
          <Link
            href={`/peleadores/${c.a.slug}`}
            className="group flex h-full flex-col gap-2 rounded-sm border border-linea bg-carbon p-3 transition duration-300 hover:-translate-y-1 hover:border-oro hover:bg-oro-tinte hover:shadow-[0_14px_30px_rgba(0,0,0,0.45)]"
          >
            <span className="font-cond text-[11px] font-bold tracking-[0.16em] text-oro-medio uppercase">
              Combate {c.n}
            </span>
            <span className="flex items-center gap-1.5">
              {[c.a, c.b].map((p) => (
                <span
                  key={p.slug}
                  className="relative block aspect-[3/4] flex-1 overflow-hidden rounded-sm border border-linea bg-[#0e0e12]"
                >
                  <Image
                    src={p.cuerpo ?? p.foto}
                    alt=""
                    fill
                    sizes="140px"
                    className={`object-cover object-top transition-opacity group-hover:opacity-90 ${
                      p.cuerpo ? "brightness-125 contrast-[1.06]" : ""
                    }`}
                  />
                </span>
              ))}
            </span>
            <span className="font-display text-[13px] leading-tight text-crema uppercase">
              {c.a.nombre}
              <span className="text-oro-medio"> vs </span>
              {c.b.nombre}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
