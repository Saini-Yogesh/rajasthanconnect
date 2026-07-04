import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DATA_PATH = path.join(__dirname, "..", "source");

function loadRawFile(filename) {
  const filePath = path.join(RAW_DATA_PATH, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Source file not found: ${filePath}`);
    return null;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "") // remove special chars
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}

const TABLES = {
  districts: {
    filename: "rajasthan_districts_and_cities.json",
    getItems: (data) => data.districts.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name) + "-district",
  },
  cities: {
    filename: "rajasthan_districts_and_cities.json",
    getItems: (data) => data.major_cities.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  places: {
    filename: null,
    getItems: () => {
      const items = [];
      const seenNames = new Set();

      const addPlace = (name, category) => {
        if (!name) return;
        const normalized = name.trim().toLowerCase();
        if (seenNames.has(normalized)) return;
        seenNames.add(normalized);
        items.push({ name: name.trim(), category });
      };

      // Forts & Palaces
      const fp = loadRawFile("rajasthan_forts_palaces.json");
      if (fp) {
        if (fp.forts) fp.forts.forEach((name) => addPlace(name, "Fort"));
        if (fp.palaces) fp.palaces.forEach((name) => addPlace(name, "Palace"));
      }

      // Temples
      const temples = loadRawFile("rajasthan_temples_religious_sites.json");
      if (temples) temples.forEach((name) => addPlace(name, "Temple"));

      // Lakes
      const lakes = loadRawFile("rajasthan_lakes_water_bodies.json");
      if (lakes) lakes.forEach((name) => addPlace(name, "Lake"));

      // Hills
      const hills = loadRawFile("rajasthan_hills_natural_attractions.json");
      if (hills) hills.forEach((name) => addPlace(name, "Hills & Nature"));

      // Wildlife
      const wl = loadRawFile("rajasthan_wildlife_national_parks.json");
      if (wl) {
        const keys = [
          "national_parks",
          "tiger_reserves",
          "wildlife_sanctuaries",
          "bird_sanctuaries",
        ];
        keys.forEach((k) => {
          if (wl[k]) wl[k].forEach((name) => addPlace(name, "Wildlife Reserve"));
        });
      }

      // Pilgrimage Sites
      const pilgrimage = loadRawFile("rajasthan_cultural_etiquette_pilgrimage.json");
      if (pilgrimage && pilgrimage.pilgrimage_sites) {
        pilgrimage.pilgrimage_sites.forEach((name) => addPlace(name, "Temple"));
      }

      return items;
    },
    getSlug: (item) => toSlug(item.name),
  },
  dynasties: {
    filename: "rajasthan_rajput_dynasties_kings.json",
    getItems: (data) => data.dynasties.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name.split(" ")[0]),
  },
  history_rulers: {
    filename: "rajasthan_rajput_dynasties_kings.json",
    getItems: (data) => data.kings.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  historical_events: {
    filename: "rajasthan_historical_events_legends.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  foods: {
    filename: "rajasthan_cuisines.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  festivals: {
    filename: "rajasthan_festivals.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  folk_arts: {
    filename: "rajasthan_folk_arts_attire.json",
    getItems: (data) => data.folk_arts.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  folk_music_instruments: {
    filename: "rajasthan_folk_music_instruments.json",
    getItems: (data) => {
      const items = [];
      if (data.folk_music)
        data.folk_music.forEach((name) => items.push({ name, category: "Vocal Style" }));
      if (data.instruments)
        data.instruments.forEach((name) => items.push({ name, category: "Instrument" }));
      return items;
    },
    getSlug: (item) => toSlug(item.name),
  },
  handicrafts: {
    filename: "rajasthan_handicrafts_traditional_crafts.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  attire: {
    filename: "rajasthan_folk_arts_attire.json",
    getItems: (data) => data.attire.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  languages: {
    filename: "rajasthan_languages.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  communities_tribes: {
    filename: "rajasthan_communities_tribes.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  cultural_etiquette: {
    filename: "rajasthan_cultural_etiquette_pilgrimage.json",
    getItems: (data) => data.cultural_etiquette.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  unesco_sites: {
    filename: "rajasthan_unesco_heritage_sites.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
  royal_wedding_venues: {
    filename: "rajasthan_royal_wedding_venues.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name) + "-venue",
  },
  unique_experiences: {
    filename: "rajasthan_unique_experiences.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
  },
};

console.log("🔍 Checking all tables for duplicate names/slugs...\n");

let grandTotalDuplicates = 0;

for (const [tableName, config] of Object.entries(TABLES)) {
  console.log(`📋 Analyzing table: "${tableName}"...`);
  let items = [];

  if (config.filename) {
    const fileData = loadRawFile(config.filename);
    if (!fileData) {
      console.log(`  ⚠️ Skipping "${tableName}": file not loaded.\n`);
      continue;
    }
    items = config.getItems(fileData);
  } else {
    items = config.getItems();
  }

  if (!items || !Array.isArray(items)) {
    console.log(`  ⚠️ Warning: No items extracted for table "${tableName}".\n`);
    continue;
  }

  console.log(`  Loaded ${items.length} items.`);

  const slugMap = new Map();
  const duplicates = [];

  for (const item of items) {
    const slug = config.getSlug(item);
    if (slugMap.has(slug)) {
      duplicates.push({
        slug,
        first: slugMap.get(slug),
        second: item,
      });
    } else {
      slugMap.set(slug, item);
    }
  }

  if (duplicates.length > 0) {
    console.error(`  ❌ Found ${duplicates.length} duplicate slug(s) in "${tableName}":`);
    duplicates.forEach((dup) => {
      console.error(`     - Slug: "${dup.slug}"`);
      console.error(`       1st entry name: "${dup.first.name}"`);
      console.error(`       2nd entry name: "${dup.second.name}"`);
    });
    grandTotalDuplicates += duplicates.length;
  } else {
    console.log(`  ✅ No duplicate slugs found in "${tableName}".`);
  }
  console.log("");
}

console.log("=======================================================");
console.log(`📊 DUPLICATE CHECK SUMMARY:`);
if (grandTotalDuplicates === 0) {
  console.log("   ✅ Clean! No duplicate slugs found in any raw data tables.");
} else {
  console.error(`   ❌ Found ${grandTotalDuplicates} total duplicate slugs. Please fix them in raw files.`);
}
console.log("=======================================================");
