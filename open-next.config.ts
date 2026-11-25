import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";

// Caché incremental (ISR) en Workers KV: binding NEXT_INC_CACHE_KV de wrangler.jsonc.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
});
