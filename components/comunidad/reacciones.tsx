"use client";

import { useState } from "react";
import { IconoPulgarAbajo, IconoPulgarArriba } from "@/assets/icons";
import { ErrorApi, pedir } from "@/lib/api/cliente";
import type { Reaccion, RespuestaReaccion } from "@/lib/api/tipos";
import { iniciarSesion, marcarSinSesion, useUsuario } from "@/lib/sesion";

type Estado = { meGusta: number; noMeGusta: number; reaccion: Reaccion | null };

const numero = new Intl.NumberFormat("es-PE");

// Resta la reacción que había y suma la nueva, igual que el trigger de la base.
function aplicar(antes: Estado, nueva: Reaccion | null): Estado {
  const quita = (n: number, r: Reaccion) =>
    Math.max(n - (antes.reaccion === r ? 1 : 0), 0);
  return {
    meGusta: quita(antes.meGusta, "gusta") + (nueva === "gusta" ? 1 : 0),
    noMeGusta:
      quita(antes.noMeGusta, "no_gusta") + (nueva === "no_gusta" ? 1 : 0),
    reaccion: nueva,
  };
}

const BOTONES: {
  tipo: Reaccion;
  etiqueta: string;
  Icono: typeof IconoPulgarArriba;
  activo: string;
}[] = [
  {
    tipo: "gusta",
    etiqueta: "Me gusta",
    Icono: IconoPulgarArriba,
    activo:
      "border-oro bg-oro text-noche shadow-[0_0_14px_-3px_rgba(212,175,55,0.6)]",
  },
  {
    tipo: "no_gusta",
    etiqueta: "No me gusta",
    Icono: IconoPulgarAbajo,
    activo: "border-[#9a3b3b] bg-[#3a1515] text-[#ffb4b4]",
  },
];

// Me gusta / no me gusta de un pronóstico. Tocar el activo lo quita; tocar el
// otro cambia la reacción. Se actualiza en pantalla al toque y, si el
// servidor falla, vuelve atrás.
export function Reacciones({
  id,
  meGusta,
  noMeGusta,
  reaccion,
  compacto = false,
  onCambio,
}: {
  id: number;
  meGusta: number;
  noMeGusta: number;
  reaccion: Reaccion | null;
  compacto?: boolean;
  onCambio?: (estado: RespuestaReaccion) => void;
}) {
  const { usuario } = useUsuario();
  const [estado, setEstado] = useState<Estado>({
    meGusta,
    noMeGusta,
    reaccion,
  });
  const [previo, setPrevio] = useState({ meGusta, noMeGusta, reaccion });
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);

  // Si el padre trae datos nuevos (por ejemplo, la reacción propia recién
  // leída), mandan sobre lo local.
  if (
    previo.meGusta !== meGusta ||
    previo.noMeGusta !== noMeGusta ||
    previo.reaccion !== reaccion
  ) {
    setPrevio({ meGusta, noMeGusta, reaccion });
    setEstado({ meGusta, noMeGusta, reaccion });
  }

  async function reaccionar(tipo: Reaccion) {
    if (!usuario) {
      iniciarSesion(
        "google",
        `${window.location.pathname}${window.location.search}`,
      );
      return;
    }
    if (ocupado) return;

    const antes = estado;
    const quitar = antes.reaccion === tipo;
    setAviso(null);
    setEstado(aplicar(antes, quitar ? null : tipo));
    setOcupado(true);
    try {
      const r = await pedir<RespuestaReaccion>(
        `/api/comunidad/${id}/reaccion`,
        quitar ? { method: "DELETE" } : { method: "PUT", json: { tipo } },
      );
      setEstado(r);
      onCambio?.(r);
    } catch (e) {
      setEstado(antes);
      if (e instanceof ErrorApi && e.status === 401) {
        marcarSinSesion();
        setAviso("Tu sesión expiró. Vuelve a entrar.");
      } else {
        setAviso("No pudimos guardar tu reacción.");
      }
    } finally {
      setOcupado(false);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {BOTONES.map(({ tipo, etiqueta, Icono, activo }) => {
          const esActivo = estado.reaccion === tipo;
          const n = tipo === "gusta" ? estado.meGusta : estado.noMeGusta;
          return (
            <button
              key={tipo}
              type="button"
              onClick={() => reaccionar(tipo)}
              disabled={ocupado}
              aria-pressed={esActivo}
              aria-label={`${etiqueta}: ${numero.format(n)}`}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border font-cond leading-none font-bold tracking-[0.1em] uppercase transition-colors duration-300 disabled:cursor-wait ${
                compacto
                  ? "px-2.5 py-1.5 text-[11px]"
                  : "px-3.5 py-2 text-[12px]"
              } ${
                esActivo
                  ? activo
                  : "border-linea bg-noche/60 text-crema/80 hover:border-oro-profundo hover:text-oro"
              }`}
            >
              <Icono size={compacto ? 14 : 16} strokeWidth={2.2} />
              <span className="tabular-nums">{numero.format(n)}</span>
              {!compacto && (
                <span className="hidden sm:inline">{etiqueta}</span>
              )}
            </button>
          );
        })}
      </div>
      {aviso && (
        <p
          role="status"
          className="font-cond text-[11px] font-semibold tracking-[0.1em] text-[#ffb4b4] uppercase"
        >
          {aviso}
        </p>
      )}
    </div>
  );
}
