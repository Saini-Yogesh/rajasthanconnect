import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, "..", "..", "generated");
export const REPORT_DIR = path.join(__dirname, "reports");

/** All known image field names across generated JSON files. */
export const IMAGE_FIELD_NAMES = ["image_url", "image_urls", "imageUrl"];

/** Detect legacy Unsplash URLs that need replacing. */
export function isUnsplashUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /unsplash\.com/i.test(url.trim());
}

export function isPexelsUrl(url) {
  if (!url || typeof url !== "string") return false;
  return /pexels\.com/i.test(url.trim());
}

/** Only accept Pexels URLs — never save Unsplash or invalid URLs. */
export function isAcceptableTargetUrl(url) {
  if (!url || typeof url !== "string" || !url.trim().startsWith("http")) return false;
  return isPexelsUrl(url);
}

function fieldsForRecord(record, dataset) {
  const configured = dataset?.imageFields || ["image_url"];
  return [...new Set([...configured, ...IMAGE_FIELD_NAMES])].filter(
    (f) => record[f] !== undefined || configured.includes(f)
  );
}

/** URLs that must be replaced: missing, non-http, Unsplash, or placeholder. */
export function needsImage(url) {
  if (!url || typeof url !== "string") return true;
  const u = url.trim();
  if (!u.startsWith("http")) return true;
  if (isUnsplashUrl(u)) return true;
  if (/\s/.test(u)) return true;
  if (/placeholder|via\.placeholder|picsum\.photos/i.test(u)) return true;
  return false;
}

export function getRecordImages(record, dataset) {
  const urls = [];
  for (const field of fieldsForRecord(record, dataset)) {
    const val = record[field];
    if (Array.isArray(val)) urls.push(...val.filter(Boolean));
    else if (val) urls.push(val);
  }
  return urls;
}

export function recordNeedsImage(record, dataset) {
  const urls = getRecordImages(record, dataset);
  if (!urls.length) return true;
  return urls.some((u) => needsImage(u));
}

export function getSkipReason(record, dataset) {
  const urls = getRecordImages(record, dataset);
  if (!urls.length) return "missing";
  if (urls.some(isUnsplashUrl)) return "unsplash_old";
  if (urls.every(isPexelsUrl)) return "has_pexels";
  return "has_url";
}

export function setRecordImage(record, dataset, url) {
  if (!isAcceptableTargetUrl(url)) {
    throw new Error(`Refusing to save non-Pexels or invalid URL: ${String(url).slice(0, 80)}`);
  }

  const fields = dataset.imageFields || ["image_url"];
  for (const field of fields) {
    if (Array.isArray(record[field])) {
      record[field] = [url];
    } else if (record[field] !== undefined || field === "image_url") {
      record[field] = url;
    }
  }

  // Clear stray legacy image URLs in other image fields on the same record
  for (const field of IMAGE_FIELD_NAMES) {
    if (fields.includes(field)) continue;
    const val = record[field];
    if (typeof val === "string" && !isPexelsUrl(val)) delete record[field];
    if (Array.isArray(val) && val.some((v) => !isPexelsUrl(v))) delete record[field];
  }
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function parseArgs(argv) {
  const args = {
    dataset: null,
    all: false,
    limit: Infinity,
    dryRun: false,
    force: false,
    verify: false,
    skipGroq: false,
    retryFailed: false,
    help: false,
  };

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (arg === "--all") args.all = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--force") args.force = true;
    else if (arg === "--verify") args.verify = true;
    else if (arg === "--skip-groq") args.skipGroq = true;
    else if (arg === "--retry-failed") args.retryFailed = true;
    else if (arg.startsWith("--dataset=")) args.dataset = arg.split("=")[1];
    else if (arg.startsWith("--limit=")) args.limit = parseInt(arg.split("=")[1], 10);
  }

  return args;
}

/** Load IDs that failed/rate-limited in the most recent report for a dataset. */
export function getFailedIdsFromReports(datasetKey) {
  if (!fs.existsSync(REPORT_DIR)) return null;
  const files = fs
    .readdirSync(REPORT_DIR)
    .filter((f) => f.startsWith("run-") && f.endsWith(".json"))
    .sort()
    .reverse();

  for (const file of files) {
    try {
      const report = JSON.parse(fs.readFileSync(path.join(REPORT_DIR, file), "utf8"));
      const entry = report.summary?.find((s) => s.dataset === datasetKey);
      if (!entry?.results?.length) continue;
      const failed = entry.results
        .filter((r) => r.status === "failed" || r.status === "error" || r.status === "rate_limited")
        .map((r) => r.id);
      if (failed.length) return { ids: new Set(failed), reportFile: file };
    } catch {
      /* skip corrupt report */
    }
  }
  return null;
}

export async function verifyUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    return res.ok;
  } catch {
    return false;
  }
}
