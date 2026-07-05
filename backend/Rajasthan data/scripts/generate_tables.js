import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend folder (2 levels up from scripts directory)
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// Helper to convert arbitrary names to clean URL-safe slugs/IDs
function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, "") // remove special chars
    .replace(/\s+/g, "-"); // replace spaces with hyphens
}

const GROQ_KEYS = [];

for (let i = 1; i <= 10; i++) {
  const key = process.env[`GROQ_API_KEY_${i}`];
  if (key) {
    GROQ_KEYS.push(key);
  }
}

if (GROQ_KEYS.length === 0) {
  console.error(
    "❌ Error: No Groq API keys found! Please define GROQ_API_KEY in backend/.env file.",
  );
  process.exit(1);
}

let currentKeyIndex = 0;

// Helper for introducing sleeps
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function callGroqWithRetry(prompt) {
  let success = false;
  let attempts = 0;
  
  while (!success) {
    attempts++;
    try {
      const apiKey = GROQ_KEYS[currentKeyIndex];
      const url = "https://api.groq.com/openai/v1/chat/completions";
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          response_format: {
            type: "json_object",
          },
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const errorMsg = `Groq API Error: Status ${response.status} - ${errorBody}`;
        throw { status: response.status, message: errorMsg };
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Parse to ensure it is valid JSON
      const parsed = JSON.parse(content.trim());
      return parsed;
    } catch (err) {
      const status = err.status || 0;
      const errMessage = err.message || String(err);
      const isRateLimit = status === 429 || 
                          errMessage.includes("429") ||
                          errMessage.toLowerCase().includes("rate limit") ||
                          errMessage.toLowerCase().includes("quota");

      if (isRateLimit) {
        const oldIndex = currentKeyIndex;
        currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
        console.log(
          `  ⚠️ Rate limit hit on key #${oldIndex + 1}. Rotating to key #${currentKeyIndex + 1}...`
        );
        
        if (currentKeyIndex === 0) {
          console.log("  ⏳ All keys in the pool have been tried. Sleeping for 15 seconds to let limits reset...");
          await sleep(15000);
        } else {
          await sleep(1000); // 1s buffer before retry
        }
      } else {
        console.error(
          `  ⚠️ Attempt ${attempts} failed:`,
          errMessage,
        );
        console.log(`  🔄 Retrying in 5 seconds...`);
        await sleep(5000); // Wait 5s before retrying general error
      }
    }
  }
}
const DATA_DIR = path.join(__dirname, "..", "generated");

// Ensure output folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Path to raw Rajasthan Data
const RAW_DATA_PATH = path.join(__dirname, "..", "source");

// Helper to load raw JSON source file
function loadRawFile(filename) {
  const filePath = path.join(RAW_DATA_PATH, filename);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Source file not found: ${filePath}`);
    return null;
  }
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

// ---------------------------------------------------------
// TABLE REGISTRY & SCHEMA SCHEMES FOR AI GENERATION
// ---------------------------------------------------------
const TABLES = {
  districts: {
    filename: "rajasthan_districts_and_cities.json",
    getItems: (data) => data.districts.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name) + "-district",
    schema: {
      id: "Unique string slug e.g. 'jodhpur-district'",
      name: "District name, e.g. 'Jodhpur'",
      headquarters: "Administrative headquarters city, e.g. 'Jodhpur'",
      division: "Administrative division, e.g. 'Jodhpur Division'",
      area_sq_km: "Area in square kilometers as a number (e.g. 22850.00)",
      population: "Population of the district as an integer (e.g. 3687165)",
      established_year:
        "Year district was established as an integer (e.g. 1949)",
      history: "Detailed historical background of the district (3-4 sentences)",
      climate:
        "Description of the climate, e.g. 'Hot arid, dry desert weather'",
      map_coordinates:
        "Object with 'lat' and 'lng' float properties, e.g. { lat: 26.2978, lng: 73.0189 }",
      image_url:
        "High-quality, relevant Unsplash photo URL representing this district's landscape or iconic landmark",
    },
  },

  cities: {
    filename: "rajasthan_districts_and_cities.json",
    getItems: (data) => data.major_cities.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'jaipur'",
      district_id:
        "Slug of the district this city belongs to (matches the district slug, e.g. 'jaipur-district')",
      name: "City name, e.g. 'Jaipur'",
      tagline: "Poetic tagline, e.g. 'The Pink City'",
      description:
        "Detailed, rich description of the city's highlights and heritage (3-4 sentences)",
      image_url: "High-quality Unsplash image URL specific to this city",
      best_time: "Best time of year to visit, e.g. 'October to March'",
      weather_info:
        "Object with 'summer', 'monsoon', and 'winter' descriptions, e.g. { summer: '30°C - 45°C (Hot & Dry)', monsoon: '...', winter: '...' }",
      transport_info:
        "Object detailing connectivity keys 'metro', 'bus', 'airport', 'railway'. Set values to detailed sentences.",
      emergency_contacts:
        "Object with keys 'police', 'hospital', 'touristOffice' containing phone numbers/details",
    },
  },

  places: {
    filename: null, // Custom loading
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
        if (fp.forts)
          fp.forts.forEach((name) => addPlace(name, "Fort"));
        if (fp.palaces)
          fp.palaces.forEach((name) => addPlace(name, "Palace"));
      }

      // Temples
      const temples = loadRawFile("rajasthan_temples_religious_sites.json");
      if (temples)
        temples.forEach((name) => addPlace(name, "Temple"));

      // Lakes
      const lakes = loadRawFile("rajasthan_lakes_water_bodies.json");
      if (lakes)
        lakes.forEach((name) => addPlace(name, "Lake"));

      // Hills
      const hills = loadRawFile("rajasthan_hills_natural_attractions.json");
      if (hills)
        hills.forEach((name) =>
          addPlace(name, "Hills & Nature"),
        );

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
          if (wl[k])
            wl[k].forEach((name) =>
              addPlace(name, "Wildlife Reserve"),
            );
        });
      }

      // Pilgrimage Sites (which map to Temples or Religious Sites)
      const pilgrimage = loadRawFile(
        "rajasthan_cultural_etiquette_pilgrimage.json",
      );
      if (pilgrimage && pilgrimage.pilgrimage_sites) {
        pilgrimage.pilgrimage_sites.forEach((name) => {
          addPlace(name, "Temple");
        });
      }

      return items;
    },
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'amber-fort'",
      city_id:
        "Slug of the nearest major city (matches city slugs, e.g. 'jaipur', 'udaipur', or null if remote)",
      district_id:
        "Slug of the district (matches district slugs, e.g. 'jaipur-district')",
      title: "Name of the place, e.g. 'Amber Fort'",
      category:
        "Must be exactly one of: 'Fort', 'Palace', 'Temple', 'Lake', 'Hills & Nature', 'Wildlife Reserve'",
      overview: "Rich, engaging summary of the attraction (2-3 sentences)",
      history: "Detailed historical origin and background (3-4 sentences)",
      architecture_style:
        "Description of the architectural style and elements, or natural features (2-3 sentences)",
      best_time:
        "Suggested months or hours to visit, e.g. 'October to March, late afternoon'",
      timings: "Opening and closing timings, e.g. '8:00 AM - 5:30 PM daily'",
      entry_fee:
        "Fee details for domestic and international travelers, e.g. 'INR 100 for Indians, INR 500 for Foreigners'",
      map_coords:
        "Object with float keys 'lat' and 'lng', e.g. { lat: 26.9855, lng: 75.8513 }",
      parking:
        "Parking availability information, e.g. 'Ample parking available at the base'",
      photography_rules:
        "Rules regarding camera/photography, e.g. 'Allowed. Mobile: Free, Pro Camera: INR 100'",
      things_to_avoid:
        "Important warnings of what to avoid (e.g. monkeys, unofficial guides, high midday sun)",
      travel_tips:
        "Practical visiting advice (e.g. wear walking shoes, hire a licensed guide)",
      faq: "Array of 2-3 question/answer objects, e.g. [{ q: 'Is it open on holidays?', a: 'Yes...' }]",
      image_urls: "Array of 2-3 high-quality Unsplash image URLs of this place",
      rating: "A review score decimal between 4.2 and 5.0",
      related_ruler_ids:
        "Array of historical ruler slugs linked to this place (or empty array)",
      related_food_ids:
        "Array of food slugs native or popular near this place (or empty array)",
      related_festival_ids:
        "Array of festival slugs celebrated here (or empty array)",
      related_culture_ids:
        "Array of folk art/craft slugs associated with the region (or empty array)",
    },
  },

  dynasties: {
    filename: "rajasthan_rajput_dynasties_kings.json",
    getItems: (data) => data.dynasties.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name.split(" ")[0]), // e.g. 'Sisodia Dynasty (Mewar)' -> 'sisodia'
    schema: {
      id: "Unique string slug e.g. 'sisodia'",
      name: "Name of the dynasty, e.g. 'Sisodia Dynasty of Mewar'",
      clan_origin:
        "Suryavanshi, Chandravanshi, Agnivanshi or other origin detail, e.g. 'Suryavanshi Rajput'",
      founder: "Name of the founder of the dynasty",
      established_century: "Century established, e.g. '8th Century AD'",
      golden_era:
        "Rulers and periods considered the golden era, e.g. 'Reigns of Rana Kumbha and Rana Sanga'",
      history_summary:
        "Detailed historical chronicle of the dynasty (3-4 sentences)",
      capital_city_ids:
        "Array of city slugs historically serving as capitals, e.g. ['udaipur', 'chittorgarh']",
      patronage_arts:
        "Array of string descriptions of arts and architectures supported by the dynasty",
      image_url:
        "High-quality Unsplash image representing the royal emblem, weapons, or standard of the clan",
    },
  },

  history_rulers: {
    filename: "rajasthan_rajput_dynasties_kings.json",
    getItems: (data) => data.kings.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'maharana-pratap'",
      dynasty_id:
        "Slug of the dynasty they belonged to (matches dynasty slugs, e.g. 'sisodia', 'rathore', 'kachwaha')",
      name: "Name of the ruler, e.g. 'Maharana Pratap'",
      reign_period: "Reign period dates, e.g. '1572 - 1597 AD'",
      biography:
        "Deeply detailed biography of the ruler, highlighting courage, administration, or culture (4-5 sentences)",
      battles:
        "Array of objects representing key battles: [{ name: 'Battle of Haldighati', description: '...', outcome: '...' }]",
      achievements:
        "Array of string achievements (military, scientific, architectural, social)",
      predecessor: "Name of the preceding ruler",
      successor: "Name of the succeeding ruler",
      monuments_built: "Array of place/monument slugs built under their reign",
      image_url:
        "High-quality Unsplash image URL of a portrait, statue, or monument closely linked to the ruler",
      related_city_ids:
        "Array of city slugs closely linked to their life/reign",
    },
  },

  historical_events: {
    filename: "rajasthan_historical_events_legends.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'battle-of-haldighati'",
      title:
        "Title of the historical event or legend, e.g. 'Battle of Haldighati'",
      category:
        "Must be exactly one of: 'Battle', 'Legend', 'Historical Event', 'Treaty'",
      date_period: "Approximate date/period, e.g. '18 June 1576'",
      location_place_id:
        "Slug of the place where it happened (matches places table, e.g. 'haldighati-pass' or null)",
      location_details:
        "Text description of the location, e.g. 'Near Aravalli Ranges, Udaipur'",
      description: "Rich, engaging summary of the event (3-4 sentences)",
      significance:
        "Historical impact and cultural significance (2-3 sentences)",
      key_figures_ruler_ids:
        "Array of historical ruler slugs involved, e.g. ['maharana-pratap']",
      historical_narrative:
        "Detailed, dramatic narrative describing the events and stories surrounding it (4-5 sentences)",
      image_url:
        "High-quality Unsplash image depicting the site, battlefield, painting, or armor related to the event",
    },
  },

  foods: {
    filename: "rajasthan_cuisines.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'dal-baati-churma'",
      title: "Name of the dish or sweet, e.g. 'Dal Baati Churma'",
      origin: "Region or city of origin in Rajasthan",
      history: "Historical context or folklore behind the dish (3-4 sentences)",
      ingredients: "Array of main ingredients",
      recipe: "Array of detailed step-by-step preparation instructions",
      price_range:
        "Estimated typical cost range, e.g. 'INR 150 - 350 per serving'",
      nutritional_value:
        "Description of nutritional profile (heavy, rich, high protein, etc.)",
      festivals_served:
        "Array of festival names where this dish is typically prepared",
      best_restaurants:
        "Array of objects: [{ name: 'Laxmi Misthan Bhandar (LMB)', city: 'Jaipur', address: 'Johari Bazaar' }]",
      image_url:
        "High-quality, mouthwatering Unsplash food image URL of this dish",
      related_city_ids: "Array of city slugs where it is famous or originated",
      related_festival_ids: "Array of festival slugs associated with this dish",
    },
  },

  festivals: {
    filename: "rajasthan_festivals.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'gangaur'",
      title: "Title of the festival, e.g. 'Gangaur'",
      importance: "Significance and religious/cultural meaning (2-3 sentences)",
      history: "Legend or historical origin of the festival (3-4 sentences)",
      date_hindi_month:
        "Hindi calendar month date, e.g. 'Chaitra Shukla Tritiya'",
      date_approximate_english:
        "Approximate English calendar months, e.g. 'March - April'",
      duration: "Typical duration of celebration, e.g. '18 Days'",
      locations:
        "Array of city/region names where it is celebrated most prominently",
      dress_code: "Traditional dress codes or color recommendations",
      rituals: "Array of key rituals and custom descriptions",
      special_foods: "Array of foods/sweets consumed, e.g. ['ghewar', 'kheer']",
      travel_tips:
        "Advice for tourists attending this festival (e.g. booking hotels early, photography etiquette)",
      image_urls:
        "Array of 2-3 high-quality Unsplash images representing the color, crowd, and festivities",
      related_city_ids: "Array of city slugs linked to this festival",
      related_food_ids: "Array of food slugs associated with this festival",
      related_culture_ids:
        "Array of folk art/attire slugs associated with this festival",
    },
  },

  folk_arts: {
    filename: "rajasthan_folk_arts_attire.json",
    getItems: (data) => data.folk_arts.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'ghoomar'",
      name: "Name of the folk art, e.g. 'Ghoomar Dance'",
      category:
        "Must be exactly one of: 'Dance', 'Painting', 'Theatre', 'Puppetry'",
      origin_region: "Geographical region or community of origin",
      history_origin:
        "Detailed historical background and origin (3-4 sentences)",
      performance_details:
        "Detailed explanation of how it is performed, painted, or operated (3-4 sentences)",
      instruments_used:
        "Array of traditional musical instruments used (or empty if painting/craft)",
      dress_code_props:
        "Array of costumes, props, or materials used (e.g. heavy flared ghagras, earthen pots)",
      key_exponents:
        "Array of historically famous or national award-winning exponents/artists",
      image_url:
        "High-quality, dynamic Unsplash image of the dance, painting, or puppet show",
      related_city_ids: "Array of city slugs where it is most prominent",
    },
  },

  folk_music_instruments: {
    filename: "rajasthan_folk_music_instruments.json",
    getItems: (data) => {
      const items = [];
      if (data.folk_music)
        data.folk_music.forEach((name) =>
          items.push({ name, category: "Vocal Style" }),
        );
      if (data.instruments)
        data.instruments.forEach((name) =>
          items.push({ name, category: "Instrument" }),
        );
      return items;
    },
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'ravanhatta'",
      name: "Name of the music style or instrument, e.g. 'Ravanhatta'",
      category:
        "Must be exactly one of: 'Vocal Style', 'String Instrument', 'Wind Instrument', 'Percussion' (based on the instrument type, or 'Vocal Style' for singing styles)",
      materials_used:
        "Array of traditional materials used to make it (e.g. coconut shell, goat skin, bamboo, horsehair, or empty array if vocal style)",
      origin_history:
        "Detailed background, origin, and association with deities/legends (3-4 sentences)",
      tuning_playing_style: "How it is played, tuned, or sung (2-3 sentences)",
      famous_artists:
        "Array of famous folk maestros or groups who play/sing this style",
      audio_sample_url:
        "Leave as an empty string (or a placeholder .mp3 link if appropriate)",
      image_url:
        "High-quality Unsplash image of the instrument being played, or the singer in traditional attire",
    },
  },

  handicrafts: {
    filename: "rajasthan_handicrafts_traditional_crafts.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'blue-pottery'",
      name: "Name of the handicraft, e.g. 'Jaipuri Blue Pottery'",
      origin_city_id:
        "Slug of the origin city (matches city slugs, e.g. 'jaipur', 'jodhpur', or null)",
      materials_used: "Array of materials used in crafting",
      process_description:
        "Detailed, step-by-step craft-making process (3-4 sentences)",
      gi_tag_status:
        "Boolean (true if it has a Geographical Indication tag, false otherwise)",
      gi_tag_year: "Integer year of GI tag award, or null if false",
      famous_artisans: "Array of master craftsmen or national awardees",
      shopping_hubs:
        "Array of market locations to buy authentic items: [{ market_name: 'Johari Bazaar', city: 'Jaipur' }]",
      image_url:
        "High-quality, beautifully lit Unsplash close-up photo of the finished craft",
    },
  },

  attire: {
    filename: "rajasthan_folk_arts_attire.json",
    getItems: (data) => data.attire.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'safa-turban'",
      name: "Name of the attire or ornament, e.g. 'Rajasthani Safa Turban'",
      worn_by: "Must be exactly one of: 'Men', 'Women', 'Unisex'",
      material_fabrics:
        "Array of typical fabrics/colors, e.g. ['Bandhani cotton', 'Leheriya silk']",
      cultural_significance:
        "Deeper meaning, respect, marital status or regional representation of the attire (3-4 sentences)",
      wearing_style_occasions:
        "Description of how and when it is worn, e.g. weddings, festivals (2-3 sentences)",
      related_communities:
        "Array of tribes or communities associated with this specific style",
      image_url:
        "High-quality Unsplash image of a person wearing this traditional clothing or jewelry",
    },
  },

  languages: {
    filename: "rajasthan_languages.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'marwari'",
      name: "Name of the dialect/language, e.g. 'Marwari Language'",
      region_spoken:
        "Core geographical region, e.g. 'Marwar region (Jodhpur, Jaisalmer, Barmer)'",
      estimated_speakers: "String representation, e.g. '7.8 Million speakers'",
      vocabulary_samples:
        "Array of 3 objects representing local phrases: [{ phrase: 'Khamma Ghani', meaning: 'Hello / Many Greetings', context: 'Used as a formal greeting' }]",
      literary_history:
        "Historical scripts, books, bardic poems, or epics associated with this dialect (3-4 sentences)",
      associated_communities:
        "Array of communities or clans speaking this dialect historically",
    },
  },

  communities_tribes: {
    filename: "rajasthan_communities_tribes.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'bishnois'",
      name: "Name of the community/tribe, e.g. 'Bishnoi Community'",
      primary_regions: "Array of districts/regions where they primarily reside",
      lifestyle_history:
        "Detailed background, nomadic or settled history, trade, and culture (3-4 sentences)",
      cultural_contribution:
        "Array of cultural contributions (folk music, wildlife conservation, block printing, etc.)",
      beliefs_practices:
        "Array of unique spiritual, environmental, or social principles (e.g. 29 tenets, protecting khejri trees)",
      famous_personalities: "Array of famous figures from this community",
      image_url:
        "High-quality, respectful Unsplash photo of the community members, their villages, or activities",
    },
  },

  cultural_etiquette: {
    filename: "rajasthan_cultural_etiquette_pilgrimage.json",
    getItems: (data) => data.cultural_etiquette.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'temple-decorum'",
      title: "Name of the etiquette topic, e.g. 'Temple Visiting Decorum'",
      category:
        "Must be exactly one of: 'Greeting', 'Temple', 'General Dress', 'Photography'",
      etiquette_rule: "Summary of the rule (1 sentence)",
      explanation:
        "Detailed cultural reasons and description of this practice (3-4 sentences)",
      dos: "Array of DO actions (at least 3)",
      donts: "Array of DONT actions (at least 3)",
    },
  },

  unesco_sites: {
    filename: "rajasthan_unesco_heritage_sites.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'jantar-mantar-jaipur'",
      name: "Official UNESCO site name, e.g. 'Jantar Mantar, Jaipur'",
      inscription_year: "Integer year of UNESCO inscription (e.g. 2010)",
      unesco_criteria: "UNESCO criteria codes, e.g. 'Criteria (iii)(iv)'",
      description:
        "Rich description of the site, history, and why it is universally outstanding (3-4 sentences)",
      places_included_ids:
        "Array of place slugs included under this listing (e.g. ['amber-fort', 'chittorgarh-fort'] for hill forts)",
      protection_status:
        "Who manages and protects it, e.g. 'Archaeological Survey of India (ASI)'",
      image_url: "High-quality Unsplash image of the heritage site",
    },
  },

  royal_wedding_venues: {
    filename: "rajasthan_royal_wedding_venues.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name) + "-venue",
    schema: {
      id: "Unique string slug e.g. 'taj-lake-palace-venue'",
      name: "Name of the wedding venue, e.g. 'Taj Lake Palace'",
      place_id:
        "Slug of the related visitable tourist place (matches place slugs, e.g. 'lake-pichola' or null)",
      city_id: "Slug of the city (matches city slugs, e.g. 'udaipur')",
      accommodation_details:
        "Object with 'rooms' (integer), 'suites' (integer), and 'decor' (string describing style/architecture)",
      capacity: "Estimated guest capacity range, e.g. '150 - 300 Guests'",
      amenities:
        "Array of premium wedding-oriented amenities (e.g. Lakeside mandap, royal spa)",
      pricing_range:
        "Pricing class representation, e.g. 'Ultra-Luxury (Premium)'",
      contact_details:
        "Object with keys 'email' and 'phone' containing dummy contact info",
      image_urls:
        "Array of 2-3 high-quality Unsplash images showing the palace, lawns, or courtyards at night",
    },
  },

  unique_experiences: {
    filename: "rajasthan_unique_experiences.json",
    getItems: (data) => data.map((name) => ({ name })),
    getSlug: (item) => toSlug(item.name),
    schema: {
      id: "Unique string slug e.g. 'camel-safari-jaisalmer'",
      title:
        "Title of the experience, e.g. 'Overnight Camel Safari & Dune Camping'",
      description:
        "Captivating description of the experience, detailing what a traveler does (3-4 sentences)",
      city_id: "Slug of nearest city, e.g. 'jaisalmer'",
      duration: "Typical time needed, e.g. 'Overnight (18 Hours)'",
      best_time_of_day: "Ideal time of day, e.g. 'Sunset to Sunrise'",
      booking_details:
        "Object with 'licensed_operators' (array of string names) and 'contact' (string phone number)",
      pricing_estimate:
        "Estimated pricing range, e.g. 'INR 2500 - 5000 per person'",
      safety_tips:
        "Array of safety/preparedness tips (e.g. wear sunscreen, bring warm jackets for desert nights)",
      image_url: "High-quality, adventurous Unsplash image of this activity",
    },
  },
};

// ---------------------------------------------------------
// DYNAMIC TABLES (No raw file, generated entirely)
// ---------------------------------------------------------
const DYNAMIC_TABLES = {
  directory_listings: {
    generate: async () => {
      console.log(
        "📦 Dynamically generating local business and directory listings...",
      );

      // Load city IDs dynamically from cities.json if generated
      const citiesPath = path.join(DATA_DIR, "cities.json");
      let cities = [];
      if (fs.existsSync(citiesPath)) {
        try {
          const content = fs.readFileSync(citiesPath, "utf-8");
          cities = JSON.parse(content).map((c) => c.id);
        } catch (e) {
          console.warn(
            "⚠️ Warning: Failed to parse generated cities.json. Using fallback.",
          );
        }
      }

      // Fallback list of cities if cities.json isn't generated yet
      if (cities.length === 0) {
        cities = ["jaipur", "jodhpur", "udaipur", "jaisalmer", "pushkar"];
      }

      const listings = [];

      for (const city of cities) {
        console.log(`  🏬 Generating listings for city: ${city}...`);
        const prompt = `You are a local directory compiler for the city of "${city}" in Rajasthan. 
Generate a list of exactly 4 authentic tourist businesses/listings (one for each category: "Hotels", "Restaurants", "Shops", "Guides").
Return ONLY a valid JSON array of objects. Do NOT wrap in markdown.
The array of objects must have this exact structure:
[
  {
    "city_id": "${city}",
    "title": "Authentic Name of the business/guide (e.g. 'Surya Mahal Restaurant' or 'Johari Crafts Shop' or 'Guide Ramesh Chandra')",
    "category": "Must be exactly one of: 'Hotels', 'Restaurants', 'Shops', 'Guides'",
    "subcategory": "Specific type, e.g. 'Heritage Hotel', 'Traditional Sweets', 'Jewelry Bazaar', 'Heritage Walking Guide'",
    "rating": A decimal review score between 4.0 and 5.0 (number),
    "location_address": "Authentic address in the city",
    "contact_phone": "Phone number, e.g. '+91 141 2345678'",
    "whatsapp": "Whatsapp number, e.g. '+91 9414012345'",
    "description": "Short, appealing description of the service and highlights (2 sentences)",
    "pricing": "Price range indicator, e.g. 'INR 500 - 1500 per meal' or 'INR 4000 - 8000 per night'",
    "image_url": "High-quality relevant Unsplash photo URL",
    "is_verified": true
  }
]`;

        try {
          let parsed = await callGroqWithRetry(prompt);
          if (!Array.isArray(parsed)) {
            const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
            if (arrayKey) {
              parsed = parsed[arrayKey];
            } else {
              parsed = [parsed];
            }
          }
          listings.push(...parsed);
          await sleep(2200);
        } catch (err) {
          console.error(
            `  ❌ Failed to generate listings for ${city}:`,
            err.message,
          );
        }
      }
      return listings;
    },
  },

  reviews: {
    generate: async () => {
      console.log(
        "📦 Dynamically generating traveler reviews for various items...",
      );

      const placesPath = path.join(DATA_DIR, "places.json");
      const foodsPath = path.join(DATA_DIR, "foods.json");
      const experiencesPath = path.join(DATA_DIR, "unique_experiences.json");

      const targetItems = [];

      // Dynamically select a sample of generated places
      if (fs.existsSync(placesPath)) {
        try {
          const content = JSON.parse(fs.readFileSync(placesPath, "utf-8"));
          content
            .slice(0, 6)
            .forEach((p) =>
              targetItems.push({ id: p.id, type: "place", name: p.title }),
            );
        } catch (e) {
          console.warn("⚠️ Warning: Failed to parse generated places.json.");
        }
      }

      // Dynamically select a sample of generated foods
      if (fs.existsSync(foodsPath)) {
        try {
          const content = JSON.parse(fs.readFileSync(foodsPath, "utf-8"));
          content
            .slice(0, 4)
            .forEach((f) =>
              targetItems.push({ id: f.id, type: "food", name: f.title }),
            );
        } catch (e) {
          console.warn("⚠️ Warning: Failed to parse generated foods.json.");
        }
      }

      // Dynamically select a sample of generated unique experiences
      if (fs.existsSync(experiencesPath)) {
        try {
          const content = JSON.parse(fs.readFileSync(experiencesPath, "utf-8"));
          content
            .slice(0, 4)
            .forEach((e) =>
              targetItems.push({ id: e.id, type: "experience", name: e.title }),
            );
        } catch (e) {
          console.warn(
            "⚠️ Warning: Failed to parse generated unique_experiences.json.",
          );
        }
      }

      // Fallback if no generated files are found yet
      if (targetItems.length === 0) {
        targetItems.push(
          { id: "amber-fort", type: "place", name: "Amber Fort" },
          { id: "hawa-mahal", type: "place", name: "Hawa Mahal" },
          { id: "mehrangarh-fort", type: "place", name: "Mehrangarh Fort" },
          { id: "dal-baati-churma", type: "food", name: "Dal Baati Churma" },
        );
      }

      const reviews = [];

      for (const item of targetItems) {
        console.log(
          `  ✍️ Generating reviews for item: ${item.name} (${item.type})...`,
        );
        const prompt = `You are compiling traveler review feedback for "${item.name}" which is a "${item.type}".
Generate exactly 2 realistic, detailed, personal traveler reviews written by different tourists (one national, one international).
Return ONLY a valid JSON array of objects. Do NOT wrap in markdown.
The array of objects must have this exact structure:
[
  {
    "item_id": "${item.id}",
    "item_type": "${item.type}",
    "rating": An integer review rating from 1 to 5 (number),
    "comment": "A personalized, rich review comment describing their visit, pros, cons, and recommendations (3 sentences)",
    "author": "Name of traveler and country, e.g. 'John Miller, UK' or 'Amit Sharma, Delhi'"
  }
]`;

        try {
          let parsed = await callGroqWithRetry(prompt);
          if (!Array.isArray(parsed)) {
            const arrayKey = Object.keys(parsed).find((k) => Array.isArray(parsed[k]));
            if (arrayKey) {
              parsed = parsed[arrayKey];
            } else {
              parsed = [parsed];
            }
          }
          reviews.push(...parsed);
          await sleep(2200);
        } catch (err) {
          console.error(
            `  ❌ Failed to generate reviews for ${item.name}:`,
            err.message,
          );
        }
      }
      return reviews;
    },
  },
};



// ---------------------------------------------------------
// MAIN GENERATION LOGIC
// ---------------------------------------------------------
async function generateTable(tableName) {
  console.log(`\n======================================================`);
  console.log(`🔥 Starting generation for table: "${tableName}"`);
  console.log(`======================================================`);

  const outputFilePath = path.join(DATA_DIR, `${tableName}.json`);
  let generatedData = [];

  // Load existing data for state resumption
  if (fs.existsSync(outputFilePath)) {
    try {
      const existingContent = fs.readFileSync(outputFilePath, "utf-8");
      generatedData = JSON.parse(existingContent);
      console.log(
        `💾 Found existing generated file with ${generatedData.length} records. Resuming...`,
      );
    } catch (e) {
      console.warn(
        `⚠️ Warning: Failed to parse existing output file ${outputFilePath}. Starting fresh...`,
      );
    }
  }

  // Handle Dynamic tables
  if (DYNAMIC_TABLES[tableName]) {
    if (generatedData.length > 0) {
      console.log(
        `✅ Dynamic table "${tableName}" already generated. Skipping. Use empty file to re-generate.`,
      );
      return;
    }
    const data = await DYNAMIC_TABLES[tableName].generate();
    fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`💾 Saved dynamically generated data to: ${outputFilePath}`);
    return;
  }

  // Handle Standard tables
  const tableConfig = TABLES[tableName];
  if (!tableConfig) {
    console.error(`❌ Table config "${tableName}" not found!`);
    return;
  }

  let rawItems = [];
  if (tableConfig.filename) {
    const rawData = loadRawFile(tableConfig.filename);
    if (!rawData) return;
    rawItems = tableConfig.getItems(rawData);
  } else {
    // Custom getter e.g. for Places
    rawItems = tableConfig.getItems();
  }

  console.log(`📝 Total items in source list: ${rawItems.length}`);

  // Map generated items by ID for quick lookup
  const generatedMap = new Map(generatedData.map((item) => [item.id, item]));

  let countGenerated = 0;
  let countSkipped = 0;

  for (let idx = 0; idx < rawItems.length; idx++) {
    const rawItem = rawItems[idx];
    const slugId = tableConfig.getSlug(rawItem);

    // Resume Check
    if (generatedMap.has(slugId)) {
      countSkipped++;
      continue;
    }

    const itemName = rawItem.name;
    const category = rawItem.category || "";

    console.log(
      `🤖 [${idx + 1}/${rawItems.length}] Enriching item: "${itemName}" (ID: ${slugId})...`,
    );

    const prompt = `You are a regional expert on Rajasthan, India.
Create a highly detailed database record for the following item: "${itemName}" (slug ID: "${slugId}") which belongs to the table "${tableName}".
${category ? `Its category is "${category}".` : ""}

You MUST follow the SQL schema for this table. 
Return ONLY a valid, single JSON object containing the properties defined in the schema format below. Do NOT wrap in markdown block.

Schema properties description:
${JSON.stringify(tableConfig.schema, null, 2)}

Ensure:
1. The returned keys must EXACTLY match the schema keys above.
2. Area, population, and coordinates are numeric, not strings.
3. Generate realistic latitude/longitude coordinate floats inside Rajasthan boundary.
4. If an image is requested, provide a high-quality relevant Unsplash image URL (e.g. starting with https://images.unsplash.com/photo-...).
5. Make descriptions, narrative, history, and achievements highly informative, rich with local color, and detailed.`;

    try {
      const parsedRecord = await callGroqWithRetry(prompt);

      // Force the ID to be the correct slug we computed
      parsedRecord.id = slugId;

      generatedData.push(parsedRecord);
      generatedMap.set(slugId, parsedRecord);

      // Progressive Save
      fs.writeFileSync(
        outputFilePath,
        JSON.stringify(generatedData, null, 2),
        "utf-8",
      );
      countGenerated++;

      // Delay between items to stay under limits
      await sleep(2200);
    } catch (err) {
      console.error(`  ❌ Critical Error saving "${itemName}":`, err.message);
      process.exit(1);
    }
  }

  console.log(`🎉 Finished table "${tableName}"!`);
  console.log(
    `📊 Statistics: Generated: ${countGenerated}, Skipped (Already existed): ${countSkipped}, Total Records: ${generatedData.length}`,
  );
}

// ---------------------------------------------------------
// CLI EXECUTION ENTRY POINT
// ---------------------------------------------------------
async function run() {
  const args = process.argv.slice(2);
  const allTables = [
    "districts",
    "cities",
    "dynasties",
    "history_rulers",
    "places",
    "historical_events",
    "foods",
    "festivals",
    "folk_arts",
    "folk_music_instruments",
    "handicrafts",
    "attire",
    "languages",
    "communities_tribes",
    "cultural_etiquette",
    "unesco_sites",
    "royal_wedding_venues",
    "unique_experiences",
    "directory_listings",
    "reviews",
  ];

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    console.log(`
    🕌 Rajasthan Connect - Database Seed Data Generator CLI 🕌
    
    Usage:
      node generate_tables.js --table <table_name>   Generate data for a specific table
      node generate_tables.js --all                  Generate data for all 20 tables sequentially
      node generate_tables.js --list                 List all available tables
    
    Available Tables:
    ${allTables.map((t) => `  - ${t}`).join("\n")}
    `);
    process.exit(0);
  }

  if (args.includes("--list")) {
    console.log("Available tables for generation:\n" + allTables.join(", "));
    process.exit(0);
  }

  if (args.includes("--all")) {
    console.log(
      "🚀 Starting generation for ALL tables sequentially. This might take a while...",
    );
    for (const t of allTables) {
      await generateTable(t);
    }
    console.log(
      "\n🌟 Complete database generation process finished successfully!",
    );
    process.exit(0);
  }

  const tableIndex = args.indexOf("--table");
  if (tableIndex !== -1 && args[tableIndex + 1]) {
    const targetTable = args[tableIndex + 1];
    if (!allTables.includes(targetTable)) {
      console.error(`❌ Error: "${targetTable}" is not a valid table name.`);
      console.log("Run with --list to see all valid tables.");
      process.exit(1);
    }
    await generateTable(targetTable);
    process.exit(0);
  }

  console.error("❌ Invalid arguments. Run with --help to see usage.");
  process.exit(1);
}

run();
