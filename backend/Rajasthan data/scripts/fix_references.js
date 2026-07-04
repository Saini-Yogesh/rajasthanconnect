import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "..", "generated");

console.log("🛠️ Starting database seed reference correction script...\n");

// Load all generated data
const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
const dataMap = {};

for (const file of files) {
  const tableName = path.basename(file, ".json");
  const filePath = path.join(DATA_DIR, file);
  try {
    dataMap[tableName] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    console.error(`Failed to read ${file}: ${err.message}`);
    dataMap[tableName] = [];
  }
}

// ---------------------------------------------------------
// VALIDATION MAPS
// ---------------------------------------------------------
const validCities = new Set(dataMap.cities?.map((c) => c.id) || []);
const validDistricts = new Set(dataMap.districts?.map((d) => d.id) || []);
const validPlaces = new Set(dataMap.places?.map((p) => p.id) || []);

// 1. City ID replacements
const cityFixMap = {
  "mount-abu": "sirohi",
  "pushkar": "ajmer",
  "osian": "jodhpur",
  "karanj": "karauli",
  "deshnok": "bikaner",
  "ranakpur": "pali",
  "kumbhalgarh": "rajsamand",
  "nathdwara": "rajsamand"
};

// 2. Place ID replacements (for spelling variations/mismatches)
const placeFixMap = {
  "chittor-fort": "chittorgarh-fort",
  "sahelion-ki-bari": "saheliyon-ki-bari",
  "sahelionn-ki-bari": "saheliyon-ki-bari",
  "sahelion-kii-bari": "saheliyon-ki-bari",
  "jag-mandir": "lake-palace-jag-niwas", // Lake Palace is Jag Niwas / Jag Mandir is close
  "jag-manddir": "lake-palace-jag-niwas",
  "jag-mandir-palace": "lake-palace-jag-niwas",
  "jagat-nivas-palace": "lake-palace-jag-niwas",
  "jagat-niwas-palace": "lake-palace-jag-niwas",
  "jagat-singh-temple": "jagdish-temple",
  "taragarh-fort": "taragarh-fort-bundi", // Map to Bundi or Ajmer version
  "kumbha-palace": "rana-kumbha-palace"
};

// ---------------------------------------------------------
// REPAIR LOGIC
// ---------------------------------------------------------

let fixCount = 0;

for (const [tableName, records] of Object.entries(dataMap)) {
  if (!Array.isArray(records)) continue;

  for (let idx = 0; idx < records.length; idx++) {
    const record = records[idx];

    // Fix missing UUID IDs in reviews and directory_listings
    if (["reviews", "directory_listings"].includes(tableName) && !record.id) {
      record.id = randomUUID();
      fixCount++;
    }

    // Fix city_id
    if (record.city_id) {
      const fixedCity = cityFixMap[record.city_id.toLowerCase()];
      if (fixedCity) {
        record.city_id = fixedCity;
        fixCount++;
      } else if (!validCities.has(record.city_id)) {
        // Fallback: If invalid and not in map, search for matches or set null
        record.city_id = null;
        fixCount++;
      }
    }

    // Fix related_city_ids
    if (Array.isArray(record.related_city_ids)) {
      record.related_city_ids = record.related_city_ids.map((cId) => {
        const fixed = cityFixMap[cId.toLowerCase()];
        if (fixed) {
          fixCount++;
          return fixed;
        }
        return cId;
      }).filter((cId) => {
        const isValid = validCities.has(cId);
        if (!isValid) fixCount++;
        return isValid;
      });
    }

    // Fix district_id
    if (record.district_id) {
      if (record.district_id === "rajasthan-district") {
        // Find correct district using city_id, or fallback to jaipur-district
        if (record.city_id) {
          record.district_id = `${record.city_id}-district`;
        } else {
          record.district_id = "jaipur-district";
        }
        fixCount++;
      }
      
      // Ensure district matches districts.json
      if (!validDistricts.has(record.district_id)) {
        const baseDistrict = record.district_id.replace("-district", "");
        const matched = Array.from(validDistricts).find(d => d.includes(baseDistrict));
        if (matched) {
          record.district_id = matched;
        } else {
          record.district_id = "jaipur-district"; // default fallback
        }
        fixCount++;
      }
    }

    // Fix place_id (monument references)
    if (record.place_id) {
      const fixedPlace = placeFixMap[record.place_id.toLowerCase()];
      if (fixedPlace) {
        record.place_id = fixedPlace;
        fixCount++;
      } else if (!validPlaces.has(record.place_id)) {
        // If it still doesn't exist, see if we can fuzzy match
        const found = Array.from(validPlaces).find(p => p.includes(record.place_id) || record.place_id.includes(p));
        if (found) {
          record.place_id = found;
        } else {
          record.place_id = null; // remove broken relation
        }
        fixCount++;
      }
    }

    // Fix monuments_built
    if (Array.isArray(record.monuments_built)) {
      record.monuments_built = record.monuments_built.map((pId) => {
        const fixed = placeFixMap[pId.toLowerCase()];
        if (fixed) {
          fixCount++;
          return fixed;
        }
        return pId;
      }).filter((pId) => {
        const isValid = validPlaces.has(pId);
        if (!isValid) fixCount++;
        return isValid;
      });
    }

    // Fix places_included_ids
    if (Array.isArray(record.places_included_ids)) {
      record.places_included_ids = record.places_included_ids.map((pId) => {
        const fixed = placeFixMap[pId.toLowerCase()];
        if (fixed) {
          fixCount++;
          return fixed;
        }
        return pId;
      }).filter((pId) => {
        const isValid = validPlaces.has(pId);
        if (!isValid) fixCount++;
        return isValid;
      });
    }
  }

  // Save the repaired file
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2), "utf-8");
  console.log(`💾 Repaired & saved: ${tableName}.json`);
}

console.log(`\n🎉 Reference alignment complete! Successfully made ${fixCount} corrections.`);
console.log("👉 Now run 'node scripts/validate_data.js' to verify the updated datasets.");
