import { createHash } from "node:crypto";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { COMBATES } from "@/lib/evento";
import { INSTRUCCIONES } from "@/lib/mascota/instrucciones";
import type { Database } from "@/lib/supabase/tipos";

// gpt-5-nano salía tibio y sin gracia para el trash talk; gpt-4o-mini sigue
// costando centavos. Los modelos gpt-5 piensan antes de responder: a esos hay
// que bajarles el razonamiento al mínimo, a los demás no se les manda.
const MODELO: string = "gpt-4o-mini";
const RAZONA = MODELO.startsWith("gpt-5");
const MAX_PREGUNTA = 300;
const MAX_RESPUESTA = 800;
const MAX_TURNOS = 10;

// 15 preguntas cada 10 minutos por IP. Vive en la memoria de cada instancia:
// frena el abuso casual, no un ataque repartido entre instancias. Para eso
// está el tope de gasto del proyecto en OpenAI.
const LIMITE = 15;
const VENTANA_MS = 10 * 60 * 1000;
const pedidos = new Map<string, number[]>();

function excedeLimite(ip: string) {
  const ahora = Date.now();
  const recientes = (pedidos.get(ip) ?? []).filter(
    (t) => ahora - t < VENTANA_MS,
  );
  if (recientes.length >= LIMITE) return true;
  recientes.push(ahora);
  pedidos.set(ip, recientes);
  if (pedidos.size > 5000) pedidos.clear();
  return false;
}

// Los votos se piden a Supabase como mucho una vez por minuto.
let votosEnCache: { texto: string; hasta: number } | null = null;

async function votosDeLaComunidad() {
  if (votosEnCache && votosEnCache.hasta > Date.now())
    return votosEnCache.texto;
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
    const { data } = await supabase
      .from("combates")
      .select("numero, pct_a, votos_a, votos_b");
    const lineas = (data ?? []).flatMap((fila) => {
      const c = COMBATES.find((x) => x.n === fila.numero);
      if (!c || fila.pct_a === null) return [];
      return [
        `- ${c.a.nombre} ${fila.pct_a}% vs ${c.b.nombre} ${100 - fila.pct_a}% (${fila.votos_a + fila.votos_b} votos)`,
      ];
    });
    const texto = lineas.length
      ? `Así va la votación de la comunidad en la web:\n${lineas.join("\n")}`
      : "Todavía no hay votos de la comunidad.";
    votosEnCache = { texto, hasta: Date.now() + 60_000 };
    return texto;
  } catch {
    return "No se pudo leer la votación de la comunidad.";
  }
}

type Mensaje = { rol: "usuario" | "mascota"; texto: string };

function leerMensajes(cuerpo: unknown): Mensaje[] | null {
  if (!cuerpo || typeof cuerpo !== "object") return null;
  const lista = (cuerpo as { mensajes?: unknown }).mensajes;
  if (!Array.isArray(lista) || lista.length === 0) return null;

  const mensajes: Mensaje[] = [];
  for (const m of lista.slice(-MAX_TURNOS)) {
    const { rol, texto } = (m ?? {}) as Record<string, unknown>;
    if ((rol !== "usuario" && rol !== "mascota") || typeof texto !== "string")
      return null;
    const limpio = texto.trim();
    if (!limpio) continue;
    mensajes.push({
      rol,
      texto: limpio.slice(0, rol === "usuario" ? MAX_PREGUNTA : MAX_RESPUESTA),
    });
  }
  // La conversación que llega a OpenAI tiene que empezar y terminar en una
  // pregunta de la persona.
  while (mensajes[0]?.rol === "mascota") mensajes.shift();
  return mensajes.at(-1)?.rol === "usuario" ? mensajes : null;
}

const respuesta = (texto: string, status: number) =>
  new Response(texto, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return respuesta("El Dorado está calentando, vuelve en un rato. 🥊", 503);
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconocida";
  if (excedeLimite(ip)) {
    return respuesta(
      "Asu causa, ya me hiciste muchas preguntas. Descansa un toque y vuelve en unos minutos. 😮‍💨",
      429,
    );
  }

  const mensajes = leerMensajes(await request.json().catch(() => null));
  if (!mensajes) return respuesta("No te entendí, causa.", 400);

  const openai = new OpenAI();
  let eventos;
  try {
    eventos = await openai.responses.create({
      model: MODELO,
      instructions: INSTRUCCIONES,
      input: [
        { role: "developer", content: await votosDeLaComunidad() },
        ...mensajes.map((m) => ({
          role:
            m.rol === "usuario" ? ("user" as const) : ("assistant" as const),
          content: m.texto,
        })),
      ],
      ...(RAZONA && { reasoning: { effort: "minimal" as const } }),
      max_output_tokens: RAZONA ? 600 : 250,
      prompt_cache_key: "mascota-noche-dorada",
      // Identificador anónimo por persona para que OpenAI detecte abuso sin
      // recibir la IP.
      safety_identifier: createHash("sha256").update(ip).digest("hex"),
      stream: true,
    });
  } catch (error) {
    console.error("mascota: fallo al llamar a OpenAI", error);
    return respuesta(
      "Pucha, me noquearon un ratito. Intenta de nuevo en unos segundos.",
      502,
    );
  }

  const codificador = new TextEncoder();
  const cuerpo = new ReadableStream<Uint8Array>({
    async start(control) {
      try {
        for await (const evento of eventos) {
          if (evento.type === "response.output_text.delta") {
            control.enqueue(codificador.encode(evento.delta));
          }
        }
      } catch (error) {
        console.error("mascota: se cortó la respuesta", error);
        control.enqueue(codificador.encode(" …se me fue la señal, causa."));
      } finally {
        control.close();
      }
    },
  });

  return new Response(cuerpo, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
