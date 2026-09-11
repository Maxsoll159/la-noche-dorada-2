import Image from "next/image";
import { EVENTO } from "@/lib/evento";
import { CuentaRegresiva } from "./cuenta-regresiva";

const META = [
  { icono: "calendario", texto: EVENTO.fechaLarga.toUpperCase() },
  { icono: "pin", texto: `${EVENTO.sede.toUpperCase()} · LIMA` },
  { icono: "reloj", texto: EVENTO.hora.toUpperCase() },
];

function Icono({ nombre }: { nombre: string }) {
  const comun = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (nombre === "calendario")
    return (
      <svg {...comun}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 11h18" />
      </svg>
    );
  if (nombre === "pin")
    return (
      <svg {...comun}>
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    );
  return (
    <svg {...comun}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Cartel oficial de fondo, encuadrado para que su propio logo quede
          fuera del recorte y no compita con el logo del hero. */}
      <div aria-hidden className="absolute inset-0 -z-30">
        <Image
          src="/cartel-oficial.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          // El 25% deja fuera la fila de nombres del cartel (arriba) y su
          // propio lettering (abajo); queda solo la banda de peleadores.
          style={{ objectPosition: "center 25%" }}
          className="object-cover opacity-85"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-gradient-to-b from-noche/90 via-noche/80 to-noche"
      />
      {/* Sombra radial que despega el logo del fondo y resplandor dorado */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(11,11,13,0.9)_0%,rgba(11,11,13,0.7)_45%,rgba(11,11,13,0)_100%)]"
      />
      <div
        aria-hidden
        className="respirar absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_40%,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0)_100%)]"
      />

      {/* El pt deja libre la altura del header fijo (88 px) */}
      <div className="mx-auto flex max-w-contenido flex-col items-center gap-5 px-6 pt-32 pb-28 text-center lg:px-14 lg:pt-36 lg:pb-32">
        {/* El hero está sobre el pliegue, así que entra con animación y retardo
            escalonado en vez de esperar al observador de scroll. */}
        <p
          style={{ animationDelay: "180ms" }}
          className="entrada flex items-center gap-3.5 font-cond text-[13px] font-semibold uppercase tracking-[0.38em] text-oro"
        >
          <span aria-hidden className="h-px w-16 bg-oro-profundo" />
          {EVENTO.edicion} · Lima, Perú
          <span aria-hidden className="h-px w-16 bg-oro-profundo" />
        </p>

        <h1 className="sr-only">
          {EVENTO.nombre} — {EVENTO.fechaLarga} en el {EVENTO.sede}
        </h1>
        <Image
          src="/marca/logo-noche-dorada.webp"
          alt={EVENTO.nombre}
          width={455}
          height={406}
          priority
          // Dos retardos: el de la entrada y el del flotado, que arranca
          // recién cuando la entrada termina (260ms + 850ms).
          style={{ animationDelay: "260ms, 1110ms" }}
          className="entrada-flotante w-full max-w-[520px] drop-shadow-[0_18px_60px_rgba(0,0,0,0.6)]"
        />

        <p
          style={{ animationDelay: "420ms" }}
          className="entrada font-cond text-[17px] font-semibold uppercase tracking-[0.3em] text-oro-claro"
        >
          16 creadores · 8 combates · Una sola noche
        </p>

        <ul
          style={{ animationDelay: "520ms" }}
          className="entrada flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-1"
        >
          {META.map((m, i) => (
            <li key={m.texto} className="flex items-center gap-6">
              {i > 0 && (
                <span aria-hidden className="hidden h-3.5 w-px bg-linea sm:block" />
              )}
              <span className="flex items-center gap-2 font-cond text-[15px] font-semibold uppercase tracking-[0.09em]">
                <span className="text-oro">
                  <Icono nombre={m.icono} />
                </span>
                {m.texto}
              </span>
            </li>
          ))}
        </ul>

        <div style={{ animationDelay: "620ms" }} className="entrada pt-4">
          <CuentaRegresiva inicioISO={EVENTO.inicioISO} />
        </div>

        <a
          href="#combates"
          style={{ animationDelay: "760ms" }}
          className="entrada group mt-8 flex flex-col items-center gap-1.5 font-cond text-[11px] font-semibold uppercase tracking-[0.28em] text-oro-profundo transition-colors hover:text-oro"
        >
          Desliza para ver la cartelera
          <svg
            aria-hidden
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="flotar text-oro"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
