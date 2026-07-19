// Centralized API endpoint configuration for local & production environments
const envUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

const isLocal = typeof window !== "undefined" && 
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL =
  envUrl || (import.meta.env.DEV || isLocal ? "http://localhost:5000" : "");

if (!API_BASE_URL && import.meta.env.PROD) {
  console.error(
    "VITE_API_URL is not set. API calls will fail in production. " +
      "Set it in your hosting provider's environment variables before deploying."
  );
}

/** Fetch JSON from the API and throw on non-OK responses. */
export async function fetchJson(path) {
  if (!API_BASE_URL) {
    throw new Error("API is not configured (missing VITE_API_URL)");
  }
  const res = await fetch(`${API_BASE_URL}${path}`);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || `API error ${res.status}`);
  }
  return json;
}
