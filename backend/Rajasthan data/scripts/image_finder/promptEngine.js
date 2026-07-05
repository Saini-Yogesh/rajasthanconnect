import { callGroq } from "./groqClient.js";

function fillTemplate(template, vars) {
  let out = template;
  for (const [key, val] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), val ?? "");
  }
  out = out.replace(/\{\{#if \w+\}\}[\s\S]*?\{\{\/if\}\}/g, "");
  return out.trim();
}

function formatContext(record, dataset) {
  const parts = [];
  for (const field of dataset.contextFields || []) {
    const val = record[field];
    if (val == null || val === "") continue;
    if (Array.isArray(val)) {
      parts.push(`${field}: ${val.join(", ")}`);
    } else if (typeof val === "object") {
      parts.push(`${field}: ${JSON.stringify(val)}`);
    } else {
      parts.push(`${field}: ${val}`);
    }
  }
  if (dataset.hints) parts.push(`Photo hints: ${dataset.hints}`);
  if (configPromptTuning) {
    parts.push(`Style: ${configPromptTuning.photographyStyle}`);
    parts.push(`Region: ${configPromptTuning.region}`);
  }
  return parts.join("\n");
}

let configPromptTuning = null;

export function setPromptTuning(tuning) {
  configPromptTuning = tuning;
}

/**
 * Ask Groq for tuned Pexels search queries + alt text for one record.
 */
export async function generateImagePrompt(record, dataset, config) {
  const name = record[dataset.nameField] || record.id;
  const city =
    (dataset.cityField && record[dataset.cityField]) ||
    record.city ||
    record.location ||
    record.origin ||
    "";

  const userPrompt = fillTemplate(config.userPromptTemplate, {
    category: dataset.category,
    name,
    id: record.id,
    city,
    context: formatContext(record, dataset),
  });

  const raw = await callGroq(
    [
      { role: "system", content: config.systemPrompt },
      { role: "user", content: userPrompt },
    ],
    config.groq,
    config.rateLimit
  );

  if (!raw) throw new Error("Empty Groq response");

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Groq returned non-JSON: ${raw.slice(0, 120)}`);
    parsed = JSON.parse(match[0]);
  }

  return {
    pexels_query: parsed.pexels_query || parsed.search_query || name,
    alt_text: parsed.alt_text || `${name}, Rajasthan`,
    visual_focus: parsed.visual_focus || "",
    negative_keywords: parsed.negative_keywords || [],
    confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.7,
  };
}
