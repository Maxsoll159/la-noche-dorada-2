import { IconoCandado, IconoTrofeo } from "@/assets/icons";
import { PRONOSTICOS_ACTIVOS, type Combate } from "@/lib/evento";
import { estaAbierto, type Conteo, type Lado } from "@/lib/votacion";
import { LadoVoto } from "./lado-voto";
import { RomboVS } from "./rombo-vs";

export function CardPronostico({
  c,
  conteo,
  voto,
  enviando,
  onVotar,
}: {
  c: Combate;
  conteo?: Conteo;
  voto?: Lado;
  enviando: boolean;
  onVotar: (lado: Lado) => void;
}) {
  const activo = PRONOSTICOS_ACTIVOS;
  const pctA = activo && conteo ? conteo.pctA : null;
  const anchoA = pctA ?? 50;
  const lideraA = pctA !== null && pctA >= 50;
  const lideraB = pctA !== null && pctA < 50;
  const abierto = activo && estaAbierto(conteo);
  const esperando = activo && !conteo;
  const ganador = activo ? (conteo?.ganador ?? null) : null;
  const acerto = ganador !== null && voto === ganador;
  const puedeVotar = activo && !esperando && abierto && !ganador;

  const nombre = (lado: Lado) => c[lado].nombre;

  return (
    <article
      className={`overflow-hidden rounded-sm border ${
        c.estelar ? "border-oro bg-oro-tinte" : "border-linea bg-carbon"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-linea bg-[#08080b] px-3 py-2.5 sm:px-5">
        <p className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.12em] uppercase sm:gap-2.5 sm:text-[11px] sm:tracking-[0.22em]">
          <span className="text-oro">Combate {c.n}</span>
          {c.billing && (
            <>
              <span
                aria-hidden
                className="size-[3px] rounded-full bg-oro-profundo"
              />
              <span className="text-oro-medio">{c.billing}</span>
            </>
          )}
        </p>
        <p className="flex items-center gap-2 font-cond text-[11px] font-bold tracking-[0.1em] uppercase sm:text-[11px] sm:tracking-[0.14em]">
          {!activo ? (
            <span className="text-oro-medio">Próximamente</span>
          ) : esperando ? (
            <span className="text-tenue">Cargando</span>
          ) : (
            <>
              <span
                aria-hidden
                className={`inline-block size-[7px] rounded-full ${
                  ganador || voto ? "bg-oro" : "bg-humo"
                }`}
              />
              <span className={ganador || voto ? "text-oro" : "text-tenue"}>
                {ganador
                  ? "Resultado final"
                  : !abierto
                    ? "Votación cerrada"
                    : voto
                      ? "Ya votaste"
                      : "Votación abierta"}
              </span>
            </>
          )}
        </p>
      </header>

      <div className="relative grid grid-cols-2 gap-1.5 p-1.5 sm:gap-2 sm:p-2">
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
        <RomboVS />
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
      </div>

      <div
        role="img"
        aria-label={
          pctA === null
            ? "Todavía sin votos"
            : `${pctA} % para ${c.a.nombre}, ${100 - pctA} % para ${c.b.nombre}`
        }
        className="flex h-2 w-full overflow-hidden bg-[#2a2a31]"
      >
        <span
          style={{ width: `${anchoA}%` }}
          className={`block transition-[width] duration-500 ${
            lideraA
              ? "bg-gradient-to-r from-oro-profundo to-oro-claro"
              : "bg-humo"
          }`}
        />
        <span
          className={`block flex-1 transition-[width] duration-500 ${
            lideraB
              ? "bg-gradient-to-l from-oro-profundo to-oro-claro"
              : "bg-humo"
          }`}
        />
      </div>

      {(ganador || !activo || esperando || !abierto || voto) && (
        <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-[#08080b] px-3 py-2.5 font-cond text-[11px] font-semibold tracking-[0.12em] text-tenue uppercase sm:px-5">
          {ganador ? (
            <>
              <span className="flex items-center gap-2 text-oro-claro">
                <span className="text-oro">
                  <IconoTrofeo className="size-[15px]" />
                </span>
                Ganó {nombre(ganador)}
              </span>
              {voto && (
                <span className={acerto ? "text-oro" : "text-tenue"}>
                  {acerto ? "Acertaste" : `Votaste por ${nombre(voto)}`}
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
              La votación de este combate ya cerró
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
