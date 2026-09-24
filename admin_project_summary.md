# Technical Specification: RajasthanConnect Admin Portal (`admin-rajasthanconnect`)

This document is a complete project brief and database blueprint for building a separate Web Admin Panel for **RajasthanConnect (rajasthanconnect.in)**. 

If you give this document to another AI coding assistant, it will have all the details needed to construct a complete Admin dashboard to perform full **CRUD (Create, Read, Update, Delete)** operations on the encyclopedia database.

---

## 1. Project Overview & Architectural Strategy

*   **Target Application Name**: `admin-rajasthanconnect`
*   **Goal**: Provide a clean, graphical dashboard for editors to manage cities, districts, guides, attractions, history, foods, festivals, and cultural assets of Rajasthan without writing SQL or using the raw database dashboard.
*   **Database**: PostgreSQL hosted on Supabase.
*   **Connection Method**: Since Supabase comes with Row Level Security (RLS) and client libraries, the Admin app can connect to Supabase in one of two ways:
    1.  **Direct Supabase Client (Recommended)**: Build a React/Vite client application using `@supabase/supabase-js`. It will perform secure CRUD queries directly from the client. Enable auth policies or log in with a dedicated Admin role in Supabase.
    2.  **Custom API Proxy**: Extend the existing Node/Express backend (`rajasthanconnect-backend`) with admin routes that implement token-based session verification.
*   **Asset Management**: Images should be uploaded directly to a **Supabase Storage Bucket** (e.g., `rajasthan-assets`), yielding public URLs that are saved into the table image fields.

---

## 2. Global Column Behaviors

All content tables support the following common columns:
*   `id` (VARCHAR PRIMARY KEY): Formatted as a kebab-case slug (e.g., `'jaipur-district'`, `'dal-baati-churma'`). The admin panel should auto-generate this ID from the name/title using a slugify function, but allow the admin to manually edit it if necessary.
*   `priority` (INT DEFAULT 0): Control sorting order. Higher values appear first. Default is `0`.
*   `created_at` (TIMESTAMPTZ DEFAULT NOW()): Auto-set.
*   `updated_at` (TIMESTAMPTZ DEFAULT NOW()): Updated automatically via triggers when a row is edited.

---

## 3. Database Schema Blueprint & CRUD Modules

The admin panel should support CRUD tabs for each of these 20 modules:

### Module 1: Districts (`districts` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'jaipur-district'`
    *   `name` (VARCHAR) - District name
    *   `headquarters` (VARCHAR) - Admin headquarters
    *   `division` (VARCHAR) - Administrative Division (Jaipur, Jodhpur, Udaipur, etc.)
    *   `area_sq_km` (DECIMAL)
    *   `population` (INT)
    *   `established_year` (INT)
    *   `history` (TEXT)
    *   `climate` (TEXT)
    *   `map_coordinates` (JSONB) - `{ "lat": 26.91, "lng": 75.78 }`
    *   `image_url` (TEXT) - Single image path
    *   `priority` (INT)

### Module 2: Cities (`cities` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'jaipur'`
    *   `district_id` (VARCHAR REFERENCES `districts(id)`) - Foreign key selector
    *   `name` (VARCHAR)
    *   `tagline` (TEXT)
    *   `description` (TEXT)
    *   `image_url` (TEXT)
    *   `best_time` (TEXT) - Travel season
    *   `weather_info` (JSONB) - `{ "summer": "...", "monsoon": "...", "winter": "..." }`
    *   `transport_info` (JSONB) - `{ "metro": "...", "bus": "...", "airport": "...", "railway": "..." }`
    *   `emergency_contacts` (JSONB) - `{ "police": "...", "hospital": "...", "touristOffice": "..." }`
    *   `priority` (INT)

### Module 3: Places & Attractions (`places` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'amber-fort'`
    *   `city_id` (VARCHAR REFERENCES `cities(id)`) - Foreign key selector
    *   `district_id` (VARCHAR REFERENCES `districts(id)`) - Foreign key selector
    *   `title` (VARCHAR) - Attraction name
    *   `category` (VARCHAR) - Select dropdown: `'Fort'`, `'Palace'`, `'Temple'`, `'Lake'`, `'Hills & Nature'`, `'Wildlife Reserve'`
    *   `overview` (TEXT)
    *   `history` (TEXT)
    *   `architecture_style` (TEXT)
    *   `best_time` (TEXT)
    *   `timings` (TEXT)
    *   `entry_fee` (TEXT)
    *   `map_coords` (JSONB) - `{ "lat": 26.98, "lng": 75.85 }`
    *   `parking` (TEXT)
    *   `photography_rules` (TEXT)
    *   `things_to_avoid` (TEXT)
    *   `travel_tips` (TEXT)
    *   `faq` (JSONB) - Array of objects: `[ { "q": "...", "a": "..." } ]`
    *   `image_urls` (TEXT[]) - Multiple image array. Admin should support multiple file uploads.
    *   `rating` (DECIMAL) - Default `5.0`
    *   `related_ruler_ids` (TEXT[]) - Multi-select IDs from `history_rulers`
    *   `related_food_ids` (TEXT[]) - Multi-select IDs from `foods`
    *   `related_festival_ids` (TEXT[]) - Multi-select IDs from `festivals`
    *   `related_culture_ids` (TEXT[]) - Multi-select IDs from `folk_arts`/`handicrafts`
    *   `priority` (INT)

### Module 4: Dynasties (`dynasties` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'sisodia'`, `'rathore'`
    *   `name` (VARCHAR)
    *   `clan_origin` (VARCHAR)
    *   `founder` (VARCHAR)
    *   `established_century` (VARCHAR)
    *   `golden_era` (TEXT)
    *   `history_summary` (TEXT)
    *   `capital_city_ids` (TEXT[]) - Multi-select list of city IDs from `cities`
    *   `patronage_arts` (TEXT[]) - String array list of arts supported
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 5: Rulers (`history_rulers` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'maharana-pratap'`
    *   `dynasty_id` (VARCHAR REFERENCES `dynasties(id)`) - Foreign key selector
    *   `name` (VARCHAR)
    *   `reign_period` (VARCHAR) - e.g., `'1572 – 1597'`
    *   `biography` (TEXT)
    *   `battles` (JSONB) - Array of objects: `[ { "name": "...", "description": "...", "outcome": "..." } ]`
    *   `achievements` (TEXT[]) - String array list
    *   `predecessor` (VARCHAR)
    *   `successor` (VARCHAR)
    *   `monuments_built` (TEXT[]) - Multi-select list of places from `places`
    *   `image_url` (TEXT)
    *   `related_city_ids` (TEXT[]) - Multi-select city IDs
    *   `priority` (INT)

### Module 6: Historical Events (`historical_events` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'battle-of-haldighati'`
    *   `title` (VARCHAR)
    *   `category` (VARCHAR) - Select dropdown: `'Battle'`, `'Legend'`, `'Historical Event'`, `'Treaty'`
    *   `date_period` (TEXT) - e.g., `'1576 AD'`
    *   `location_place_id` (VARCHAR REFERENCES `places(id)`) - Foreign key selector
    *   `location_details` (TEXT)
    *   `description` (TEXT)
    *   `significance` (TEXT)
    *   `key_figures_ruler_ids` (TEXT[]) - Multi-select IDs from `history_rulers`
    *   `historical_narrative` (TEXT)
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 7: Foods & Cuisines (`foods` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'dal-baati-churma'`
    *   `title` (VARCHAR)
    *   `origin` (TEXT)
    *   `history` (TEXT)
    *   `ingredients` (TEXT[]) - List of ingredients
    *   `recipe` (TEXT[]) - Step-by-step instructions
    *   `price_range` (TEXT) - e.g., `'150 - 300 INR'`
    *   `nutritional_value` (TEXT)
    *   `festivals_served` (TEXT[]) - Multi-select IDs from `festivals`
    *   `best_restaurants` (JSONB) - Array: `[ { "name": "...", "city": "...", "address": "..." } ]`
    *   `image_url` (TEXT)
    *   `related_city_ids` (TEXT[]) - Multi-select IDs from `cities`
    *   `related_festival_ids` (TEXT[]) - Multi-select IDs from `festivals`
    *   `priority` (INT)

### Module 8: Festivals (`festivals` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'gangaur'`
    *   `title` (VARCHAR)
    *   `importance` (TEXT)
    *   `history` (TEXT)
    *   `date_hindi_month` (TEXT) - e.g., `'Chaitra Shukla Tritiya'`
    *   `date_approximate_english` (TEXT) - e.g., `'March - April'`
    *   `duration` (TEXT)
    *   `locations` (TEXT[]) - Cities celebrating this festival
    *   `dress_code` (TEXT)
    *   `rituals` (TEXT[]) - List of key rituals
    *   `special_foods` (TEXT[]) - Multi-select IDs from `foods`
    *   `travel_tips` (TEXT)
    *   `image_urls` (TEXT[]) - Multiple images upload
    *   `related_city_ids` (TEXT[]) - Multi-select IDs from `cities`
    *   `related_food_ids` (TEXT[]) - Multi-select IDs from `foods`
    *   `related_culture_ids` (TEXT[]) - Multi-select IDs from `folk_arts`
    *   `priority` (INT)

### Module 9: Folk Arts (`folk_arts` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'ghoomar'`
    *   `name` (VARCHAR)
    *   `category` (VARCHAR) - Select dropdown: `'Dance'`, `'Painting'`, `'Theatre'`, `'Puppetry'`
    *   `origin_region` (TEXT)
    *   `history_origin` (TEXT)
    *   `performance_details` (TEXT)
    *   `instruments_used` (TEXT[]) - Multi-select IDs from `folk_music_instruments` or text strings
    *   `dress_code_props` (TEXT[]) - Costumes/props associated
    *   `key_exponents` (TEXT[]) - Famous artists
    *   `image_url` (TEXT)
    *   `related_city_ids` (TEXT[]) - Multi-select IDs from `cities`
    *   `priority` (INT)

### Module 10: Folk Music & Instruments (`folk_music_instruments` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'ravanhatta'`
    *   `name` (VARCHAR)
    *   `category` (VARCHAR) - Select dropdown: `'Vocal Style'`, `'String Instrument'`, `'Wind Instrument'`, `'Percussion'`
    *   `materials_used` (TEXT[])
    *   `origin_history` (TEXT)
    *   `tuning_playing_style` (TEXT)
    *   `famous_artists` (TEXT[])
    *   `audio_sample_url` (TEXT) - Audio file upload path (or input)
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 11: Handicrafts (`handicrafts` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'blue-pottery'`
    *   `name` (VARCHAR)
    *   `origin_city_id` (VARCHAR REFERENCES `cities(id)`) - Foreign key selector
    *   `materials_used` (TEXT[])
    *   `process_description` (TEXT)
    *   `gi_tag_status` (BOOLEAN DEFAULT FALSE)
    *   `gi_tag_year` (INT)
    *   `famous_artisans` (TEXT[])
    *   `shopping_hubs` (JSONB) - Array: `[ { "market_name": "...", "city": "..." } ]`
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 12: Attire & Costumes (`attire` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'safa-turban'`
    *   `name` (VARCHAR)
    *   `worn_by` (VARCHAR) - Select: `'Men'`, `'Women'`, `'Unisex'`
    *   `material_fabrics` (TEXT[]) - e.g., `['Cotton', 'Chiffon']`
    *   `cultural_significance` (TEXT)
    *   `wearing_style_occasions` (TEXT)
    *   `related_communities` (TEXT[]) - Communities associated
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 13: Languages & Dialects (`languages` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'marwari'`
    *   `name` (VARCHAR)
    *   `region_spoken` (TEXT)
    *   `estimated_speakers` (TEXT)
    *   `vocabulary_samples` (JSONB) - Array: `[ { "phrase": "...", "meaning": "...", "context": "..." } ]`
    *   `literary_history` (TEXT)
    *   `associated_communities` (TEXT[])
    *   `priority` (INT)

### Module 14: Tribes & Communities (`communities_tribes` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'bishnois'`
    *   `name` (VARCHAR)
    *   `primary_regions` (TEXT[])
    *   `lifestyle_history` (TEXT)
    *   `cultural_contribution` (TEXT[])
    *   `beliefs_practices` (TEXT[])
    *   `famous_personalities` (TEXT[])
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 15: Cultural Etiquette (`cultural_etiquette` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'temple-etiquette'`
    *   `title` (VARCHAR)
    *   `category` (VARCHAR) - Select dropdown: `'Greeting'`, `'Temple'`, `'General Dress'`, `'Photography'`
    *   `etiquette_rule` (TEXT)
    *   `explanation` (TEXT)
    *   `dos` (TEXT[]) - Array of bullet strings
    *   `donts` (TEXT[]) - Array of bullet strings
    *   `priority` (INT)

### Module 16: UNESCO World Heritage Sites (`unesco_sites` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'hill-forts-rajasthan'`
    *   `name` (VARCHAR)
    *   `inscription_year` (INT)
    *   `unesco_criteria` (TEXT)
    *   `description` (TEXT)
    *   `places_included_ids` (TEXT[]) - Multi-select of places from `places`
    *   `protection_status` (TEXT)
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 17: Royal Wedding Venues (`royal_wedding_venues` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'taj-lake-palace-venue'`
    *   `name` (VARCHAR)
    *   `place_id` (VARCHAR REFERENCES `places(id)`) - Optional foreign key selector
    *   `city_id` (VARCHAR REFERENCES `cities(id)`) - Foreign key selector
    *   `accommodation_details` (JSONB) - e.g., `{ "rooms": 83, "suites": 17, "decor": "..." }`
    *   `capacity` (TEXT) - e.g., `'100 - 500 Guests'`
    *   `amenities` (TEXT[]) - e.g., `['Heritage Pool', 'Royal Spa']`
    *   `pricing_range` (TEXT) - e.g., `'Luxe / Premium Range'`
    *   `contact_details` (JSONB) - `{ "email": "...", "phone": "..." }`
    *   `image_urls` (TEXT[]) - Multiple images upload
    *   `priority` (INT)

### Module 18: Unique Travel Experiences (`unique_experiences` table)
*   **Columns**:
    *   `id` (VARCHAR PRIMARY KEY) - e.g., `'camel-safari-jaisalmer'`
    *   `title` (VARCHAR)
    *   `description` (TEXT)
    *   `city_id` (VARCHAR REFERENCES `cities(id)`) - Foreign key selector
    *   `duration` (TEXT) - e.g., `'Overnight'`
    *   `best_time_of_day` (TEXT) - e.g., `'Sunset'`
    *   `booking_details` (JSONB) - `{ "licensed_operators": [...], "contact": "..." }`
    *   `pricing_estimate` (TEXT) - e.g., `'INR 1500 - 3000 per person'`
    *   `safety_tips` (TEXT[])
    *   `image_url` (TEXT)
    *   `priority` (INT)

### Module 19: Business Directory Listings (`directory_listings` table)
*   **Columns**:
    *   `id` (UUID PRIMARY KEY DEFAULT `gen_random_uuid()`)
    *   `city_id` (VARCHAR REFERENCES `cities(id)`) - Foreign key selector
    *   `title` (VARCHAR) - Business Name
    *   `category` (VARCHAR) - Selector: `'Guides'`, `'Hotels'`, `'Restaurants'`, `'Shops'`, `'Transport'`
    *   `subcategory` (VARCHAR)
    *   `rating` (DECIMAL) - Default `5.0`
    *   `location_address` (TEXT)
    *   `contact_phone` (VARCHAR)
    *   `whatsapp` (VARCHAR)
    *   `description` (TEXT)
    *   `pricing` (TEXT)
    *   `image_url` (TEXT)
    *   `is_verified` (BOOLEAN DEFAULT FALSE) - Verification toggle switch
    *   `priority` (INT)

### Module 20: User Reviews (`reviews` table)
*   **Columns**:
    *   `id` (UUID PRIMARY KEY DEFAULT `gen_random_uuid()`)
    *   `item_id` (VARCHAR) - Slug ID of target place/experience/food/etc.
    *   `item_type` (VARCHAR) - Selector: `'place'`, `'food'`, `'experience'`, `'listing'`
    *   `rating` (INT) - 1 to 5 stars
    *   `comment` (TEXT)
    *   `author` (VARCHAR) - Default `'Anonymous Traveler'`

---

## 4. Key UI & Functional Requirements

1.  **Sidebar/Navigation Tabs**: Simple navigation list grouping tables into divisions:
    *   *Geography*: Districts, Cities.
    *   *Attractions*: Places, UNESCO Sites, Experiences, Wedding Venues.
    *   *Culture*: Foods, Festivals, Folk Arts, Instruments, Handicrafts, Attire, Languages, Tribes.
    *   *Moderation*: Business Directory, Reviews.
2.  **Input Controls**:
    *   **Text/Slug auto-fill**: Typing a Title (e.g. `Hawa Mahal`) automatically suggests a lowercased, hyphenated ID slug (`hawa-mahal`) using simple JS formatting.
    *   **Rich Text Editor (Markdown)**: For description and history fields (`TEXT` type), provide a Markdown editor to format details, list styles, and bold text.
    *   **Multi-Select Array Fields**: For arrays like `related_city_ids` or `related_food_ids`, fetch options from respective tables and display them in a tag-based multi-select component.
    *   **JSON Fields**: For JSONB structures (e.g. `emergency_contacts` or `vocabulary_samples`), render simple key-value inputs or forms instead of raw JSON textareas.
    *   **File Uploader**: Integrate file drag-and-drop. Selecting an image uploads it to the Supabase bucket and pastes the public URL inside the database string field.
3.  **Audit Logs**: When inserting or updating records, ensure `created_at` or `updated_at` timestamps are handled or left to defaults.
4.  **Confirmations**: Provide modal alerts before any deletion actions to prevent accidental removal of entries.
