import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "generated");

console.log("🔍 Starting validation of all 20 generated JSON files...\n");

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
const dataMap = {};
let totalErrors = 0;
let totalWarnings = 0;

// Helper to log errors
function logError(file, message) {
  console.error(`❌ [${file}]: ${message}`);
  totalErrors++;
}

// Helper to log warnings
function logWarning(file, message) {
  console.warn(`⚠️ [${file}]: ${message}`);
  totalWarnings++;
}

// 1. Load and parse all JSON files
for (const file of files) {
  const tableName = path.basename(file, ".json");
  const filePath = path.join(DATA_DIR, file);
  
  try {
    const rawContent = fs.readFileSync(filePath, "utf-8");
    dataMap[tableName] = JSON.parse(rawContent);
  } catch (err) {
    logError(file, `Failed to parse JSON file: ${err.message}`);
    dataMap[tableName] = [];
  }
}

// 2. Perform validation checks
const allCityIds = new Set(dataMap.cities?.map((c) => c.id) || []);
const allDistrictIds = new Set(dataMap.districts?.map((d) => d.id) || []);
const allPlaceIds = new Set(dataMap.places?.map((p) => p.id) || []);

for (const [tableName, records] of Object.entries(dataMap)) {
  const file = `${tableName}.json`;
  
  if (!Array.isArray(records)) {
    logError(file, "Root element is not a JSON Array!");
    continue;
  }

  console.log(`📋 Checking "${tableName}" (${records.length} records)...`);
  
  const idSet = new Set();
  
  for (let idx = 0; idx < records.length; idx++) {
    const record = records[idx];
    const prefix = `Record #${idx + 1} (${record.id || "NO ID"})`;

    // ID Checks
    if (!record.id) {
      logError(file, `${prefix} is missing the "id" key.`);
    } else {
      if (idSet.has(record.id)) {
        logError(file, `${prefix} has duplicate id "${record.id}".`);
      }
      idSet.add(record.id);
    }

    // Coordinate Boundaries (Rajasthan bounds: Lat 23 to 30, Lng 69 to 79)
    if (record.map_coords) {
      const coords = record.map_coords;
      if (typeof coords.lat !== "number" || typeof coords.lng !== "number") {
        logError(file, `${prefix} has non-numeric coordinates: lat=${coords.lat}, lng=${coords.lng}`);
      } else {
        if (coords.lat < 23 || coords.lat > 30 || coords.lng < 69 || coords.lng > 79) {
          logWarning(file, `${prefix} coordinates might be outside Rajasthan: lat=${coords.lat}, lng=${coords.lng}`);
        }
      }
    }

    // Coordinates in directory listings (if present)
    if (record.latitude !== undefined || record.longitude !== undefined) {
      if (typeof record.latitude !== "number" || typeof record.longitude !== "number") {
        logError(file, `${prefix} has non-numeric lat/lng fields.`);
      }
    }

    // Foreign Key: city_id
    if (record.city_id !== undefined && record.city_id !== null) {
      if (!allCityIds.has(record.city_id)) {
        logError(file, `${prefix} has invalid city_id Reference: "${record.city_id}"`);
      }
    }

    // Foreign Key: related_city_ids
    if (Array.isArray(record.related_city_ids)) {
      record.related_city_ids.forEach((cId) => {
        if (!allCityIds.has(cId)) {
          logError(file, `${prefix} has invalid city reference in related_city_ids: "${cId}"`);
        }
      });
    }

    // Foreign Key: district_id
    if (record.district_id !== undefined && record.district_id !== null) {
      if (!allDistrictIds.has(record.district_id)) {
        logError(file, `${prefix} has invalid district_id Reference: "${record.district_id}"`);
      }
    }

    // Foreign Key: place_id
    if (record.place_id !== undefined && record.place_id !== null) {
      if (!allPlaceIds.has(record.place_id)) {
        logWarning(file, `${prefix} has invalid place_id Reference: "${record.place_id}"`);
      }
    }

    // Foreign Key: monuments_built
    if (Array.isArray(record.monuments_built)) {
      record.monuments_built.forEach((pId) => {
        if (!allPlaceIds.has(pId)) {
          logWarning(file, `${prefix} has invalid place reference in monuments_built: "${pId}"`);
        }
      });
    }

    // Foreign Key: places_included_ids
    if (Array.isArray(record.places_included_ids)) {
      record.places_included_ids.forEach((pId) => {
        if (!allPlaceIds.has(pId)) {
          logWarning(file, `${prefix} has invalid place reference in places_included_ids: "${pId}"`);
        }
      });
    }

    // Review ratings check
    if (tableName === "reviews" && (typeof record.rating !== "number" || record.rating < 1 || record.rating > 5)) {
      logError(file, `${prefix} has invalid review rating: ${record.rating}`);
    }

    // Unsplash Image URL validation check
    const checkImage = (url, fieldName) => {
      if (url && typeof url === "string" && !url.startsWith("http")) {
        logError(file, `${prefix} has invalid ${fieldName} URL format: "${url}"`);
      }
    };
    
    checkImage(record.image_url, "image_url");
    if (Array.isArray(record.image_urls)) {
      record.image_urls.forEach((url) => checkImage(url, "image_urls"));
    }
  }
}

console.log("\n=======================================================");
console.log("📊 VALIDATION SUMMARY:");
console.log(`   Errors found:   ${totalErrors}`);
console.log(`   Warnings found: ${totalWarnings}`);
console.log("=======================================================");

if (totalErrors === 0) {
  console.log("\n✅ All generated JSON datasets are formatted correctly and READY to upload!");
} else {
  console.error("\n❌ Found data integrity errors. Please review the errors list above.");
}
