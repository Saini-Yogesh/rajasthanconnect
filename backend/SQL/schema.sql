-- ========================================================
-- RAJASTHANCONNECT DATABASE SCHEMA INITIALIZATION SCRIPT
-- Copy and run this script in the Supabase SQL Editor.
-- ========================================================

-- Clean up tables for fresh setup
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS directory_listings CASCADE;
DROP TABLE IF EXISTS unique_experiences CASCADE;
DROP TABLE IF EXISTS royal_wedding_venues CASCADE;
DROP TABLE IF EXISTS unesco_sites CASCADE;
DROP TABLE IF EXISTS cultural_etiquette CASCADE;
DROP TABLE IF EXISTS communities_tribes CASCADE;
DROP TABLE IF EXISTS attire CASCADE;
DROP TABLE IF EXISTS handicrafts CASCADE;
DROP TABLE IF EXISTS folk_music_instruments CASCADE;
DROP TABLE IF EXISTS folk_arts CASCADE;
DROP TABLE IF EXISTS historical_events CASCADE;
DROP TABLE IF EXISTS history_rulers CASCADE;
DROP TABLE IF EXISTS dynasties CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS festivals CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS districts CASCADE;


-- ========================================================
-- 1. GEOGRAPHY DIVISION (Districts & Cities)
-- ========================================================

CREATE TABLE districts (
    id VARCHAR(150) PRIMARY KEY, -- Slug e.g., 'jaipur-district', 'ajmer'
    name VARCHAR(250) NOT NULL,
    headquarters VARCHAR(250),
    division VARCHAR(250), -- Administrative Division (e.g. Jaipur, Ajmer, Udaipur)
    area_sq_km DECIMAL(10,2),
    population INT,
    established_year INT,
    history TEXT NOT NULL,
    climate TEXT,
    map_coordinates JSONB, -- { "lat": 26.9124, "lng": 75.7873 }
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cities (
    id VARCHAR(150) PRIMARY KEY, -- Slug e.g., 'jaipur', 'pushkar'
    district_id VARCHAR(150) REFERENCES districts(id) ON DELETE SET NULL,
    name VARCHAR(250) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    image_url TEXT,
    best_time TEXT,
    weather_info JSONB, -- { "summer": "...", "monsoon": "...", "winter": "..." }
    transport_info JSONB, -- { "metro": "...", "bus": "...", "airport": "...", "railway": "..." }
    emergency_contacts JSONB, -- { "police": "...", "hospital": "...", "touristOffice": "..." }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 2. TOURISM DIVISION (Places & Attractions)
-- ========================================================

CREATE TABLE places (
    id VARCHAR(150) PRIMARY KEY, -- Slug e.g., 'amber-fort', 'lake-pichola'
    city_id VARCHAR(150) REFERENCES cities(id) ON DELETE CASCADE,
    district_id VARCHAR(150) REFERENCES districts(id) ON DELETE SET NULL,
    title VARCHAR(250) NOT NULL,
    category VARCHAR(150) NOT NULL, -- 'Fort', 'Palace', 'Temple', 'Lake', 'Hills & Nature', 'Wildlife Reserve'
    overview TEXT NOT NULL,
    history TEXT,
    architecture_style TEXT, -- Description of architectural elements
    best_time TEXT,
    timings TEXT,
    entry_fee TEXT,
    map_coords JSONB, -- { "lat": 26.9855, "lng": 75.8513 }
    parking TEXT,
    photography_rules TEXT,
    things_to_avoid TEXT,
    travel_tips TEXT,
    faq JSONB, -- array of { "q": "...", "a": "..." }
    image_urls TEXT[], -- multiple image gallery links
    rating DECIMAL(2,1) DEFAULT 5.0,
    related_ruler_ids TEXT[], -- Links to history_rulers
    related_food_ids TEXT[], -- Links to foods (cuisines)
    related_festival_ids TEXT[], -- Links to festivals
    related_culture_ids TEXT[], -- Links to folk arts or attire (culture_topics/folk_arts)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 3. HISTORY DIVISION (Dynasties, Rulers & Events)
-- ========================================================

CREATE TABLE dynasties (
    id VARCHAR(150) PRIMARY KEY, -- 'sisodia', 'rathore', 'kachwaha', 'bhati'
    name VARCHAR(250) NOT NULL,
    clan_origin VARCHAR(250),
    founder VARCHAR(250),
    established_century VARCHAR(100),
    golden_era TEXT,
    history_summary TEXT NOT NULL,
    emblem_url TEXT,
    capital_city_ids TEXT[], -- Array of city slugs e.g. ['jaipur', 'amber']
    patronage_arts TEXT[], -- list of arts supported by dynasty
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE history_rulers (
    id VARCHAR(150) PRIMARY KEY, -- 'maharana-pratap', 'sawai-jai-singh'
    dynasty_id VARCHAR(150) REFERENCES dynasties(id) ON DELETE SET NULL,
    name VARCHAR(250) NOT NULL,
    reign_period VARCHAR(250),
    biography TEXT NOT NULL,
    battles JSONB, -- array of { "name": "...", "description": "...", "outcome": "..." }
    achievements TEXT[],
    predecessor VARCHAR(250),
    successor VARCHAR(250),
    monuments_built TEXT[], -- Array of place IDs
    image_url TEXT,
    related_city_ids TEXT[], -- Array of city IDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE historical_events (
    id VARCHAR(150) PRIMARY KEY, -- 'battle-of-haldighati', 'johur-chittor'
    title VARCHAR(250) NOT NULL,
    category VARCHAR(150) NOT NULL, -- 'Battle', 'Legend', 'Historical Event', 'Treaty'
    date_period TEXT, -- '1576 AD', '1303 AD'
    location_place_id VARCHAR(150) REFERENCES places(id) ON DELETE SET NULL,
    location_details TEXT, -- text description of location
    description TEXT NOT NULL,
    significance TEXT,
    key_figures_ruler_ids TEXT[], -- Rulers involved
    historical_narrative TEXT, -- Detailed historical background
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 4. CULTURE DIVISION (Arts, Crafts, Attire, Languages)
-- ========================================================

CREATE TABLE foods (
    id VARCHAR(150) PRIMARY KEY, -- 'dal-baati-churma', 'laal-maas'
    title VARCHAR(250) NOT NULL,
    origin TEXT,
    history TEXT,
    ingredients TEXT[],
    recipe TEXT[],
    price_range TEXT,
    nutritional_value TEXT,
    festivals_served TEXT[], -- Links to festivals
    best_restaurants JSONB, -- array of { "name": "...", "city": "...", "address": "..." }
    image_url TEXT,
    related_city_ids TEXT[], -- Links to cities
    related_festival_ids TEXT[], -- Links to festivals
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE festivals (
    id VARCHAR(150) PRIMARY KEY, -- 'gangaur', 'pushkar-fair'
    title VARCHAR(250) NOT NULL,
    importance TEXT NOT NULL,
    history TEXT,
    date_hindi_month TEXT, -- e.g. 'Chaitra Shukla Tritiya'
    date_approximate_english TEXT, -- e.g. 'March - April'
    duration TEXT, -- e.g. '18 Days'
    locations TEXT[], -- Cities/Regions where celebrated
    dress_code TEXT,
    rituals TEXT[], -- List of key rituals
    special_foods TEXT[], -- Links to foods
    travel_tips TEXT,
    image_urls TEXT[],
    related_city_ids TEXT[], -- Links to cities
    related_food_ids TEXT[], -- Links to foods
    related_culture_ids TEXT[], -- Links to culture/folk arts
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE folk_arts (
    id VARCHAR(150) PRIMARY KEY, -- 'ghoomar', 'kathputli', 'phad-painting'
    name VARCHAR(250) NOT NULL,
    category VARCHAR(150) NOT NULL, -- 'Dance', 'Painting', 'Theatre', 'Puppetry'
    origin_region TEXT,
    history_origin TEXT NOT NULL,
    performance_details TEXT, -- How it is performed or created
    instruments_used TEXT[], -- Traditional instruments used (IDs/names)
    dress_code_props TEXT[], -- Costumes/props associated
    key_exponents TEXT[], -- Famous artists
    image_url TEXT,
    related_city_ids TEXT[], -- Where it is most prominent
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE folk_music_instruments (
    id VARCHAR(150) PRIMARY KEY, -- 'maand', 'ravanhatta', 'kamayacha'
    name VARCHAR(250) NOT NULL,
    category VARCHAR(150) NOT NULL, -- 'Vocal Style', 'String Instrument', 'Wind Instrument', 'Percussion'
    materials_used TEXT[], -- Materials used (e.g. coconut shell, goat skin)
    origin_history TEXT NOT NULL,
    tuning_playing_style TEXT,
    famous_artists TEXT[],
    audio_sample_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE handicrafts (
    id VARCHAR(150) PRIMARY KEY, -- 'blue-pottery', 'thewa-art', 'bandhani'
    name VARCHAR(250) NOT NULL,
    origin_city_id VARCHAR(150) REFERENCES cities(id) ON DELETE SET NULL,
    materials_used TEXT[],
    process_description TEXT NOT NULL,
    gi_tag_status BOOLEAN DEFAULT FALSE,
    gi_tag_year INT,
    famous_artisans TEXT[],
    shopping_hubs JSONB, -- array of { "market_name": "...", "city": "..." }
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE attire (
    id VARCHAR(150) PRIMARY KEY, -- 'safa-turban', 'ghagra-choli', 'mojari'
    name VARCHAR(250) NOT NULL,
    worn_by VARCHAR(150) NOT NULL, -- 'Men', 'Women', 'Unisex'
    material_fabrics TEXT[], -- e.g. 'Bandhani silk', 'Khadi cotton'
    cultural_significance TEXT NOT NULL,
    wearing_style_occasions TEXT, -- When and how it is worn
    related_communities TEXT[], -- Tribes/communities that wear this style
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE languages (
    id VARCHAR(150) PRIMARY KEY, -- 'marwari', 'mewari', 'dhundhari'
    name VARCHAR(250) NOT NULL,
    region_spoken TEXT,
    estimated_speakers TEXT,
    vocabulary_samples JSONB, -- list of { "phrase": "...", "meaning": "...", "context": "..." }
    literary_history TEXT NOT NULL,
    associated_communities TEXT[], -- Tribes/clans speaking this dialect
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 5. SOCIAL & ENVIRONMENT DIVISION
-- ========================================================

CREATE TABLE communities_tribes (
    id VARCHAR(150) PRIMARY KEY, -- 'bhils', 'meenas', 'bishnois', 'manganiyars'
    name VARCHAR(250) NOT NULL,
    primary_regions TEXT[], -- geographical distribution
    lifestyle_history TEXT NOT NULL,
    cultural_contribution TEXT[], -- Folk arts/music they introduced
    beliefs_practices TEXT[], -- Unique social or environmental customs (e.g. Bishnois protecting blackbucks)
    famous_personalities TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE cultural_etiquette (
    id VARCHAR(150) PRIMARY KEY, -- 'greeting-etiquette', 'temple-etiquette'
    title VARCHAR(250) NOT NULL,
    category VARCHAR(150) NOT NULL, -- 'Greeting', 'Temple', 'General Dress', 'Photography'
    etiquette_rule TEXT NOT NULL,
    explanation TEXT NOT NULL,
    dos TEXT[],
    donts TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE unesco_sites (
    id VARCHAR(150) PRIMARY KEY, -- 'jantar-mantar', 'hill-forts-rajasthan'
    name VARCHAR(250) NOT NULL,
    inscription_year INT,
    unesco_criteria TEXT,
    description TEXT NOT NULL,
    places_included_ids TEXT[], -- Array of place IDs e.g. ['amber-fort', 'chittorgarh-fort']
    protection_status TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 6. TRAVEL & WEDDING ENHANCEMENTS
-- ========================================================

CREATE TABLE royal_wedding_venues (
    id VARCHAR(150) PRIMARY KEY, -- 'taj-lake-palace-venue', 'udaivilas-venue'
    name VARCHAR(250) NOT NULL,
    place_id VARCHAR(150) REFERENCES places(id) ON DELETE SET NULL, -- if the venue is also a visitable place
    city_id VARCHAR(150) REFERENCES cities(id) ON DELETE CASCADE,
    accommodation_details JSONB, -- { "rooms": 83, "suites": 17, "decor": "..." }
    capacity TEXT, -- Guest limits (e.g., '100 - 500 Guests')
    amenities TEXT[], -- ['Heritage Pool', 'Royal Spa', 'Lakeside Mandap']
    pricing_range TEXT, -- pricing estimates e.g. 'Luxe / Budget Range'
    contact_details JSONB, -- { "email": "...", "phone": "..." }
    image_urls TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE unique_experiences (
    id VARCHAR(150) PRIMARY KEY, -- 'camel-safari-jaisalmer', 'leopard-safari-jawai'
    title VARCHAR(250) NOT NULL,
    description TEXT NOT NULL,
    city_id VARCHAR(150) REFERENCES cities(id) ON DELETE CASCADE,
    duration TEXT, -- e.g., '3-4 hours', 'Overnight'
    best_time_of_day TEXT, -- 'Sunset', 'Early morning'
    booking_details JSONB, -- { "licensed_operators": ["..."], "contact": "..." }
    pricing_estimate TEXT, -- e.g., 'INR 1500 - 3000 per person'
    safety_tips TEXT[],
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE directory_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id VARCHAR(150) REFERENCES cities(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    category VARCHAR(150) NOT NULL, -- 'Guides', 'Hotels', 'Restaurants', 'Shops'
    subcategory VARCHAR(150),
    rating DECIMAL(2,1) DEFAULT 5.0,
    location_address TEXT NOT NULL,
    contact_phone VARCHAR(100),
    whatsapp VARCHAR(100),
    description TEXT NOT NULL,
    pricing TEXT,
    image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id VARCHAR(150) NOT NULL, -- Can refer to place_id, food_id, experience_id, etc.
    item_type VARCHAR(100) NOT NULL, -- 'place', 'food', 'experience', 'listing'
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    author VARCHAR(250) DEFAULT 'Anonymous Traveler',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ========================================================
-- 7. PERFORMANCE INDEXES (FOR INSTANT SEARCHES)
-- ========================================================

-- Enable GIN Indexing for Array searches (highly critical for our Hybrid array-based relations)
CREATE INDEX idx_places_rulers ON places USING gin (related_ruler_ids);
CREATE INDEX idx_places_festivals ON places USING gin (related_festival_ids);
CREATE INDEX idx_places_foods ON places USING gin (related_food_ids);

CREATE INDEX idx_foods_cities ON foods USING gin (related_city_ids);
CREATE INDEX idx_festivals_cities ON festivals USING gin (related_city_ids);

-- standard B-tree index for foreign key lookups
CREATE INDEX idx_cities_district ON cities(district_id);
CREATE INDEX idx_places_city ON places(city_id);
CREATE INDEX idx_places_district ON places(district_id);
CREATE INDEX idx_rulers_dynasty ON history_rulers(dynasty_id);


-- ========================================================
-- 8. AUTOMATIC AUDIT TIMESTAMP TRIGGERS
-- ========================================================

-- Trigger function to automatically update updated_at columns on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_places_updated_at BEFORE UPDATE ON places FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_dynasties_updated_at BEFORE UPDATE ON dynasties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_history_rulers_updated_at BEFORE UPDATE ON history_rulers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_historical_events_updated_at BEFORE UPDATE ON historical_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_foods_updated_at BEFORE UPDATE ON foods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_festivals_updated_at BEFORE UPDATE ON festivals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_folk_arts_updated_at BEFORE UPDATE ON folk_arts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_folk_music_instruments_updated_at BEFORE UPDATE ON folk_music_instruments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_handicrafts_updated_at BEFORE UPDATE ON handicrafts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_attire_updated_at BEFORE UPDATE ON attire FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_languages_updated_at BEFORE UPDATE ON languages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_communities_tribes_updated_at BEFORE UPDATE ON communities_tribes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_cultural_etiquette_updated_at BEFORE UPDATE ON cultural_etiquette FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_unesco_sites_updated_at BEFORE UPDATE ON unesco_sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_royal_wedding_venues_updated_at BEFORE UPDATE ON royal_wedding_venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_unique_experiences_updated_at BEFORE UPDATE ON unique_experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_directory_listings_updated_at BEFORE UPDATE ON directory_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ========================================================
-- 9. ROW LEVEL SECURITY (RLS) & ACCESS CONTROL
-- ========================================================

-- Enable RLS on all 20 tables
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE dynasties ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_rulers ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE folk_arts ENABLE ROW LEVEL SECURITY;
ALTER TABLE folk_music_instruments ENABLE ROW LEVEL SECURITY;
ALTER TABLE handicrafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attire ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities_tribes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_etiquette ENABLE ROW LEVEL SECURITY;
ALTER TABLE unesco_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE royal_wedding_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE unique_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Read access (SELECT) policies: Anyone can read data (public select)
CREATE POLICY "Allow public select districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Allow public select cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public select places" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public select dynasties" ON dynasties FOR SELECT USING (true);
CREATE POLICY "Allow public select history_rulers" ON history_rulers FOR SELECT USING (true);
CREATE POLICY "Allow public select historical_events" ON historical_events FOR SELECT USING (true);
CREATE POLICY "Allow public select foods" ON foods FOR SELECT USING (true);
CREATE POLICY "Allow public select festivals" ON festivals FOR SELECT USING (true);
CREATE POLICY "Allow public select folk_arts" ON folk_arts FOR SELECT USING (true);
CREATE POLICY "Allow public select folk_music_instruments" ON folk_music_instruments FOR SELECT USING (true);
CREATE POLICY "Allow public select handicrafts" ON handicrafts FOR SELECT USING (true);
CREATE POLICY "Allow public select attire" ON attire FOR SELECT USING (true);
CREATE POLICY "Allow public select languages" ON languages FOR SELECT USING (true);
CREATE POLICY "Allow public select communities_tribes" ON communities_tribes FOR SELECT USING (true);
CREATE POLICY "Allow public select cultural_etiquette" ON cultural_etiquette FOR SELECT USING (true);
CREATE POLICY "Allow public select unesco_sites" ON unesco_sites FOR SELECT USING (true);
CREATE POLICY "Allow public select royal_wedding_venues" ON royal_wedding_venues FOR SELECT USING (true);
CREATE POLICY "Allow public select unique_experiences" ON unique_experiences FOR SELECT USING (true);
CREATE POLICY "Allow public select directory_listings" ON directory_listings FOR SELECT USING (true);
CREATE POLICY "Allow public select reviews" ON reviews FOR SELECT USING (true);

-- Restrict direct modification policies for reference tables (prevents anonymous/unauthorized mutations)
CREATE POLICY "Restrict insert districts" ON districts FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert cities" ON cities FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert places" ON places FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert dynasties" ON dynasties FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert history_rulers" ON history_rulers FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert historical_events" ON historical_events FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert foods" ON foods FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert festivals" ON festivals FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert folk_arts" ON folk_arts FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert folk_music_instruments" ON folk_music_instruments FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert handicrafts" ON handicrafts FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert attire" ON attire FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert languages" ON languages FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert communities_tribes" ON communities_tribes FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert cultural_etiquette" ON cultural_etiquette FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert unesco_sites" ON unesco_sites FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert royal_wedding_venues" ON royal_wedding_venues FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert unique_experiences" ON unique_experiences FOR INSERT WITH CHECK (false);

-- Allow public write access for user-driven interactions (reviews & listings registrations)
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert directory_listings" ON directory_listings FOR INSERT WITH CHECK (true);
