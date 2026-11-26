import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import { withRegionalCache } from "@opennextjs/cloudflare/overrides/incremental-cache/regional-cache";

// Caché incremental (ISR) en Workers KV: binding NEXT_INC_CACHE_KV de wrangler.jsonc.
// Delante va la Cache API de cada datacenter (gratis y sin cupo): sin ella, cada
// visita y cada prefetch (?_rsc=) leía KV, y el plan gratis solo da 100 000
// lecturas al día; al pasarlas, KV falla y la página da 500 hasta el reinicio
// diario. No se usa revalidateTag/revalidatePath, así que no hace falta
// refrescar en segundo plano en cada acierto.
export default defineCloudflareConfig({
  incrementalCache: withRegionalCache(kvIncrementalCache, {
    mode: "long-lived",
    shouldLazilyUpdateOnCacheHit: false,
  }),
});
