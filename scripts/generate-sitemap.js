/**
 * Generates public/sitemap.xml with all static + dynamic routes for Google indexing.
 * Run automatically before `npm run build`.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "backend", "Rajasthan data", "generated");
const OUT = path.join(ROOT, "public", "sitemap.xml");
const SITE = "https://www.rajasthanconnect.in";
const TODAY = new Date().toISOString().slice(0, 10);

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
  { path: "/planner", priority: "0.8", changefreq: "monthly" },
  { path: "/ai-assistant", priority: "0.8", changefreq: "monthly" },
  { path: "/feedback", priority: "0.7", changefreq: "monthly" },
];

const DYNAMIC_ROUTES = [
  { file: "cities.json", prefix: "/cities", priority: "0.8", changefreq: "weekly" },
  { file: "places.json", prefix: "/places", priority: "0.8", changefreq: "weekly" },
  { file: "foods.json", prefix: "/foods", priority: "0.7", changefreq: "monthly" },
  { file: "festivals.json", prefix: "/festivals", priority: "0.8", changefreq: "weekly" },
  { file: "handicrafts.json", prefix: "/handicrafts", priority: "0.7", changefreq: "monthly" },
  { file: "folk_arts.json", prefix: "/folk-arts", priority: "0.7", changefreq: "monthly" },
  { file: "folk_music_instruments.json", prefix: "/folk-music", priority: "0.7", changefreq: "monthly" },
  { file: "attire.json", prefix: "/attire", priority: "0.6", changefreq: "monthly" },
  { file: "communities_tribes.json", prefix: "/communities", priority: "0.6", changefreq: "monthly" },
  { file: "unique_experiences.json", prefix: "/experiences", priority: "0.7", changefreq: "monthly" },
  { file: "unesco_sites.json", prefix: "/unesco-sites", priority: "0.8", changefreq: "monthly" },
  { file: "royal_wedding_venues.json", prefix: "/royal-weddings", priority: "0.6", changefreq: "monthly" },
  { file: "history_rulers.json", prefix: "/rulers", priority: "0.7", changefreq: "monthly" },
];

function loadIds(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[sitemap] Missing data file: ${filename}`);
    return [];
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return data.map((item) => item.id).filter(Boolean);
  } catch (err) {
    console.warn(`[sitemap] Failed to read ${filename}:`, err.message);
    return [];
  }
}

function loadCultureIds() {
  const files = ["folk_arts.json", "handicrafts.json", "attire.json", "cultural_etiquette.json"];
  const ids = new Set();
  for (const file of files) {
    loadIds(file).forEach((id) => ids.add(id));
  }
  return [...ids];
}

function entry(loc, priority, changefreq) {
  return [
    "  <url>",
    `    <loc>${loc}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

const urls = [];

for (const route of STATIC_ROUTES) {
  urls.push(entry(`${SITE}${route.path === "/" ? "/" : route.path}`, route.priority, route.changefreq));
}

for (const route of DYNAMIC_ROUTES) {
  const ids = loadIds(route.file);
  for (const id of ids) {
    urls.push(entry(`${SITE}${route.prefix}/${id}`, route.priority, route.changefreq));
  }
}

for (const id of loadCultureIds()) {
  urls.push(entry(`${SITE}/culture/${id}`, "0.6", "monthly"));
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

fs.writeFileSync(OUT, xml, "utf8");
console.log(`[sitemap] Wrote ${urls.length} URLs → public/sitemap.xml`);
