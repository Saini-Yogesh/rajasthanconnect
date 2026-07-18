/**
 * db-sync.js — Syncs JSON data files with actual Supabase database.
 * 
 * What it does:
 * 1. Queries the database for all IDs in every table
 * 2. Compares with local JSON files
 * 3. Removes entries from JSON that no longer exist in DB
 * 4. Reports what was removed
 * 5. Regenerates the sitemap.xml based on corrected JSON files
 * 
 * Run: node backend/config/db-sync.js
 */

import "../configEnv.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { supabase } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GENERATED_DATA_DIR = path.join(__dirname, "..", "Rajasthan data", "generated");

// Maps table_name -> { jsonFile, urlPrefix }
const TABLE_MAP = [
  { table: "attire",                 file: "attire.json",                    prefix: "/attire" },
  { table: "cities",                 file: "cities.json",                    prefix: "/cities" },
  { table: "communities_tribes",     file: "communities_tribes.json",        prefix: "/communities" },
  { table: "districts",              file: "districts.json",                 prefix: "/districts" },
  { table: "dynasties",              file: "dynasties.json",                 prefix: "/dynasties" },
  { table: "festivals",              file: "festivals.json",                 prefix: "/festivals" },
  { table: "folk_arts",              file: "folk_arts.json",                 prefix: "/folk-arts" },
  { table: "folk_music_instruments", file: "folk_music_instruments.json",   prefix: "/folk-music" },
  { table: "foods",                  file: "foods.json",                     prefix: "/foods" },
  { table: "handicrafts",            file: "handicrafts.json",               prefix: "/handicrafts" },
  { table: "historical_events",      file: "historical_events.json",         prefix: "/events" },
  { table: "history_rulers",         file: "history_rulers.json",            prefix: "/rulers" },
  { table: "places",                 file: "places.json",                    prefix: "/places" },
  { table: "royal_wedding_venues",   file: "royal_wedding_venues.json",      prefix: "/royal-weddings" },
  { table: "unesco_sites",           file: "unesco_sites.json",              prefix: "/unesco-sites" },
  { table: "unique_experiences",     file: "unique_experiences.json",        prefix: "/experiences" },
  { table: "directory_listings",     file: "directory_listings.json",        prefix: "/directory" },
  { table: "languages",              file: "languages.json",                 prefix: "/languages" },
];

async function getDbIds(tableName) {
  const { data, error } = await supabase.from(tableName).select("id");
  if (error) {
    console.error(`  ❌ Failed to query ${tableName}:`, error.message);
    return null;
  }
  return new Set(data.map((r) => r.id));
}

function loadJson(filename) {
  const filePath = path.join(GENERATED_DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function saveJson(filename, data) {
  const filePath = path.join(GENERATED_DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function run() {
  console.log("🔄 Syncing JSON files with actual database...\n");

  const report = [];
  const sitemapUrls = [];
  const SITE = "https://www.rajasthanconnect.in";
  const TODAY = new Date().toISOString().slice(0, 10);

  for (const entry of TABLE_MAP) {
    console.log(`📋 Checking ${entry.table}...`);

    const dbIds = await getDbIds(entry.table);
    if (!dbIds) {
      console.log(`  ⚠️  Skipping ${entry.table} (DB error)\n`);
      continue;
    }

    const jsonData = loadJson(entry.file);
    if (!jsonData) {
      console.log(`  ⚠️  No JSON file found: ${entry.file}\n`);
      continue;
    }

    const jsonIds = jsonData.map((r) => r.id);
    const removed = [];
    const kept = [];

    for (const item of jsonData) {
      if (dbIds.has(item.id)) {
        kept.push(item);
        // Add to sitemap
        sitemapUrls.push(`  <url>
    <loc>${SITE}${entry.prefix}/${item.id}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
      } else {
        removed.push(item.id);
      }
    }

    if (removed.length > 0) {
      console.log(`  ✂️  Removed ${removed.length} items not in DB: ${removed.join(", ")}`);
      saveJson(entry.file, kept);
      report.push({ table: entry.table, file: entry.file, removed });
    } else {
      console.log(`  ✅ All ${kept.length} items match DB`);
    }

    // Check for DB items not in JSON
    const extraInDb = [...dbIds].filter((id) => !jsonIds.includes(id));
    if (extraInDb.length > 0) {
      console.log(`  ⚠️  ${extraInDb.length} DB items not in JSON (need manual add): ${extraInDb.slice(0, 5).join(", ")}${extraInDb.length > 5 ? "..." : ""}`);
    }

    console.log("");
  }

  // Write updated sitemap
  const STATIC_ROUTES = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/cities", priority: "0.9", changefreq: "weekly" },
    { path: "/places", priority: "0.9", changefreq: "weekly" },
    { path: "/districts", priority: "0.8", changefreq: "monthly" },
    { path: "/foods", priority: "0.9", changefreq: "weekly" },
    { path: "/festivals", priority: "0.9", changefreq: "weekly" },
    { path: "/history-culture", priority: "0.8", changefreq: "weekly" },
    { path: "/dynasties", priority: "0.8", changefreq: "monthly" },
    { path: "/events", priority: "0.8", changefreq: "monthly" },
    { path: "/handicrafts", priority: "0.8", changefreq: "weekly" },
    { path: "/folk-arts", priority: "0.8", changefreq: "weekly" },
    { path: "/folk-music", priority: "0.8", changefreq: "weekly" },
    { path: "/attire", priority: "0.7", changefreq: "monthly" },
    { path: "/languages", priority: "0.7", changefreq: "monthly" },
    { path: "/communities", priority: "0.7", changefreq: "monthly" },
    { path: "/experiences", priority: "0.8", changefreq: "weekly" },
    { path: "/unesco-sites", priority: "0.8", changefreq: "monthly" },
    { path: "/royal-weddings", priority: "0.7", changefreq: "monthly" },
    { path: "/directory", priority: "0.9", changefreq: "daily" },
    { path: "/directory/register", priority: "0.8", changefreq: "monthly" },
    { path: "/planner", priority: "0.8", changefreq: "monthly" },
    { path: "/ai-assistant", priority: "0.8", changefreq: "monthly" },
    { path: "/feedback", priority: "0.7", changefreq: "monthly" },
  ];

  const staticXml = STATIC_ROUTES.map(
    (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticXml,
    ...sitemapUrls,
    "</urlset>",
    "",
  ].join("\n");

  const sitemapPath = path.join(__dirname, "..", "..", "public", "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf-8");
  console.log(`\n✅ Sitemap written with ${sitemapUrls.length + staticXml.length} URLs → public/sitemap.xml`);

  // Summary report
  if (report.length > 0) {
    console.log("\n📊 SYNC REPORT — Items removed from JSON files (not in DB):");
    for (const r of report) {
      console.log(`  📁 ${r.file}: removed [${r.removed.join(", ")}]`);
    }
  } else {
    console.log("\n🎉 All JSON files are in sync with the database!");
  }

  process.exit(0);
}

run().catch((err) => {
  console.error("❌ db-sync failed:", err);
  process.exit(1);
});
