import Image from "next/image";
import Link from "next/link";
import { COMBATES, type Combate } from "@/lib/evento";
import { RomboVS } from "@/components/pronosticos/rombo-vs";

export function OtrosCombates({ combate }: { combate: Combate }) {
  const otros = COMBATES.filter((c) => c.n !== combate.n);

  return (
    <ul className="flex flex-wrap justify-center gap-3">
      {otros.map((c) => (
        <li
          key={c.n}
          className="w-[calc((100%-0.75rem)/2)] sm:w-[calc((100%-1.5rem)/3)] lg:w-[calc((100%-2.25rem)/4)]"
        >
          <Link
            href={`/peleadores/${c.a.slug}`}
            className="group relative isolate flex h-full flex-col gap-2.5 overflow-hidden rounded-md border border-linea bg-[linear-gradient(180deg,#16161c_0%,#101015_100%)] p-2.5 transition duration-300 hover:-translate-y-1 hover:border-oro hover:shadow-[0_18px_40px_-18px_rgba(212,175,55,0.5)] sm:p-3"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-oro/0 to-transparent transition-colors duration-500 group-hover:via-oro-claro"
            />
            <span className="flex items-center gap-2 font-cond text-[10px] font-bold tracking-[0.18em] text-oro-medio uppercase transition-colors duration-300 group-hover:text-oro sm:text-[11px]">
              <span
                aria-hidden
                className="size-1.5 rotate-45 bg-oro-profundo transition-colors duration-300 group-hover:bg-oro"
              />
              Combate {c.n}
            </span>
            <span className="relative grid grid-cols-2 gap-1.5">
              {[c.a, c.b].map((p, i) => (
                <span
                  key={p.slug}
                  className="relative block aspect-[3/4] overflow-hidden rounded-[4px] bg-[#0e0e12]"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-0 ${
                      i === 0
                        ? "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(226,54,44,0.28)_0%,rgba(14,14,18,0)_75%)]"
                        : "bg-[radial-gradient(90%_70%_at_50%_0%,rgba(47,123,230,0.28)_0%,rgba(14,14,18,0)_75%)]"
                    }`}
                  />
                  <Image
                    src={p.cuerpo ?? p.foto}
                    alt=""
                    fill
                    sizes="140px"
                    className={`object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                      p.cuerpo ? "brightness-125 contrast-[1.06]" : ""
                    }`}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-noche/90 to-transparent"
                  />
                </span>
              ))}
              <RomboVS pequeno />
            </span>
            <span className="flex flex-col gap-0.5 font-display text-[14px] leading-tight text-crema uppercase sm:text-[16px]">
              <span className="truncate transition-colors duration-300 group-hover:text-oro-claro">
                {c.a.nombre}
              </span>
              <span className="truncate text-tenue transition-colors duration-300 group-hover:text-oro-claro">
                <span className="text-oro-medio">vs </span>
                {c.b.nombre}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
