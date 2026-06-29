// Session cache wrapper for window.fetch API
export function initSessionCache() {
  if (typeof window === "undefined" || !window.sessionStorage) return;

  // Prevent multiple initializations
  if (window.fetch && window.fetch.__isCached) {
    console.log("[SessionCache] Caching wrapper is already initialized.");
    return;
  }

  const originalFetch = window.fetch;

  const cachedFetch = async function (input, init) {
    const url = typeof input === "string" ? input : input.url;

    // Only cache GET requests
    const isGet = !init || !init.method || init.method.toUpperCase() === "GET";

    // Only cache API routes and exclude AI routes
    const isApiRoute = url.includes("/api/");
    const isAiRoute = url.includes("/api/ai");

    if (isApiRoute && !isAiRoute && isGet) {
      const cacheKey = `rc_session_cache_${url}`;
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          console.log(`[SessionCache] Serving cached response for: ${url}`);
          return new Response(JSON.stringify(parsed), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          console.error("[SessionCache] Error parsing cached JSON", e);
        }
      }

      // Fetch from network
      const response = await originalFetch(input, init);

      if (response.ok) {
        try {
          // Clone the response to read its JSON body without consuming it
          const clone = response.clone();
          const json = await clone.json();
          sessionStorage.setItem(cacheKey, JSON.stringify(json));
          console.log(`[SessionCache] Cached response for: ${url}`);
        } catch (e) {
          // Response was not JSON, do not cache
        }
      }

      return response;
    }

    return originalFetch(input, init);
  };

  cachedFetch.__isCached = true;
  window.fetch = cachedFetch;
  console.log("🚀 [SessionCache] Global fetch wrapper successfully initialized.");
}
