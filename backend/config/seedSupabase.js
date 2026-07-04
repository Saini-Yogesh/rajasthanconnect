import "../configEnv.js";
import fs from "fs";
import { fileURLToPath } from "url";
import { supabase } from "./db.js";

// We need to resolve __dirname for ES Modules
import pathModule from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = pathModule.dirname(__filename);

const GENERATED_DATA_DIR = pathModule.join(
  __dirname,
  "..",
  "Rajasthan data",
  "generated",
);

function loadGeneratedFile(filename) {
  const filePath = pathModule.join(GENERATED_DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️ Warning: Seed file ${filename} not found.`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

async function wipeTable(tableName) {
  console.log(`🧹 Wiping table: ${tableName}...`);
  // Supabase delete with a match that touches everything
  const { error } = await supabase
    .from(tableName)
    .delete()
    .neq("created_at", "1970-01-01T00:00:00Z"); // matches all records

  if (error) {
    console.error(`❌ Error wiping ${tableName}:`, error.message);
    throw error;
  }
}

async function seedTable(tableName, data) {
  if (!data || data.length === 0) {
    console.log(`ℹ️ No records to seed for: ${tableName}`);
    return;
  }
  console.log(`📌 Seeding ${data.length} records into table: ${tableName}...`);

  const now = new Date().toISOString();

  // Insert in chunks of 50 to prevent size limit issues
  const chunkSize = 50;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    const chunkWithTimestamps = chunk.map((item) => {
      const timestamp = item.created_at || now;
      return {
        ...item,
        created_at: timestamp,
        updated_at: timestamp,
      };
    });

    const { error } = await supabase
      .from(tableName)
      .insert(chunkWithTimestamps);
    if (error) {
      console.error(`❌ Error seeding chunk in ${tableName}:`, error.message);
      console.error(
        "Failing chunk:",
        JSON.stringify(chunkWithTimestamps[0], null, 2),
      );
      throw error;
    }
  }
  console.log(`✅ Completed seeding for ${tableName}.`);
}

async function run() {
  console.log("🚀 Starting database seeding to Supabase...");

  // Order of tables to delete (children first)
  const deleteOrder = [
    "reviews",
    "directory_listings",
    "unique_experiences",
    "royal_wedding_venues",
    "historical_events",
    "history_rulers",
    "places",
    "cities",
    "districts",
    "handicrafts",
    "folk_arts",
    "folk_music_instruments",
    "attire",
    "languages",
    "communities_tribes",
    "cultural_etiquette",
    "unesco_sites",
    "dynasties",
    "festivals",
    "foods",
  ];

  for (const table of deleteOrder) {
    try {
      await wipeTable(table);
    } catch (e) {
      console.log(`⚠️ Continue execution despite wipe error on ${table}...`);
    }
  }

  console.log("\n🧹 Database tables cleaned. Starting insertion sequence...\n");

  // Ingestion mapping
  const tablesToSeed = [
    { name: "districts", file: "districts.json" },
    { name: "cities", file: "cities.json" },
    { name: "dynasties", file: "dynasties.json" },
    { name: "history_rulers", file: "history_rulers.json" },
    { name: "places", file: "places.json" },
    { name: "historical_events", file: "historical_events.json" },
    { name: "unesco_sites", file: "unesco_sites.json" },
    { name: "royal_wedding_venues", file: "royal_wedding_venues.json" },
    { name: "unique_experiences", file: "unique_experiences.json" },
    { name: "foods", file: "foods.json" },
    { name: "festivals", file: "festivals.json" },
    { name: "folk_arts", file: "folk_arts.json" },
    { name: "folk_music_instruments", file: "folk_music_instruments.json" },
    { name: "handicrafts", file: "handicrafts.json" },
    { name: "attire", file: "attire.json" },
    { name: "languages", file: "languages.json" },
    { name: "communities_tribes", file: "communities_tribes.json" },
    { name: "cultural_etiquette", file: "cultural_etiquette.json" },
    { name: "directory_listings", file: "directory_listings.json" },
    { name: "reviews", file: "reviews.json" },
  ];

  const validDistricts = new Set();
  const validCities = new Set();
  const validDynasties = new Set();
  const validPlaces = new Set();

  for (const tableConfig of tablesToSeed) {
    const rawData = loadGeneratedFile(tableConfig.file);
    
    // Sanitize foreign keys to prevent constraint violations
    const sanitizedData = rawData.map(item => {
      const copy = { ...item };
      
      // 1. Sanitize history_rulers -> dynasty_id references dynasties(id)
      if (tableConfig.name === "history_rulers") {
        if (copy.dynasty_id && !validDynasties.has(copy.dynasty_id)) {
          copy.dynasty_id = null;
        }
      }

      // 2. Sanitize cities -> district_id references districts(id)
      if (tableConfig.name === "cities") {
        if (copy.district_id && !validDistricts.has(copy.district_id)) {
          copy.district_id = null;
        }
      }

      // 3. Sanitize places -> city_id and district_id references cities(id) and districts(id)
      if (tableConfig.name === "places") {
        if (copy.city_id && !validCities.has(copy.city_id)) {
          copy.city_id = null;
        }
        if (copy.district_id && !validDistricts.has(copy.district_id)) {
          copy.district_id = null;
        }
      }

      // 4. Sanitize historical_events -> location_place_id references places(id)
      if (tableConfig.name === "historical_events") {
        if (copy.location_place_id && !validPlaces.has(copy.location_place_id)) {
          copy.location_place_id = null;
        }
      }

      // 5. Sanitize royal_wedding_venues -> location_place_id references places(id)
      if (tableConfig.name === "royal_wedding_venues") {
        if (copy.location_place_id && !validPlaces.has(copy.location_place_id)) {
          copy.location_place_id = null;
        }
      }

      // 6. Sanitize unique_experiences -> location_place_id references places(id)
      if (tableConfig.name === "unique_experiences") {
        if (copy.location_place_id && !validPlaces.has(copy.location_place_id)) {
          copy.location_place_id = null;
        }
      }

      // 7. Sanitize handicrafts -> origin_city_id references cities(id)
      if (tableConfig.name === "handicrafts") {
        if (copy.origin_city_id && !validCities.has(copy.origin_city_id)) {
          copy.origin_city_id = null;
        }
      }

      // 8. Sanitize directory_listings -> city_id references cities(id)
      if (tableConfig.name === "directory_listings") {
        if (copy.city_id && !validCities.has(copy.city_id)) {
          copy.city_id = null;
        }
      }

      return copy;
    });

    await seedTable(tableConfig.name, sanitizedData);

    // Track seeded primary keys for subsequent tables
    if (tableConfig.name === "districts") {
      sanitizedData.forEach((item) => validDistricts.add(item.id));
    } else if (tableConfig.name === "cities") {
      sanitizedData.forEach((item) => validCities.add(item.id));
    } else if (tableConfig.name === "dynasties") {
      sanitizedData.forEach((item) => validDynasties.add(item.id));
    } else if (tableConfig.name === "places") {
      sanitizedData.forEach((item) => validPlaces.add(item.id));
    }
  }

  console.log("\n🎉 Seeding successfully completed!");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
