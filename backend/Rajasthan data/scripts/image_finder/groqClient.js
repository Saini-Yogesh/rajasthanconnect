import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sleep, backoffDelay, parseRetryAfter } from "./rateLimit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", "..", "..", ".env") });

function loadGroqKeys() {
  const keys = [];
  if (process.env.GROQ_API_KEY?.trim()) keys.push(process.env.GROQ_API_KEY.trim());
  for (let i = 1; i <= 10; i++) {
    const k = process.env[`GROQ_API_KEY_${i}`]?.trim();
    if (k) keys.push(k);
  }
  return [...new Set(keys)];
}

const GROQ_KEYS = loadGroqKeys();
let keyIndex = 0;

export function isGroqConfigured() {
  return GROQ_KEYS.length > 0;
}

export function getGroqKeyCount() {
  return GROQ_KEYS.length;
}

export async function callGroq(messages, groqConfig = {}, rateConfig = {}) {
  if (!GROQ_KEYS.length) {
    throw new Error("No GROQ_API_KEY found in backend/.env");
  }

  const { model, temperature = 0.25, jsonMode = true, maxRetries = 5 } = groqConfig;
  const maxAttempts = (rateConfig.maxRetries ?? 8) + GROQ_KEYS.length * maxRetries;
  let attempts = 0;
  let keysTriedThisRound = 0;
  const maxWait = rateConfig.maxDelayMs ?? 120000;
  const groqCapWait = rateConfig.groqCapWaitMs ?? 45000;

  while (attempts < maxAttempts) {
    attempts++;
    const apiKey = GROQ_KEYS[keyIndex];

    const body = { model, messages, temperature };
    if (jsonMode) body.response_format = { type: "json_object" };

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      keysTriedThisRound++;
      if (GROQ_KEYS.length > 1 && keysTriedThisRound < GROQ_KEYS.length) {
        keyIndex = (keyIndex + 1) % GROQ_KEYS.length;
        console.log(`    ⏳ Groq rate limit — rotating to key ${keyIndex + 1}/${GROQ_KEYS.length} (no wait)`);
        continue;
      }
      keysTriedThisRound = 0;
      const retryAfter = parseRetryAfter(res);
      const rawWait = retryAfter ?? backoffDelay(Math.min(attempts, 6), rateConfig);
      const wait = Math.min(rawWait, groqCapWait, maxWait);
      console.log(
        `    ⏳ Groq all ${GROQ_KEYS.length} keys rate-limited — waiting ${Math.round(wait / 1000)}s then retrying...`
      );
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const errText = await res.text();
      if (res.status >= 500 && attempts < maxAttempts) {
        await sleep(backoffDelay(attempts, rateConfig));
        continue;
      }
      throw new Error(`Groq HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    keysTriedThisRound = 0;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  }

  throw new Error("Groq rate limit — max retries exceeded. Run again later or add more GROQ_API_KEY_N keys.");
}
