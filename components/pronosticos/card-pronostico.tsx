import { IconoCandado, IconoTrofeo } from "@/assets/icons";
import { PRONOSTICOS_ACTIVOS, type Combate } from "@/lib/evento";
import { METODO } from "@/lib/compartir";
import {
  estaAbierto,
  type Conteo,
  type Lado,
  type Metodo,
} from "@/lib/votacion";
import { BotonFicha } from "./boton-ficha";
import { LadoVoto } from "./lado-voto";
import { RomboVS } from "./rombo-vs";
import { SelectorMetodo } from "./selector-metodo";

const TONO = {
  vivo: {
    pildora: "border-oro-profundo bg-noche/60 text-oro",
    punto: "latido bg-oro shadow-[0_0_8px_rgba(212,175,55,0.9)]",
  },
  lleno: { pildora: "border-oro bg-oro text-noche", punto: "bg-noche" },
  apagado: { pildora: "border-linea bg-noche/40 text-tenue", punto: "bg-humo" },
} as const;

export function CardPronostico({
  c,
  conteo,
  voto,
  metodo,
  enviando,
  enviandoMetodo,
  onVotar,
  onMetodo,
}: {
  c: Combate;
  conteo?: Conteo;
  voto?: Lado;
  metodo?: Metodo;
  enviando: boolean;
  enviandoMetodo: boolean;
  onVotar: (lado: Lado) => void;
  onMetodo: (metodo: Metodo) => void;
}) {
  const activo = PRONOSTICOS_ACTIVOS;
  const pctA = activo && conteo ? conteo.pctA : null;
  const anchoA = pctA ?? 50;
  const lideraA = pctA !== null && pctA >= 50;
  const lideraB = pctA !== null && pctA < 50;
  const abierto = activo && estaAbierto(conteo);
  const esperando = activo && !conteo;
  const resuelto = activo && (conteo?.resuelto ?? false);
  const ganador = activo ? (conteo?.ganador ?? null) : null;
  const metodoReal = activo ? (conteo?.metodo ?? null) : null;
  const acerto = ganador !== null && voto === ganador;
  const acertoMetodo = metodoReal !== null && !!voto && metodo === metodoReal;
  const puedeVotar = activo && !esperando && abierto && !resuelto;
  const totalMetodos = conteo
    ? Object.values(conteo.votosMetodo).reduce((s, n) => s + n, 0)
    : 0;

  const nombre = (lado: Lado) => c[lado].nombre;

  const estado: { texto: string; tono: keyof typeof TONO } = !activo
    ? { texto: "Próximamente", tono: "apagado" }
    : esperando
      ? { texto: "Cargando", tono: "apagado" }
      : resuelto
        ? { texto: "Resultado final", tono: "lleno" }
        : !abierto
          ? { texto: "Votación cerrada", tono: "apagado" }
          : voto
            ? { texto: "Ya votaste", tono: "lleno" }
            : { texto: "Votación abierta", tono: "vivo" };

  return (
    <article
      className={`relative isolate overflow-hidden rounded-md border transition-[border-color,box-shadow] duration-300 ${
        c.estelar
          ? "border-oro bg-[linear-gradient(180deg,#1d170a_0%,#110e08_55%,#0d0c0a_100%)] shadow-[0_24px_60px_-28px_rgba(212,175,55,0.55)]"
          : "border-linea bg-[linear-gradient(180deg,#16161c_0%,#101015_100%)] hover:border-oro-profundo/80"
      }`}
    >
      {c.estelar && (
        <>
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-oro-claro to-transparent"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(212,175,55,0.2)_0%,rgba(212,175,55,0)_100%)]"
          />
        </>
      )}

      <header className="flex items-center justify-between gap-3 px-2.5 pt-2.5 pb-2 sm:px-3.5 sm:pt-3 sm:pb-2.5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <span
            className={`grid h-9 min-w-9 shrink-0 place-items-center rounded-[3px] px-1.5 font-display text-[18px] leading-none tabular-nums ${
              c.estelar
                ? "bg-oro text-noche shadow-[0_0_18px_rgba(212,175,55,0.45)]"
                : "border border-oro-profundo bg-oro-tinte text-oro"
            }`}
          >
            {c.n}
          </span>
          <div className="min-w-0">
            <p
              className={`truncate font-cond text-[12px] leading-tight font-bold tracking-[0.16em] uppercase sm:text-[13px] ${
                c.estelar ? "text-oro-claro" : "text-crema"
              }`}
            >
              {c.billing ?? `Combate ${c.n}`}
            </p>
            <p className="truncate font-cond text-[10px] font-semibold tracking-[0.14em] text-tenue uppercase sm:text-[11px]">
              {c.billing && `Combate ${c.n} · `}3 rounds × 2 min
            </p>
          </div>
        </div>
        <p
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-cond text-[10px] leading-none font-bold tracking-[0.12em] uppercase sm:text-[11px] sm:tracking-[0.14em] ${TONO[estado.tono].pildora}`}
        >
          <span
            aria-hidden
            className={`inline-block size-[6px] rounded-full ${TONO[estado.tono].punto}`}
          />
          {estado.texto}
        </p>
      </header>

      <div className="relative grid grid-cols-2 gap-1.5 px-1.5 sm:gap-2 sm:px-2">
        <div className="relative">
          <LadoVoto
            peleador={c.a}
            lado="a"
            pct={pctA}
            lidera={lideraA}
            resultado={
              ganador ? (ganador === "a" ? "gano" : "perdio") : undefined
            }
            votado={voto === "a"}
            otroVotado={voto === "b"}
            puedeVotar={puedeVotar}
            enviando={enviando}
            onVotar={() => onVotar("a")}
          />
          <BotonFicha peleador={c.a} lado="a" votado={voto === "a"} />
        </div>
        <RomboVS />
        <div className="relative">
          <LadoVoto
            peleador={c.b}
            lado="b"
            pct={pctA === null ? null : 100 - pctA}
            lidera={lideraB}
            resultado={
              ganador ? (ganador === "b" ? "gano" : "perdio") : undefined
            }
            votado={voto === "b"}
            otroVotado={voto === "a"}
            puedeVotar={puedeVotar}
            enviando={enviando}
            onVotar={() => onVotar("b")}
          />
          <BotonFicha peleador={c.b} lado="b" votado={voto === "b"} />
        </div>
      </div>

      <div className="px-1.5 pt-2 pb-2.5 sm:px-2 sm:pt-2.5 sm:pb-3">
        <div
          role="img"
          aria-label={
            pctA === null
              ? "Todavía sin votos"
              : `${pctA} % para ${c.a.nombre}, ${100 - pctA} % para ${c.b.nombre}`
          }
          className="relative flex h-1.5 w-full gap-[2px] overflow-hidden rounded-full"
        >
          <span
            style={{ width: `${anchoA}%` }}
            className={`block rounded-l-full transition-[width] duration-500 ${
              lideraA
                ? "bg-gradient-to-r from-oro-profundo to-oro-claro shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                : "bg-linea"
            }`}
          />
          <span
            className={`block flex-1 rounded-r-full transition-[width] duration-500 ${
              lideraB
                ? "bg-gradient-to-l from-oro-profundo to-oro-claro shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                : "bg-linea"
            }`}
          />
        </div>
      </div>

      {conteo && (puedeVotar || totalMetodos > 0) && (
        <SelectorMetodo
          metodo={voto ? metodo : undefined}
          votos={conteo.votosMetodo}
          puedeElegir={puedeVotar && !!voto}
          abierto={puedeVotar}
          enviando={enviandoMetodo}
          onElegir={onMetodo}
        />
      )}

      {(resuelto || !activo || esperando || !abierto || voto) && (
        <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-linea/70 bg-noche/50 px-3 py-2.5 font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase sm:px-4">
          {resuelto ? (
            <>
              <span className="flex items-center gap-2 text-oro-claro">
                <span className="text-oro">
                  <IconoTrofeo className="size-[15px]" />
                </span>
                {ganador
                  ? `Ganó ${nombre(ganador)}${metodoReal ? ` · ${METODO[metodoReal].nombre}` : ""}`
                  : "Terminó en empate"}
              </span>
              {voto && (
                <span
                  className={acerto || acertoMetodo ? "text-oro" : "text-tenue"}
                >
                  {acerto && acertoMetodo
                    ? "Acertaste ganador y método"
                    : acerto
                      ? "Acertaste el ganador"
                      : acertoMetodo
                        ? "Acertaste el método"
                        : `Votaste por ${nombre(voto)}${metodo ? ` · ${METODO[metodo].nombre}` : ""}`}
                </span>
              )}
            </>
          ) : !activo ? (
            <span className="flex items-center gap-2">
              <IconoCandado className="size-[14px] shrink-0" />
              La votación se habilita en la segunda fase
            </span>
          ) : esperando ? (
            <span>Cargando la votación</span>
          ) : !abierto ? (
            <span className="flex items-center gap-2">
              <IconoCandado className="size-[14px] shrink-0" />
              {voto
                ? `Cerró · Votaste por ${nombre(voto)}${metodo ? ` · ${METODO[metodo].nombre}` : ""}`
                : "La votación de este combate ya cerró"}
            </span>
          ) : voto ? (
            <>
              <span className="text-oro-claro">Votaste por {nombre(voto)}</span>
              <span className="flex items-center gap-3">
                <span>Toca el otro lado para cambiar</span>
                <button
                  type="button"
                  disabled={enviando}
                  onClick={() => onVotar(voto)}
                  className="cursor-pointer underline transition-colors hover:text-oro disabled:cursor-wait disabled:opacity-50"
                >
                  Quitar voto
                </button>
              </span>
            </>
          ) : null}
        </footer>
      )}
    </article>
  );
}
