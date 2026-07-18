/**
 * patch-sitemap.mjs — Reads all JSON data files and patches the sitemap.xml
 * This is a fallback for when npm/node cannot be run via shell.
 * 
 * Run: node scripts/patch-sitemap.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'backend', 'Rajasthan data', 'generated');
const SITEMAP_OUT = path.join(__dirname, '..', 'public', 'sitemap.xml');
const SITE = 'https://www.rajasthanconnect.in';
const TODAY = new Date().toISOString().slice(0, 10);

const STATIC_ROUTES = [
  { path: '/',                  priority: '1.0', changefreq: 'daily' },
  { path: '/cities',            priority: '0.9', changefreq: 'weekly' },
  { path: '/places',            priority: '0.9', changefreq: 'weekly' },
  { path: '/districts',         priority: '0.8', changefreq: 'monthly' },
  { path: '/foods',             priority: '0.9', changefreq: 'weekly' },
  { path: '/festivals',         priority: '0.9', changefreq: 'weekly' },
  { path: '/history-culture',   priority: '0.8', changefreq: 'weekly' },
  { path: '/dynasties',         priority: '0.8', changefreq: 'monthly' },
  { path: '/events',            priority: '0.7', changefreq: 'monthly' },
  { path: '/handicrafts',       priority: '0.8', changefreq: 'weekly' },
  { path: '/folk-arts',         priority: '0.8', changefreq: 'weekly' },
  { path: '/folk-music',        priority: '0.8', changefreq: 'weekly' },
  { path: '/attire',            priority: '0.7', changefreq: 'monthly' },
  { path: '/languages',         priority: '0.7', changefreq: 'monthly' },
  { path: '/communities',       priority: '0.7', changefreq: 'monthly' },
  { path: '/experiences',       priority: '0.8', changefreq: 'weekly' },
  { path: '/unesco-sites',      priority: '0.8', changefreq: 'monthly' },
  { path: '/royal-weddings',    priority: '0.7', changefreq: 'monthly' },
  { path: '/directory',         priority: '0.9', changefreq: 'daily' },
  { path: '/directory/register',priority: '0.8', changefreq: 'monthly' },
  { path: '/planner',           priority: '0.8', changefreq: 'monthly' },
  { path: '/ai-assistant',      priority: '0.8', changefreq: 'monthly' },
  { path: '/feedback',          priority: '0.7', changefreq: 'monthly' },
];

const DYNAMIC_ROUTES = [
  { file: 'cities.json',                  prefix: '/cities',         priority: '0.8', changefreq: 'weekly' },
  { file: 'places.json',                  prefix: '/places',         priority: '0.8', changefreq: 'weekly' },
  { file: 'foods.json',                   prefix: '/foods',          priority: '0.7', changefreq: 'monthly' },
  { file: 'festivals.json',               prefix: '/festivals',      priority: '0.8', changefreq: 'weekly' },
  { file: 'handicrafts.json',             prefix: '/handicrafts',    priority: '0.7', changefreq: 'monthly' },
  { file: 'folk_arts.json',               prefix: '/folk-arts',      priority: '0.7', changefreq: 'monthly' },
  { file: 'folk_music_instruments.json',  prefix: '/folk-music',     priority: '0.7', changefreq: 'monthly' },
  { file: 'attire.json',                  prefix: '/attire',         priority: '0.6', changefreq: 'monthly' },
  { file: 'communities_tribes.json',      prefix: '/communities',    priority: '0.6', changefreq: 'monthly' },
  { file: 'unique_experiences.json',      prefix: '/experiences',    priority: '0.7', changefreq: 'monthly' },
  { file: 'unesco_sites.json',            prefix: '/unesco-sites',   priority: '0.8', changefreq: 'monthly' },
  { file: 'royal_wedding_venues.json',    prefix: '/royal-weddings', priority: '0.6', changefreq: 'monthly' },
  // ✅ FIX: Added rulers — was missing before, Google couldn't index ruler pages
  { file: 'history_rulers.json',          prefix: '/rulers',         priority: '0.7', changefreq: 'monthly' },
  { file: 'directory_listings.json',      prefix: '/directory',      priority: '0.7', changefreq: 'weekly' },
  { file: 'districts.json',              prefix: '/districts',       priority: '0.7', changefreq: 'weekly' },
];

function loadIds(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[sitemap] Missing data file: ${filename}`);
    return [];
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data.map((item) => item.id).filter(Boolean);
  } catch (err) {
    console.warn(`[sitemap] Failed to read ${filename}:`, err.message);
    return [];
  }
}

function entry(loc, priority, changefreq) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${TODAY}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

const urls = [];

for (const route of STATIC_ROUTES) {
  urls.push(entry(`${SITE}${route.path}`, route.priority, route.changefreq));
}

for (const route of DYNAMIC_ROUTES) {
  const ids = loadIds(route.file);
  console.log(`  ${route.file}: ${ids.length} URLs → ${route.prefix}/:id`);
  for (const id of ids) {
    urls.push(entry(`${SITE}${route.prefix}/${id}`, route.priority, route.changefreq));
  }
}

// Culture pages (folk arts, handicrafts, attire also under /culture/:id for backwards compat)
const cultureFiles = ['folk_arts.json', 'handicrafts.json', 'attire.json'];
const cultureIds = new Set();
for (const file of cultureFiles) {
  loadIds(file).forEach((id) => cultureIds.add(id));
}
for (const id of cultureIds) {
  urls.push(entry(`${SITE}/culture/${id}`, '0.6', 'monthly'));
}
console.log(`  culture pages: ${cultureIds.size} URLs → /culture/:id`);

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(SITEMAP_OUT, xml, 'utf8');
console.log(`\n✅ Sitemap written: ${urls.length} total URLs → public/sitemap.xml`);
