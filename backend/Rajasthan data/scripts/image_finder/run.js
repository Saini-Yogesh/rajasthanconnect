#!/usr/bin/env node
/**
 * Image Finder — Groq-tuned Pexels search for Rajasthan Connect JSON data
 *
 * Usage:
 *   node "Rajasthan data/scripts/image_finder/run.js" --dataset=cities --limit=5 --dry-run
 *   node "Rajasthan data/scripts/image_finder/run.js" --dataset=attire
 *   node "Rajasthan data/scripts/image_finder/run.js" --all --limit=20
 *   node "Rajasthan data/scripts/image_finder/run.js" --dataset=places --force
 *   node "Rajasthan data/scripts/image_finder/run.js" --dataset=cities --retry-failed
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateImagePrompt, setPromptTuning } from "./promptEngine.js";
import { findImage } from "./imageProviders.js";
import { isGroqConfigured, getGroqKeyCount } from "./groqClient.js";
import { isPexelsConfigured, getPexelsKeyCount } from "./pexelsClient.js";
import { isRateLimitError, sleep } from "./rateLimit.js";
import {
  DATA_DIR,
  REPORT_DIR,
  parseArgs,
  readJson,
  writeJson,
  recordNeedsImage,
  setRecordImage,
  getRecordImages,
  getSkipReason,
  isAcceptableTargetUrl,
  getFailedIdsFromReports,
  verifyUrl,
} from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));

setPromptTuning(config.promptTuning);

function printHelp() {
  console.log(`
Rajasthan Connect — Image Finder (Pexels)

Options:
  --dataset=<key>   Process one dataset (cities, places, foods, attire, ...)
  --all             Process all datasets in config.json
  --limit=N         Max records per dataset (default: all)
  --dry-run         Preview without writing JSON files
  --force           Replace ALL existing URLs (re-fetch every image)
  --retry-failed    Only retry records that failed/rate-limited last run
  --verify          HEAD-check existing URLs before skipping
  --skip-groq       Use name + hints only (no Groq API call)

Re-run behaviour:
  • Normal run     → replaces any missing or Unsplash URL; keeps Pexels URLs
  • --retry-failed → picks up only errors from the last report
  • --force        → regenerates every image again

Env (backend/.env):
  GROQ_API_KEY          Required for prompt tuning
  PEXELS_API_KEY        Required (default provider)
  PEXELS_API_KEY_1…10   Extra Pexels keys — auto-rotates on rate limit

Examples:
  npm run images:find -- --dataset=cities --limit=3 --dry-run
  npm run images:find -- --dataset=cities --retry-failed
  npm run images:find -- --dataset=handicrafts --force
`);
}

function buildFallbackPrompt(record, dataset) {
  const name = record[dataset.nameField] || record.id;
  const city =
    (dataset.cityField && record[dataset.cityField]) ||
    record.city ||
    record.origin ||
    "";
  const base = [name, city, "Rajasthan", "India"].filter(Boolean).join(" ");
  return {
    pexels_query: base,
    alt_text: `${name}, Rajasthan`,
    visual_focus: dataset.hints || "",
    negative_keywords: [],
    confidence: 0.5,
  };
}

async function processRecord(record, dataset, options) {
  const name = record[dataset.nameField] || record.id;

  if (!options.force && !options.retryFailed) {
    const needs = recordNeedsImage(record, dataset);
    if (!needs && !options.verify) {
      return { status: "skipped", id: record.id, name, reason: getSkipReason(record, dataset) };
    }
    if (!needs && options.verify) {
      const urls = getRecordImages(record, dataset);
      const ok = await Promise.all(urls.map(verifyUrl));
      if (ok.every(Boolean)) {
        return { status: "skipped", id: record.id, name, reason: getSkipReason(record, dataset) };
      }
    }
  }

  let promptResult;
  if (options.skipGroq) {
    promptResult = buildFallbackPrompt(record, dataset);
  } else {
    promptResult = await generateImagePrompt(record, dataset, config);
    await sleep(config.groq.delayMs || 2000);
  }

  const image = await findImage(promptResult, config);
  if (!image?.url || !isAcceptableTargetUrl(image.url)) {
    return {
      status: "failed",
      id: record.id,
      name,
      query: promptResult.pexels_query,
      reason: "no_results",
    };
  }

  return {
    status: "found",
    id: record.id,
    name,
    oldUrl: getRecordImages(record, dataset)[0] || null,
    newUrl: image.url,
    query: promptResult.pexels_query,
    alt_text: promptResult.alt_text,
    provider: image.provider,
    photographer: image.photographer,
  };
}

async function processDataset(datasetKey, options) {
  const dataset = config.datasets.find((d) => d.key === datasetKey);
  if (!dataset) {
    console.error(`Unknown dataset: ${datasetKey}`);
    console.error(`Available: ${config.datasets.map((d) => d.key).join(", ")}`);
    process.exit(1);
  }

  const filePath = path.join(DATA_DIR, dataset.file);
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return { dataset: datasetKey, processed: 0, results: [] };
  }

  const records = readJson(filePath);
  if (!Array.isArray(records)) {
    console.error(`${dataset.file} is not a JSON array`);
    return { dataset: datasetKey, processed: 0, results: [] };
  }

  let failedFilter = null;
  if (options.retryFailed) {
    failedFilter = getFailedIdsFromReports(datasetKey);
    if (!failedFilter?.ids?.size) {
      console.log(`\n📷 ${dataset.key} — no failed records in last report, processing missing URLs only`);
    } else {
      console.log(`\n📷 ${dataset.key} — retrying ${failedFilter.ids.size} failed from ${failedFilter.reportFile}`);
    }
  }

  const toProcess = records.filter((r) => {
    if (options.force) return true;
    if (options.retryFailed && failedFilter?.ids?.has(r.id)) return true;
    if (options.retryFailed && failedFilter?.ids?.size) return false;
    return recordNeedsImage(r, dataset);
  });

  const slice = toProcess.slice(0, options.limit);
  console.log(`\n📷 ${dataset.key} (${dataset.file}) — ${slice.length} to process, ${records.length} total`);

  const results = [];
  let updated = 0;

  for (const record of slice) {
    try {
      const result = await processRecord(record, dataset, options);
      results.push(result);

      if (result.status === "found") {
        console.log(`  ✓ ${result.name}: ${result.query}`);
        console.log(`    → ${result.newUrl.slice(0, 80)}...`);
        if (!options.dryRun) {
          setRecordImage(record, dataset, result.newUrl);
          updated++;
          writeJson(filePath, records);
        }
      } else if (result.status === "skipped") {
        console.log(`  − skip ${result.name} (${result.reason})`);
      } else {
        console.log(`  ✗ ${result.name}: ${result.reason} [${result.query}]`);
      }
    } catch (err) {
      const rateLimited = isRateLimitError(err);
      const msg = err.message || String(err);
      console.log(`  ✗ ${record.id}: ${msg}${rateLimited ? " (will retry on --retry-failed)" : ""}`);
      results.push({
        status: rateLimited ? "rate_limited" : "error",
        id: record.id,
        name: record[dataset.nameField] || record.id,
        error: msg,
      });
      if (rateLimited) {
        console.log(`  ⏸ Pausing 15s after rate limit...`);
        await sleep(15000);
      }
    }
  }

  if (updated > 0 && !options.dryRun) {
    console.log(`  💾 Saved ${updated} updates to ${dataset.file}`);
  }

  return { dataset: datasetKey, file: dataset.file, processed: slice.length, updated, results };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  if (!options.skipGroq && !isGroqConfigured()) {
    console.error("GROQ_API_KEY missing in backend/.env (or use --skip-groq)");
    process.exit(1);
  }

  if (!isPexelsConfigured()) {
    console.error("No PEXELS_API_KEY or PEXELS_API_KEY_N found in backend/.env");
    process.exit(1);
  }

  let datasets = [];
  if (options.all) {
    datasets = config.datasets.map((d) => d.key);
  } else if (options.dataset) {
    datasets = [options.dataset];
  } else {
    printHelp();
    process.exit(1);
  }

  const mode = options.force ? "force" : options.retryFailed ? "retry-failed" : "resume";
  const groqInfo = !options.skipGroq ? `, groq keys: ${getGroqKeyCount()}` : "";
  console.log(
    `Image Finder — provider: pexels, mode: ${mode}, pexels keys: ${getPexelsKeyCount()}${groqInfo}${options.dryRun ? " (dry-run)" : ""}`
  );

  const summary = [];
  for (const key of datasets) {
    summary.push(await processDataset(key, options));
  }

  if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const reportPath = path.join(REPORT_DIR, `run-${stamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify({ options, summary }, null, 2));

  const allResults = summary.flatMap((s) => s.results || []);
  const found = allResults.filter((r) => r.status === "found").length;
  const failed = allResults.filter((r) => r.status === "failed" || r.status === "error").length;
  const rateLimited = allResults.filter((r) => r.status === "rate_limited").length;
  const skipped = allResults.filter((r) => r.status === "skipped").length;

  console.log(`\nDone — found: ${found}, failed: ${failed}, rate-limited: ${rateLimited}, skipped: ${skipped}`);
  if (failed + rateLimited > 0) {
    console.log(`Tip: run again with --retry-failed to continue where it stopped`);
  }
  console.log(`Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
