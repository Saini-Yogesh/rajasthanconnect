/**
 * verify-urls.mjs
 * Reads Google Search Console Table.csv, extracts every URL path,
 * checks each one against the actual JSON data files,
 * and reports: VALID, MISSING (not in JSON), or STATIC (page-level route).
 * 
 * Run: node scripts/verify-urls.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'backend', 'Rajasthan data', 'generated');
const GSC_CSV = 'C:\\Users\\yoges\\Downloads\\https___www.rajasthanconnect.in_-Coverage-Drilldown-2026-07-19\\Table.csv';

// Map route prefix → JSON file with id field
const ROUTE_MAP = {
  '/attire':         'attire.json',
  '/cities':         'cities.json',
  '/communities':    'communities_tribes.json',
  '/culture':        null, // culture/:id spans multiple files
  '/directory':      'directory_listings.json',
  '/districts':      'districts.json',
  '/experiences':    'unique_experiences.json',
  '/festivals':      'festivals.json',
  '/folk-arts':      'folk_arts.json',
  '/folk-music':     'folk_music_instruments.json',
  '/foods':          'foods.json',
  '/handicrafts':    'handicrafts.json',
  '/places':         'places.json',
  '/royal-weddings': 'royal_wedding_venues.json',
  '/rulers':         'history_rulers.json',
  '/unesco-sites':   'unesco_sites.json',
};

const CULTURE_FILES = ['folk_arts.json', 'handicrafts.json', 'attire.json', 'cultural_etiquette.json'];

const STATIC_PAGES = new Set([
  '/', '/cities', '/places', '/districts', '/foods', '/festivals',
  '/history-culture', '/dynasties', '/events', '/handicrafts',
  '/folk-arts', '/folk-music', '/attire', '/languages', '/communities',
  '/experiences', '/unesco-sites', '/royal-weddings', '/directory',
  '/directory/register', '/planner', '/ai-assistant', '/feedback',
]);

function loadIds(filename) {
  if (!filename) return new Set();
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) return new Set();
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return new Set(data.map((item) => item.id).filter(Boolean));
  } catch {
    return new Set();
  }
}

const idSets = {};
for (const [prefix, file] of Object.entries(ROUTE_MAP)) {
  if (file) idSets[prefix] = loadIds(file);
}
const cultureIds = new Set();
for (const f of CULTURE_FILES) loadIds(f).forEach((id) => cultureIds.add(id));
idSets['/culture'] = cultureIds;

const csvLines = fs.readFileSync(GSC_CSV, 'utf8').split('\n').slice(1);

const results = { valid: [], missing: [], static: [], unknown: [] };

for (const line of csvLines) {
  const url = line.split(',')[0].trim();
  if (!url) continue;
  const urlPath = url.replace('https://www.rajasthanconnect.in', '');
  if (STATIC_PAGES.has(urlPath)) { results.static.push(urlPath); continue; }
  let matched = false;
  for (const prefix of Object.keys(ROUTE_MAP)) {
    if (urlPath.startsWith(prefix + '/')) {
      const slug = urlPath.replace(prefix + '/', '');
      const ids = idSets[prefix];
      if (ids && ids.has(slug)) {
        results.valid.push(urlPath);
      } else {
        results.missing.push({ urlPath, prefix, slug, file: ROUTE_MAP[prefix] });
      }
      matched = true;
      break;
    }
  }
  if (!matched) results.unknown.push(urlPath);
}

console.log('='.repeat(60));
console.log('📊 URL VERIFICATION REPORT');
console.log('='.repeat(60));
console.log(`✅ VALID (in JSON data):     ${results.valid.length}`);
console.log(`⚠️  MISSING (not in JSON):   ${results.missing.length}`);
console.log(`📄 STATIC list/nav pages:   ${results.static.length}`);
console.log(`❓ UNKNOWN routes:           ${results.unknown.length}`);

if (results.missing.length > 0) {
  console.log('\n⚠️  MISSING URLs (in GSC but NOT in local JSON):');
  const byPrefix = {};
  for (const m of results.missing) {
    if (!byPrefix[m.prefix]) byPrefix[m.prefix] = [];
    byPrefix[m.prefix].push(m);
  }
  for (const [prefix, items] of Object.entries(byPrefix)) {
    console.log(`\n  [${prefix}] — file: ${ROUTE_MAP[prefix] || 'multiple files'}:`);
    for (const item of items) console.log(`    ❌ ${item.urlPath}  (id="${item.slug}")`);
  }
}
if (results.unknown.length > 0) {
  console.log('\n❓ UNKNOWN routes:');
  for (const u of results.unknown) console.log(`  ? ${u}`);
}

const reportPath = path.join(__dirname, '..', 'url-verification-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📁 Full report → url-verification-report.json`);
