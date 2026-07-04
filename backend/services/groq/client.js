const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
export const GROQ_MODEL = "llama-3.3-70b-versatile";

function loadGroqKeys() {
  const keys = [];
  if (process.env.GROQ_API_KEY?.trim()) {
    keys.push(process.env.GROQ_API_KEY.trim());
  }
  for (let i = 1; i <= 10; i++) {
    const key = process.env[`GROQ_API_KEY_${i}`]?.trim();
    if (key) keys.push(key);
  }
  return [...new Set(keys)];
}

const GROQ_KEYS = loadGroqKeys();
let currentKeyIndex = 0;

export function isGroqConfigured() {
  return GROQ_KEYS.length > 0;
}

if (isGroqConfigured()) {
  console.log(`🤖 Groq AI ready (${GROQ_KEYS.length} key(s), model: ${GROQ_MODEL})`);
} else {
  console.log("⚠️ No Groq API keys found. AI features will use local fallback responses.");
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Low-level Groq chat completion call with key rotation on rate limits.
 */
export async function callGroq(messages, { jsonMode = false, temperature = 0.4 } = {}) {
  if (!isGroqConfigured()) return null;

  const maxAttempts = GROQ_KEYS.length * 2;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    const apiKey = GROQ_KEYS[currentKeyIndex];

    try {
      const body = {
        model: GROQ_MODEL,
        messages,
        temperature,
      };
      if (jsonMode) {
        body.response_format = { type: "json_object" };
      }

      const response = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const isRateLimit = response.status === 429;
        if (isRateLimit && GROQ_KEYS.length > 1) {
          currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
          await sleep(800);
          continue;
        }
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (err) {
      console.error("Groq API request failed:", err.message);
      if (GROQ_KEYS.length > 1) {
        currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
      }
      await sleep(500);
    }
  }

  return null;
}
