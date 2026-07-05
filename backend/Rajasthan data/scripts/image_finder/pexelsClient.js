import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sleep, backoffDelay, parseRetryAfter } from "./rateLimit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", "..", ".env") });

function loadPexelsKeys() {
  const keys = [];
  if (process.env.PEXELS_API_KEY?.trim()) keys.push(process.env.PEXELS_API_KEY.trim());
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`PEXELS_API_KEY_${i}`]?.trim();
    if (k) keys.push(k);
  }
  return [...new Set(keys)];
}

const PEXELS_KEYS = loadPexelsKeys();
let keyIndex = 0;

export function isPexelsConfigured() {
  return PEXELS_KEYS.length > 0;
}

export function getPexelsKeyCount() {
  return PEXELS_KEYS.length;
}

function rotateKey(reason) {
  if (PEXELS_KEYS.length <= 1) return false;
  keyIndex = (keyIndex + 1) % PEXELS_KEYS.length;
  console.log(`    ⏳ Pexels ${reason} — rotating to key ${keyIndex + 1}/${PEXELS_KEYS.length}`);
  return true;
}

/**
 * Search Pexels with multi-key fallback on 429 / auth errors.
 */
export async function searchPexels(query, config) {
  if (!PEXELS_KEYS.length) {
    throw new Error("No PEXELS_API_KEY or PEXELS_API_KEY_N found in backend/.env");
  }

  const params = new URLSearchParams({
    query,
    per_page: String(config.providers?.pexels?.perPage || 5),
    orientation: config.providers?.pexels?.orientation || "landscape",
  });

  const rateConfig = config.rateLimit || {};
  const maxAttempts = (rateConfig.maxRetries ?? 8) + PEXELS_KEYS.length * 4;
  let attempts = 0;
  let keysTriedThisRound = 0;

  while (attempts < maxAttempts) {
    attempts++;
    const apiKey = PEXELS_KEYS[keyIndex];

    const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
      headers: { Authorization: apiKey },
    });

    if (res.status === 429) {
      keysTriedThisRound++;
      if (rotateKey("rate limit") && keysTriedThisRound < PEXELS_KEYS.length) continue;
      keysTriedThisRound = 0;
      const retryAfter = parseRetryAfter(res);
      const wait = retryAfter ?? backoffDelay(Math.min(attempts, 6), rateConfig);
      console.log(`    ⏳ Pexels waiting ${Math.round(wait / 1000)}s before retry...`);
      await sleep(wait);
      continue;
    }

    if (res.status === 401 || res.status === 403) {
      keysTriedThisRound++;
      if (rotateKey("key rejected") && keysTriedThisRound < PEXELS_KEYS.length) continue;
      const text = await res.text();
      throw new Error(`Pexels ${res.status}: ${text.slice(0, 150)}`);
    }

    if (res.status >= 500) {
      if (attempts < maxAttempts) {
        await sleep(backoffDelay(attempts, rateConfig));
        continue;
      }
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Pexels ${res.status}: ${text.slice(0, 150)}`);
    }

    keysTriedThisRound = 0;
    const data = await res.json();
    const photo = data.photos?.[0];
    if (!photo) return null;

    return {
      url: photo.src?.large2x || photo.src?.large || photo.src?.original,
      provider: "pexels",
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      keyUsed: keyIndex + 1,
    };
  }

  throw new Error(
    "Pexels rate limit — all keys exhausted. Run again later or add more PEXELS_API_KEY_N keys."
  );
}
