const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function parseRetryAfter(res) {
  const header = res.headers.get("retry-after");
  if (!header) return null;
  const seconds = parseInt(header, 10);
  if (!Number.isNaN(seconds)) return seconds * 1000;
  const date = Date.parse(header);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
  return null;
}

export function backoffDelay(attempt, config = {}) {
  const base = config.baseDelayMs ?? 2000;
  const max = config.maxDelayMs ?? 120000;
  const delay = Math.min(base * 2 ** attempt, max);
  const jitter = Math.floor(Math.random() * 500);
  return delay + jitter;
}

export function isRateLimitError(err) {
  const msg = String(err?.message || err).toLowerCase();
  return (
    err?.status === 429 ||
    msg.includes("429") ||
    msg.includes("too many request") ||
    msg.includes("rate limit")
  );
}

export { sleep };
