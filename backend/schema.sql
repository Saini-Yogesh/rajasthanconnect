-- ========================================================
-- RAJASTHANCONNECT DATABASE SCHEMA INITIALIZATION SCRIPT
-- Copy and run this script in the Supabase SQL Editor.
-- ========================================================

-- Clean up existing tables if they exist
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS directory_listings CASCADE;
DROP TABLE IF EXISTS history_rulers CASCADE;
DROP TABLE IF EXISTS culture_topics CASCADE;
DROP TABLE IF EXISTS festivals CASCADE;
DROP TABLE IF EXISTS foods CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- 1. Cities Table
CREATE TABLE cities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(150),
    description TEXT NOT NULL,
    image_url TEXT,
    best_time VARCHAR(100),
    weather_info JSONB,
    transport_info JSONB,
    emergency_contacts JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Places Table
CREATE TABLE places (
    id VARCHAR(50) PRIMARY KEY,
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    overview TEXT NOT NULL,
    history TEXT,
    best_time VARCHAR(150),
    timings VARCHAR(150),
    entry_fee VARCHAR(150),
    map_coords JSONB,
    parking VARCHAR(250),
    photography_rules VARCHAR(250),
    things_to_avoid TEXT,
    travel_tips TEXT,
    faq JSONB,
    image_urls TEXT[],
    rating DECIMAL(2,1) DEFAULT 5.0,
    related_ruler_ids TEXT[],
    related_food_ids TEXT[],
    related_festival_ids TEXT[],
    related_culture_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Food Guide Table
CREATE TABLE foods (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    origin VARCHAR(150),
    history TEXT,
    ingredients TEXT[],
    recipe TEXT[],
    price_range VARCHAR(100),
    nutritional_value TEXT,
    festivals_served TEXT[],
    best_restaurants JSONB,
    image_url TEXT,
    related_city_ids TEXT[],
    related_festival_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Festivals Table
CREATE TABLE festivals (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    importance TEXT NOT NULL,
    history TEXT,
    date VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    dress_code VARCHAR(150),
    special_foods TEXT[],
    travel_tips TEXT,
    image_urls TEXT[],
    related_city_ids TEXT[],
    related_food_ids TEXT[],
    related_culture_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Culture Topics Table
CREATE TABLE culture_topics (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    details JSONB,
    image_url TEXT,
    related_city_ids TEXT[],
    related_festival_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. History Rulers Table
CREATE TABLE history_rulers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    dynasty VARCHAR(150),
    reign_period VARCHAR(100),
    biography TEXT NOT NULL,
    battles JSONB,
    achievements TEXT[],
    image_url TEXT,
    related_city_ids TEXT[],
    related_place_ids TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Directory Listings (Verified local businesses)
CREATE TABLE directory_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id VARCHAR(50) REFERENCES cities(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 5.0,
    location_address TEXT NOT NULL,
    contact_phone VARCHAR(50),
    whatsapp VARCHAR(50),
    description TEXT NOT NULL,
    pricing VARCHAR(150),
    image_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    author VARCHAR(100) DEFAULT 'Anonymous Traveler',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- ========================================================
-- ROW LEVEL SECURITY (RLS) & ACCESS CONTROL CONFIGURATIONS
-- Keep the database secure. No direct anonymous updates.
-- ========================================================

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE places ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE culture_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_rulers ENABLE ROW LEVEL SECURITY;
ALTER TABLE directory_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 1. Read access (SELECT) policies: Anyone can read data (public select)
CREATE POLICY "Allow public select cities" ON cities FOR SELECT USING (true);
CREATE POLICY "Allow public select places" ON places FOR SELECT USING (true);
CREATE POLICY "Allow public select foods" ON foods FOR SELECT USING (true);
CREATE POLICY "Allow public select festivals" ON festivals FOR SELECT USING (true);
CREATE POLICY "Allow public select culture_topics" ON culture_topics FOR SELECT USING (true);
CREATE POLICY "Allow public select history_rulers" ON history_rulers FOR SELECT USING (true);
CREATE POLICY "Allow public select directory_listings" ON directory_listings FOR SELECT USING (true);
CREATE POLICY "Allow public select reviews" ON reviews FOR SELECT USING (true);

-- 2. Write access (INSERT, UPDATE, DELETE) policies:
CREATE POLICY "Restrict insert cities" ON cities FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert places" ON places FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert foods" ON foods FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert festivals" ON festivals FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert culture_topics" ON culture_topics FOR INSERT WITH CHECK (false);
CREATE POLICY "Restrict insert history_rulers" ON history_rulers FOR INSERT WITH CHECK (false);

-- Allow public inserts for user reviews and listing registrations
CREATE POLICY "Allow public insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert directory_listings" ON directory_listings FOR INSERT WITH CHECK (true);

-- ========================================================
-- SEED DATA FOR ENCYCLOPEDIA (AUTOMATICALLY GENERATED)
-- ========================================================

-- Seed Cities
INSERT INTO cities (id, name, tagline, description, image_url, best_time, weather_info, transport_info, emergency_contacts) VALUES ('jaipur', 'Jaipur', 'The Pink City', 'Jaipur, the capital of Rajasthan, was founded in 1727 by Maharaja Sawai Jai Singh II. It is famous for its majestic forts, beautiful palaces, rich culture, and distinctive pink-painted buildings that welcome visitors with royal hospitality.', 'https://images.unsplash.com/photo-1477584322813-ac05e3ec3d70?auto=format&fit=crop&w=800&q=80', 'October to March', '{"summer":"30°C - 45°C (Hot & Dry)","monsoon":"25°C - 35°C (Humid with moderate rainfall)","winter":"8°C - 22°C (Pleasant, perfect for sightseeing)"}'::JSONB, '{"metro":"Jaipur Metro connects Mansarovar to Badi Chaupar, making it easy to visit the Old City (Hawa Mahal, City Palace).","bus":"Local low-floor buses connect major hubs. RSRTC buses connect to other cities from Sindhi Camp Bus Stand.","airport":"Jaipur International Airport (Sanganer) is 12 km from the city center.","railway":"Jaipur Junction is well-connected to all major Indian cities with superfast trains."}'::JSONB, '{"police":"100 / +91 141 2385000","hospital":"+91 141 2560291 (SMS Hospital)","touristOffice":"+91 141 2822800 (RTDC Office)"}'::JSONB);
INSERT INTO cities (id, name, tagline, description, image_url, best_time, weather_info, transport_info, emergency_contacts) VALUES ('jodhpur', 'Jodhpur', 'The Blue City', 'Famed for its blue-painted houses in the old town, Jodhpur is dominated by the colossal Mehrangarh Fort rising 400 feet above the skyline. Founded in 1459 by Rao Jodha, it is a city of historic stepwells and vibrant spice markets.', 'https://images.unsplash.com/photo-1545247181-516ee733ca9c?auto=format&fit=crop&w=800&q=80', 'October to March', '{"summer":"32°C - 46°C (Extreme Heat)","monsoon":"26°C - 36°C (Short wet spells)","winter":"9°C - 24°C (Warm sunny days, chilly nights)"}'::JSONB, '{"metro":"No metro service available. Auto-rickshaws are the primary transport in narrow blue lanes.","bus":"City buses operate on main roads. Intercity buses depart from Raika Bagh bus stand.","airport":"Jodhpur Airport has regular flights connecting to major metros.","railway":"Jodhpur Railway Station (JU) is a major junction."}'::JSONB, '{"police":"100 / +91 291 2650777","hospital":"+91 291 2434221 (MDM Hospital)","touristOffice":"+91 291 2545083"}'::JSONB);
INSERT INTO cities (id, name, tagline, description, image_url, best_time, weather_info, transport_info, emergency_contacts) VALUES ('udaipur', 'Udaipur', 'The City of Lakes', 'Known as the ''Venice of the East'', Udaipur is a romantic destination situated around azure lakes and surrounded by the green Aravalli hills. Founded in 1559 by Maharana Udai Singh II, it houses the grand City Palace.', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80', 'September to March', '{"summer":"28°C - 40°C (Warm)","monsoon":"24°C - 32°C (Lush green landscapes)","winter":"10°C - 25°C (Charming and cool)"}'::JSONB, '{"metro":"No metro. Local transport consists of auto-rickshaws, app cabs, and ferry boats.","bus":"Udaipur City Bus Station connects to major hubs.","airport":"Maharana Pratap Airport (Dabok) is 22 km east of the city.","railway":"Udaipur City Railway Station is directly connected to Delhi and Jaipur."}'::JSONB, '{"police":"100 / +91 294 2413900","hospital":"+91 294 2412011 (MB Government Hospital)","touristOffice":"+91 294 2411535"}'::JSONB);
INSERT INTO cities (id, name, tagline, description, image_url, best_time, weather_info, transport_info, emergency_contacts) VALUES ('jaisalmer', 'Jaisalmer', 'The Golden City', 'Jaisalmer lies in the heart of the Great Indian Thar Desert. It is renowned for its golden sandstone fort (Sonar Qila) which is a living fort housing a quarter of the city''s population, ancient havelis, and desert sand dunes.', 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80', 'November to February', '{"summer":"35°C - 48°C (Scorching)","monsoon":"28°C - 38°C (Scant rainfall)","winter":"5°C - 22°C (Cold desert nights, sunny days)"}'::JSONB, '{"metro":"No metro. Best traveled via taxi or auto-rickshaw. Camel and 4x4 jeeps are used for desert safaris.","bus":"Local buses are limited. Private operators offer services near the fort.","airport":"Jaisalmer Airport has seasonal domestic flights in peak winter months.","railway":"Jaisalmer Railway Station connects directly to Delhi and Jaipur."}'::JSONB, '{"police":"100 / +91 2992 252200","hospital":"+91 2992 250100 (Jawahar Hospital)","touristOffice":"+91 2992 252406"}'::JSONB);
INSERT INTO cities (id, name, tagline, description, image_url, best_time, weather_info, transport_info, emergency_contacts) VALUES ('pushkar', 'Pushkar', 'The Holy Ghat Town', 'Pushkar is one of the oldest existing cities in India, situated on the shores of Lake Pushkar. Famous for its Brahma Temple and the annual Camel Fair, it is a sacred pilgrimage town for Hindus.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', 'October to March', '{"summer":"30°C - 44°C (Hot)","monsoon":"26°C - 34°C (Moderate rain)","winter":"8°C - 23°C (Pleasant)"}'::JSONB, '{"metro":"No metro. Best traveled on foot, by scooter, or auto-rickshaw.","bus":"Frequent buses connect Pushkar to Ajmer (15 km away) which is a major transport hub.","airport":"Kishangarh Airport (Ajmer) is 45 km away; Jaipur Airport is 150 km away.","railway":"Ajmer Junction is the nearest major railway station, connecting to all parts of India."}'::JSONB, '{"police":"100 / +91 145 2772046","hospital":"+91 145 2772029 (Government Hospital)","touristOffice":"+91 145 2627426 (Ajmer Office)"}'::JSONB);

-- Seed Foods
INSERT INTO foods (id, title, origin, history, ingredients, recipe, price_range, nutritional_value, festivals_served, best_restaurants, image_url, related_city_ids, related_festival_ids) VALUES ('dal-baati-churma', 'Dal Baati Churma', 'Mewar Dynasty, Rajasthan', 'Baati was originally a war ration. Soldiers of Mewar would bury dough balls in sand under the desert sun. Upon return, the baked dough was unearthed, dipped in ghee, and eaten with lentils (Dal) and crushed sweet wheat (Churma).', ARRAY['Baati: Whole wheat flour, Semolina, Ghee, Ajwain (carom seeds), Water, Salt', 'Dal: Moong dal, Chana dal, Toor dal, Ghee, Hing (asafoetida), Garlic, Onion, Spices', 'Churma: Coarse wheat flour, Sugar powder/Jaggery, Almonds, Cardamom, Ghee'], ARRAY['Mix wheat flour, semolina, salt, ghee, and ajwain. Knead a tight dough and shape into round balls.', 'Bake the baatis in a traditional clay oven or gas tandoor until golden brown and cracked.', 'Crack open the warm baatis and submerge them in pure Desi Ghee.', 'Boil the mixed lentils. Temper with ghee, cumin seeds, garlic, red chilies, and asafoetida.', 'For Churma, deep-fry wheat balls, crush them into powder, and mix with ghee, sugar, and cardamoms.', 'Serve hot Dal, Ghee-laden Baatis, and Sweet Churma with fresh onions and green chutney.'], 'INR 150 - INR 600 per plate', 'High-calorie, rich in carbohydrates, dietary fibers, and fats from ghee. Excellent source of plant protein.', ARRAY['Diwali', 'Makar Sankranti', 'Gangaur'], '[{"name":"Chokhi Dhani","city":"Jaipur","address":"Tonk Road, Jaipur"},{"name":"Krishna Dal Bati","city":"Udaipur","address":"Gulab Bagh Road, Udaipur"}]'::JSONB, 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80', ARRAY['jaipur', 'udaipur', 'jodhpur'], ARRAY['gangaur']);
INSERT INTO foods (id, title, origin, history, ingredients, recipe, price_range, nutritional_value, festivals_served, best_restaurants, image_url, related_city_ids, related_festival_ids) VALUES ('laal-maas', 'Rajasthani Laal Maas', 'Royal Kitchens of Mewar & Rajput Hunters', 'Laal Maas (Red Meat) was born in royal hunting camps. Meat from game like wild boars or deer was slow-cooked with ghee and fiery Mathania red chilies to mask the gamey odor. Today, tender mutton is cooked in yogurt, garlic, and red chilies.', ARRAY['Mutton (bone-in)', 'Mathania Red Chilies (dried and soaked into paste)', 'Yogurt (curd)', 'Garlic (used generously)', 'Whole spices (cardamom, cloves, cinnamon)', 'Mustard oil / Pure Ghee'], ARRAY['Heat ghee/mustard oil in a heavy pot and brown the whole spices.', 'Add sliced onions and fry until caramelized. Add mutton and sear on high heat.', 'Add garlic paste and fry. Fold in yogurt mixed with Mathania red chili paste.', 'Cover and slow cook for 1-2 hours until the meat is tender and the oil separates.', 'Optionally perform the dhungar charcoal technique for a smoky aroma.', 'Serve hot with Bajra Roti or steamed rice.'], 'INR 350 - INR 800 per serving', 'Rich in proteins, vitamin B12, iron, and highly spicy.', ARRAY['Royal Banquets', 'Holi'], '[{"name":"1135 AD","city":"Jaipur","address":"Amer Fort, Jaipur"},{"name":"Jharokha Restaurant","city":"Jodhpur","address":"Old City, Jodhpur"}]'::JSONB, 'https://images.unsplash.com/photo-1545247181-516ee733ca9c?auto=format&fit=crop&w=600&q=80', ARRAY['udaipur', 'jodhpur'], ARRAY['holi']);
INSERT INTO foods (id, title, origin, history, ingredients, recipe, price_range, nutritional_value, festivals_served, best_restaurants, image_url, related_city_ids, related_festival_ids) VALUES ('ghewar', 'Jaipuri Ghewar', 'Jaipur', 'Ghewar is a disc-shaped sweet cake made from flour and soaked in sugar syrup. Historically prepared during the arrival of monsoon, it is a traditional gift for daughters during the Teej festival.', ARRAY['All-purpose flour (maida), Milk, Ghee, Ice cubes, Cold water, Saffron sugar syrup, Pistachio and Almond slivers'], ARRAY['Rub ghee with ice cubes to make a smooth cream, then whisk in flour, milk, and ice-cold water into a thin batter.', 'Pour batter in a stream into hot ghee in a deep vessel, creating a honeycomb pattern.', 'Remove the golden fried disc and drain excess oil.', 'Soak in hot sugar syrup and garnish with rabdi (thick milk), saffron, and dry fruits.'], 'INR 300 - INR 700 per kg', 'High in carbohydrates, fats, and calcium from milk garnishes.', ARRAY['Teej', 'Gangaur', 'Raksha Bandhan'], '[{"name":"Laxmi Misthan Bhandar","city":"Jaipur","address":"Johari Bazar, Jaipur"}]'::JSONB, 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', ARRAY['jaipur'], ARRAY['teej', 'gangaur']);
INSERT INTO foods (id, title, origin, history, ingredients, recipe, price_range, nutritional_value, festivals_served, best_restaurants, image_url, related_city_ids, related_festival_ids) VALUES ('pyaz-kachori', 'Pyaz ki Kachori', 'Jodhpur', 'Originating in Jodhpur, this deep-fried pastry filled with spiced onions became a popular breakfast snack across Rajasthan during the late 19th century.', ARRAY['Maida (flour), Ghee, Nigella seeds, Spiced onion filling, Coriander seeds, Garam Masala'], ARRAY['Knead soft dough of flour, ghee, and salt.', 'Prepare filling by cooking chopped onions, potatoes, fennel, and local spices in oil.', 'Flatten dough discs, stuff with onion mix, seal, and deep fry slowly on low heat until golden and crispy.', 'Serve hot with sweet tamarind chutney and spicy mint chutney.'], 'INR 30 - INR 60 per piece', 'Savory pastry, rich in fats and carbs. Moderate spices stimulate digestion.', ARRAY['Makar Sankranti', 'Independence Day celebrations'], '[{"name":"Rawat Misthan Bhandar","city":"Jaipur","address":"Sindhi Camp, Jaipur"},{"name":"Janta Sweet Home","city":"Jodhpur","address":"Nai Sarak, Jodhpur"}]'::JSONB, 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=600&q=80', ARRAY['jaipur', 'jodhpur'], ARRAY['makar-sankranti']);
INSERT INTO foods (id, title, origin, history, ingredients, recipe, price_range, nutritional_value, festivals_served, best_restaurants, image_url, related_city_ids, related_festival_ids) VALUES ('malpua', 'Pushkar Malpua', 'Pushkar', 'Malpuas are sweet pancakes fried in ghee and dipped in sugar syrup. Pushkar''s malpuas are legendary, prepared with fresh rabdi (reduced milk) and served hot to pilgrims visiting the Brahma Temple.', ARRAY['Fresh Rabdi, Maida, Fennel seeds, Cardamom, Ghee, Sugar, Saffron'], ARRAY['Whisk rabdi, maida, and cardamom powder into a smooth batter.', 'Heat ghee in a shallow pan and pour ladlefuls of batter to fry until edges are crispy.', 'Soak immediately in warm saffron sugar syrup for 2 minutes, then garnish with pistachios.'], 'INR 250 - INR 500 per kg', 'Rich sweet, providing immediate energy. Source of calcium and fats.', ARRAY['Holi', 'Pushkar Fair', 'Janmashtami'], '[{"name":"Halwai Gali Sweet Shop","city":"Pushkar","address":"Main Market, Pushkar"}]'::JSONB, 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80', ARRAY['pushkar'], ARRAY['pushkar-fair']);
INSERT INTO foods (id, title, origin, history, ingredients, recipe, price_range, nutritional_value, festivals_served, best_restaurants, image_url, related_city_ids, related_festival_ids) VALUES ('ker-sangri', 'Ker Sangri', 'Thar Desert, Jaisalmer', 'A classic desert dish born out of necessity. Ker (desert berries) and Sangri (desert beans) grow wild in Thar. Dried for preservation, they are slow-cooked in oil and dry spices, providing key nutrition during droughts.', ARRAY['Ker berries (dried), Sangri beans (dried), Mustard oil, Yogurt, Red mathania chilies, Amchoor (mango powder), Spices'], ARRAY['Soak dried ker and sangri in water overnight, then boil with a pinch of salt.', 'Heat mustard oil, sauté cumin, asafoetida, and dried red chilies.', 'Add boiled berries and beans, cook with turmeric, chili powder, and amchoor.', 'Stir in yogurt and slow cook until the water absorbs and the oil separates.', 'Serve at room temperature with hot Bajra (millet) rotis.'], 'INR 150 - INR 350 per serving', 'Extremely rich in dietary fiber, proteins, and minerals like iron and potassium from native desert vegetation.', ARRAY['Gangaur', 'Local desert celebrations'], '[{"name":"Desert Boy''s Dhaba","city":"Jaisalmer","address":"Fort Road, Jaisalmer"}]'::JSONB, 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80', ARRAY['jaisalmer'], ARRAY['desert-festival']);

-- Seed Festivals
INSERT INTO festivals (id, title, importance, history, date, location, dress_code, special_foods, travel_tips, image_urls, related_city_ids, related_food_ids, related_culture_ids) VALUES ('gangaur', 'Gangaur Festival', 'Gangaur is one of the most vital festivals of Rajasthan. It is celebrated by women to worship Goddess Gauri (Parvati), the consort of Lord Shiva, representing marital fidelity, love, and household prosperity.', 'The word Gangaur is a combination of ''Gan'' (Shiva) and ''Gaur'' (Gauri). The festival dates back centuries and is a celebration of spring''s arrival and the harvest season.', 'March - April (18 days after Holi)', 'Celebrated across Rajasthan, with the most famous processions taking place in Jaipur and Udaipur.', 'Traditional Rajasthani attire: Red/Green/Yellow Lehengas or bandhani sarees for women. Royal turbans for men.', ARRAY['Ghewar', 'Kheer', 'Churma Ladoo'], 'Arrive in Jaipur or Udaipur 1-2 days early. The royal procession starts from City Palace and proceeds through old market streets. Book a wind-view rooftop seat in advance.', ARRAY['https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80'], ARRAY['jaipur', 'udaipur'], ARRAY['ghewar', 'dal-baati-churma'], ARRAY['ghoomar']);
INSERT INTO festivals (id, title, importance, history, date, location, dress_code, special_foods, travel_tips, image_urls, related_city_ids, related_food_ids, related_culture_ids) VALUES ('pushkar-fair', 'Pushkar Camel Fair', 'One of the world''s largest camel and livestock fairs. It is also an important Hindu pilgrimage, where devotees gather at Lake Pushkar to take a holy dip during Kartik Purnima.', 'Originally a trade fair for camel herders and cattle traders. Today, it is a global attraction featuring cultural contests, folk music, and hot-air balloons.', 'November', 'Pushkar, Ajmer District, Rajasthan', 'Casual cotton wear. A hat/cap and sunglasses are highly recommended.', ARRAY['Malpua', 'Dal Baati'], 'Book accommodation months in advance. Visit the trading grounds early at sunrise for spectacular photography.', ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'], ARRAY['pushkar'], ARRAY['malpua'], ARRAY['ghoomar']);
INSERT INTO festivals (id, title, importance, history, date, location, dress_code, special_foods, travel_tips, image_urls, related_city_ids, related_food_ids, related_culture_ids) VALUES ('desert-festival', 'Jaisalmer Desert Festival', 'A three-day cultural extravaganza showcasing the colorful arts, camel races, and folk dances of Rajasthan set against the backdrop of the golden fort.', 'Started by Rajasthan Tourism to showcase desert culture to global tourists. Highlights include turbans-tying contests, longest mustache competitions, and Mr. Desert pageants.', 'February', 'Jaisalmer and Sam Sand Dunes', 'Bright traditional colors (yellows, oranges) fit well with the golden sands.', ARRAY['Ker Sangri', 'Bajra Khichdi'], 'Spend the evenings at Sam sand dunes to watch the fire dancers and listen to live Manganiyar musical performances under the moon.', ARRAY['https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80'], ARRAY['jaisalmer'], ARRAY['ker-sangri'], ARRAY['pagdi']);

-- Seed Culture Topics
INSERT INTO culture_topics (id, category, title, description, details, image_url, related_city_ids, related_festival_ids) VALUES ('pagdi', 'Clothing & Attire', 'The Rajasthani Pagdi (Turban)', 'The Turban is a symbol of pride, honor, and respect in Rajasthan. Historically, a man''s caste, region, and economic status could be determined by the style, size, and tying method of his Pagdi.', '{"types":["Safas (shorter and broader)","Pachrangi (5 colors, worn during festivals)","Leheriya (monsoon stripes)"],"significance":"Turban exchange represents ultimate honor and brotherhood. Knocking off a turban is considered a grave insult."}'::JSONB, 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80', ARRAY['jodhpur', 'jaipur', 'jaisalmer'], ARRAY['desert-festival', 'gangaur']);
INSERT INTO culture_topics (id, category, title, description, details, image_url, related_city_ids, related_festival_ids) VALUES ('ghoomar', 'Music & Dance', 'Ghoomar Dance', 'Ghoomar is a traditional folk dance of Rajasthan, originally performed by women of the Bhil tribe and later adopted by Rajput royalty. The dance involves swirling movements in circles, highlighting flared skirts (ghagras).', '{"origin":"Bhil Tribe, later adopted by Mewar royalty","characteristics":"Graceful pirouettes, hand movements, and face veils. Performed during weddings and Gangaur."}'::JSONB, 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80', ARRAY['udaipur', 'jaipur'], ARRAY['gangaur', 'pushkar-fair']);
INSERT INTO culture_topics (id, category, title, description, details, image_url, related_city_ids, related_festival_ids) VALUES ('blue-pottery', 'Crafts', 'Jaipuri Blue Pottery', 'Blue Pottery is widely recognized as a traditional craft of Jaipur. Imported from Persia, it uses quartz, glass cullet, and cobalt blue dye, baked at low temperatures without using natural clay.', '{"origin":"Turko-Persian origin, popularized by Sawai Ram Singh II","characteristics":"Translucent turquoise glaze, decorated with birds and floral designs. Does not develop cracks."}'::JSONB, 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80', ARRAY['jaipur'], ARRAY['teej']);
INSERT INTO culture_topics (id, category, title, description, details, image_url, related_city_ids, related_festival_ids) VALUES ('block-printing', 'Crafts', 'Sanganeri Block Printing', 'Block Printing is an ancient textile art of hand-stamping cotton fabrics with hand-carved teakwood blocks using natural dyes. Sanganer and Bagru near Jaipur are the primary craft hubs.', '{"origin":"Sanganer village, dating back 500 years","characteristics":"Intricate floral bootis (motifs), off-white backgrounds, and eco-friendly vegetable dyes."}'::JSONB, 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80', ARRAY['jaipur'], ARRAY['teej']);

-- Seed History Rulers
INSERT INTO history_rulers (id, name, dynasty, reign_period, biography, battles, achievements, image_url, related_city_ids, related_place_ids) VALUES ('maharana-pratap', 'Maharana Pratap', 'Sisodia Rajput Dynasty of Mewar', '1572 - 1597', 'Maharana Pratap Singh was a Rajput ruler of Mewar. He is revered as a hero for his military resistance against the expansionist policies of the Mughal Empire under Emperor Akbar.', '[{"name":"Battle of Haldighati (1576)","description":"The clash between Mewar forces led by Pratap and the Mughal army commanded by Man Singh I."},{"name":"Battle of Dewair (1582)","description":"A decisive battle where Maharana Pratap routed the Mughal garrisons, reclaiming most of Mewar."}]'::JSONB, ARRAY['Pioneered forest guerrilla warfare in the Aravallis.', 'Reclaimed almost the entirety of Mewar except Chittorgarh.', 'Immortalized his loyal warhorse Chetak.'], 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80', ARRAY['udaipur'], ARRAY['city-palace-udaipur', 'lake-pichola']);
INSERT INTO history_rulers (id, name, dynasty, reign_period, biography, battles, achievements, image_url, related_city_ids, related_place_ids) VALUES ('maharaja-sawai-jai-singh', 'Maharaja Sawai Jai Singh II', 'Kachwaha Rajput Dynasty', '1699 - 1743', 'The statesman, builder, and astronomer who founded the planned city of Jaipur in 1727. He constructed five astronomical observatories (Jantar Mantars) across India.', '[{"name":"Battle of Gangwana (1741)","description":"A historic battle fought between Kachwaha-led alliance and the Rathores of Marwar."}]'::JSONB, ARRAY['Founded India''s first mathematically planned city (Jaipur) based on Vastu Shastra.', 'Constructed the massive Jantar Mantar observatory in Jaipur.', 'Sponsored translations of mathematical works of Euclid and Ptolemy into Sanskrit.'], 'https://images.unsplash.com/photo-1614082242765-7c98cf0f3df3?auto=format&fit=crop&w=600&q=80', ARRAY['jaipur'], ARRAY['amber-fort', 'hawa-mahal']);
INSERT INTO history_rulers (id, name, dynasty, reign_period, biography, battles, achievements, image_url, related_city_ids, related_place_ids) VALUES ('rao-jodha', 'Rao Jodha', 'Rathore Rajput Dynasty', '1438 - 1489', 'The king of Marwar who shifted the capital from Mandore to the safer high ridge of Mehrangarh, founding the city of Jodhpur in 1459.', '[{"name":"Annexation of Mandore (1453)","description":"Rao Jodha successfully fought and reclaimed Mandore from the Mewar forces."}]'::JSONB, ARRAY['Founded Jodhpur city in 1459.', 'Constructed the majestic Mehrangarh Fort on Trikuta Hill.', 'Secured Marwar''s borders through alliances and treaties with Mewar.'], 'https://images.unsplash.com/photo-1545247181-516ee733ca9c?auto=format&fit=crop&w=600&q=80', ARRAY['jodhpur'], ARRAY['mehrangarh-fort', 'jaswant-thada']);
INSERT INTO history_rulers (id, name, dynasty, reign_period, biography, battles, achievements, image_url, related_city_ids, related_place_ids) VALUES ('rawal-jaisal', 'Rawal Jaisal', 'Bhati Rajput Dynasty', '1153 - 1168', 'The Bhati Rajput chieftain who founded the golden desert citadel city of Jaisalmer in 1156 AD.', '[{"name":"Capture of Ludarva (1156)","description":"Conquered the old capital of Ludarva and decided to shift the capital to the safer Trikuta Hill."}]'::JSONB, ARRAY['Founded Jaisalmer city and the living golden fort (Sonar Qila) in 1156 AD.', 'Established strong trade routes for caravans traveling between India and Persia.'], 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80', ARRAY['jaisalmer'], ARRAY['sonar-qila', 'sam-sand-dunes']);

-- Seed Places
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('amber-fort', 'jaipur', 'Amber Fort (Amer Fort)', 'Forts', 'Amber Fort, located in Amer, 11 km from Jaipur, is a principal tourist attraction. Set on a hill, it is known for its artistic style elements, combining Hindu and Rajput architecture. The fort is built of red sandstone and marble.', 'Constructed by Raja Man Singh I in 1592, Amber Fort served as the seat of the Kachwaha Rajputs before Jaipur was founded. It features the beautiful Sheesh Mahal (Mirror Palace).', 'October to March, late afternoon.', '8:00 AM - 5:30 PM (Day), 6:30 PM - 9:15 PM (Night)', 'INR 100 for Indians, INR 500 for Foreigners', '{"lat":26.9855,"lng":75.8513}'::JSONB, 'Ample parking available at the foothills.', 'Allowed. Mobile: Free. Pro: INR 50-100.', 'Avoid peak midday heat and unofficial guides.', 'Wear comfortable walking shoes. Take a jeep up from the parking stand.', '[{"q":"Is Amber Fort open on holidays?","a":"Yes, open 365 days a year."},{"q":"How long does it take to see the fort?","a":"About 2 to 3 hours."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1614082242765-7c98cf0f3df3?auto=format&fit=crop&w=600&q=80'], 4.8, ARRAY['maharaja-sawai-jai-singh'], ARRAY['dal-baati-churma'], ARRAY['gangaur'], ARRAY['blue-pottery']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('hawa-mahal', 'jaipur', 'Hawa Mahal (Palace of Winds)', 'Palaces', 'Hawa Mahal is a palace in Jaipur, built from red and pink sandstone. The structure features 953 small windows (jharokhas) decorated with intricate latticework.', 'Built in 1799 by Maharaja Sawai Pratap Singh, grandson of Sawai Jai Singh, designed by Lal Chand Ustad. Its shape resembles the crown of Lord Krishna.', 'Early morning around sunrise.', '9:00 AM - 5:00 PM daily', 'INR 50 for Indians, INR 200 for Foreigners', '{"lat":26.9239,"lng":75.8267}'::JSONB, 'No parking at the monument. Park at Ram Niwas Bagh.', 'Allowed inside. Best photos of facade taken from cafes across the street.', 'Do not buy gemstones from street sellers right outside.', 'Entrance is from the rear side near the Town Hall, not the front street.', '[{"q":"Why so many windows?","a":"To allow royal ladies to watch street festivals without being seen and let cool air circulate."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=600&q=80'], 4.7, ARRAY['maharaja-sawai-jai-singh'], ARRAY['pyaz-kachori'], ARRAY['teej'], ARRAY['block-printing']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('mehrangarh-fort', 'jodhpur', 'Mehrangarh Fort', 'Forts', 'Mehrangarh Fort, located in Jodhpur, is one of the largest forts in India. Built around 1459 by Rao Jodha, the fort is situated 410 feet above the city skyline.', 'Rao Jodha founded Jodhpur in 1459. Mehrangarh (''Fort of the Sun'') was constructed as the new secure capital of the Rathore clan, replacing Mandore.', 'October to March, preferably in the morning.', '9:00 AM - 5:00 PM daily', 'INR 100 for Indians, INR 600 for Foreigners (includes audio guide)', '{"lat":26.2978,"lng":73.0189}'::JSONB, 'Available near the main entrance gate.', 'Mobile is free. Camera: INR 100. Video: INR 200.', 'Avoid walking up the ramp without water in the midday heat.', 'Get the audio guide; it is narrated beautifully and provides a detailed step-by-step tour.', '[{"q":"Is there an elevator?","a":"Yes, available for a small fee for senior citizens/disabled visitors."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1545247181-516ee733ca9c?auto=format&fit=crop&w=600&q=80'], 4.9, ARRAY['rao-jodha'], ARRAY['mirchi-bada'], ARRAY['marwar-festival'], ARRAY['pagdi']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('jaswant-thada', 'jodhpur', 'Jaswant Thada', 'Palaces', 'Jaswant Thada is an architectural marvel located in Jodhpur. It is a white marble memorial built in memory of Maharaja Jaswant Singh II, often described as the Taj Mahal of Marwar.', 'Built by Sardar Singh in 1899 to honor his father. The marble sheets are extremely thin and polished, allowing them to glow when illuminated by the sun''s rays.', 'October to March, late afternoon.', '9:00 AM - 5:00 PM daily', 'INR 30 for Indians, INR 50 for Foreigners', '{"lat":26.3025,"lng":73.0232}'::JSONB, 'Dedicated parking available right outside the grounds.', 'Allowed. Ideal venue for portrait photography.', 'Do not touch the delicate marble carvings.', 'Sit by the small lake adjacent to the cenotaph for a peaceful, quiet view of Mehrangarh.', '[{"q":"Is it a temple?","a":"No, it is a royal cremation ground and cenotaph monument."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'], 4.6, ARRAY['rao-jodha'], ARRAY['mirchi-bada'], ARRAY['marwar-festival'], ARRAY['pagdi']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('city-palace-udaipur', 'udaipur', 'Udaipur City Palace', 'Palaces', 'The City Palace is a monumental complex built on the east bank of Lake Pichola. It was built over a period of nearly 400 years, with contributions from several Mewar rulers.', 'Maharana Udai Singh II began construction in 1559 when he shifted the capital from Chittorgarh to Udaipur. It showcases Mewari architecture.', 'September to March, late morning.', '9:30 AM - 5:30 PM daily', 'INR 250 for Adults, INR 100 for Children', '{"lat":24.5764,"lng":73.6836}'::JSONB, 'Dedicated paid parking available within the palace gates.', 'Camera fees apply. Tripods are not allowed inside.', 'Avoid rushing; the corridors are narrow and steep.', 'Combine this visit with a boat ride to Jag Mandir on Lake Pichola.', '[{"q":"Is the royal family still living here?","a":"Yes, they reside in a private closed wing of the palace."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'], 4.8, ARRAY['maharana-pratap'], ARRAY['dal-baati-churma'], ARRAY['gangaur'], ARRAY['ghoomar']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('lake-pichola', 'udaipur', 'Lake Pichola', 'Lakes', 'Lake Pichola is an artificial fresh water lake created in the year 1362 AD, named after the nearby Picholi village. It houses the floating Lake Palace and Jag Mandir.', 'Built by a local Banjara tribal member during the reign of Maharana Lakha. Later, Maharana Udai Singh II expanded the lake and built palaces on its shores.', 'September to March, around sunset.', '9:00 AM - 6:00 PM daily (Boating)', 'Free entry to banks. Boat ride: INR 400 (Day), INR 700 (Sunset)', '{"lat":24.575,"lng":73.678}'::JSONB, 'Park at City Palace or Lal Ghat municipal stands.', 'Allowed. Incredible sunset lighting.', 'Do not litter or bathe in non-designated ghats.', 'Take the official boat ride from Rameshwar Ghat inside the City Palace.', '[{"q":"Is the lake dry in summer?","a":"In severe drought years it can dry up, but modern canals keep it mostly filled."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80'], 4.7, ARRAY['maharana-pratap'], ARRAY['laal-maas'], ARRAY['gangaur'], ARRAY['ghoomar']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('sonar-qila', 'jaisalmer', 'Jaisalmer Fort (Sonar Qila)', 'Forts', 'Jaisalmer Fort is one of the very few ''living forts'' in the world, as nearly one-fourth of the old city''s population resides within the fort walls.', 'Built in 1156 AD by the Bhati Rajput ruler Rawal Jaisal, from whom it derives its name. Built on Trikuta Hill amidst the Thar desert, its yellow sandstone glow gives it the title ''Golden Fort''.', 'November to February.', '9:00 AM - 6:00 PM daily', 'Free entry. Museum inside has charges (INR 250).', '{"lat":26.9124,"lng":70.9126}'::JSONB, 'Available outside the main fort gates.', 'Free inside the streets. Museum has charges.', 'Be cautious of pushy hotel touts at the fort entrance.', 'Explore the narrow alleys early in the morning before shops open to experience the local lifestyle.', '[{"q":"Why is it called a living fort?","a":"Because it contains active residential houses, hotels, temples, and shops still occupied by descendants of royal servers."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=600&q=80'], 4.9, ARRAY['rawal-jaisal'], ARRAY['ker-sangri'], ARRAY['desert-festival'], ARRAY['pagdi']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('sam-sand-dunes', 'jaisalmer', 'Sam Sand Dunes', 'Deserts', 'Sam Sand Dunes are the iconic sweeping sand dunes of the Thar Desert, situated 45 km west of Jaisalmer, popular for camel safaris and camping.', 'Formed by wind erosion and accumulation of sand, these dunes are a natural landmark that represents the true desert ecology of Rajasthan.', 'November to February, late afternoon.', 'Open 24 hours. Safaris operate from 4:00 PM - 7:00 PM.', 'Free entry. Camel ride: INR 200-500. Jeep safari: INR 1500.', '{"lat":26.8288,"lng":70.505}'::JSONB, 'Available at desert resort camps.', 'Allowed. Perfect for silhouette shots at sunset.', 'Avoid visiting in midday heat (March to October).', 'Stay overnight in a desert camp tent to experience traditional Rajasthani folk music and starlit skies.', '[{"q":"Are camel rides safe?","a":"Yes, but hold on tight when the camel sits or stands, as it tilts forward and back."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'], 4.8, ARRAY['rawal-jaisal'], ARRAY['ker-sangri'], ARRAY['desert-festival'], ARRAY['ghoomar']);
INSERT INTO places (id, city_id, title, category, overview, history, best_time, timings, entry_fee, map_coords, parking, photography_rules, things_to_avoid, travel_tips, faq, image_urls, rating, related_ruler_ids, related_food_ids, related_festival_ids, related_culture_ids) VALUES ('brahma-temple', 'pushkar', 'Jagatpita Brahma Mandir', 'Temples', 'Located close to Pushkar Lake, this is one of the very few temples in the world dedicated to Lord Brahma, the creator god in Hinduism.', 'Although the current structure dates back to the 14th century, the temple site is believed to be 2,000 years old. Legend says Brahma performed a yajna here.', 'October to March.', '6:00 AM - 8:00 PM daily', 'Free entry', '{"lat":26.488,"lng":74.551}'::JSONB, 'No parking near the temple. Park at municipal stands 500m away.', 'Cameras and phones are strictly prohibited inside the sanctum. Lockers are available.', 'Avoid local priests promising special pooja rituals in exchange for large sums of money.', 'Bathe or wash hands at the Pushkar Ghats before entering the temple.', '[{"q":"Why are there so few Brahma temples?","a":"According to legend, Brahma was cursed by his wife Savitri that he would not be worshipped anywhere except Pushkar."}]'::JSONB, ARRAY['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'], 4.6, '{}'::TEXT[], ARRAY['malpua'], ARRAY['pushkar-fair'], ARRAY['ghoomar']);

-- Seed Directory Listings
INSERT INTO directory_listings (city_id, title, category, subcategory, rating, location_address, contact_phone, whatsapp, description, pricing, image_url, is_verified) VALUES ('jaipur', 'Shree Balaji Heritage Tours', 'Guides', 'Heritage Walking Tours', 4.9, '102 Hawa Mahal Bazaar Road, Jaipur, Rajasthan', '+91 98290 12345', '+91 98290 12345', 'Specializing in historical walking tours of Hawa Mahal, Amer Fort, and Jantar Mantar. Licensed English and Hindi speaking guides.', 'INR 800 - INR 1500 per group', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80', true);
INSERT INTO directory_listings (city_id, title, category, subcategory, rating, location_address, contact_phone, whatsapp, description, pricing, image_url, is_verified) VALUES ('udaipur', 'Lake City Royal Palace Stay', 'Hotels', 'Heritage Hotel & Haveli', 4.7, '14 Lal Ghat, Lake Pichola, Udaipur, Rajasthan', '+91 294 2420001', '+91 94140 00012', 'Experience true royal hospitality at our lakefront heritage hotel. Stunning views of Lake Pichola and authentic Mewari dining.', 'INR 4500 - INR 12000 per night', 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80', true);
INSERT INTO directory_listings (city_id, title, category, subcategory, rating, location_address, contact_phone, whatsapp, description, pricing, image_url, is_verified) VALUES ('jaipur', 'Laxmi Misthan Bhandar (LMB)', 'Restaurants', 'Rajasthani Thali & Sweets', 4.6, 'Johari Bazar, Old City, Jaipur, Rajasthan', '+91 141 2565844', '+91 98290 98290', 'Famed vegetarian landmark since 1954. Best place for a grand Rajasthani Thali, Paneer Ghewar, Onion Kachori, and traditional sweets.', 'INR 300 - INR 800 per head', 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=600&q=80', true);
INSERT INTO directory_listings (city_id, title, category, subcategory, rating, location_address, contact_phone, whatsapp, description, pricing, image_url, is_verified) VALUES ('jaipur', 'Mahaveer Blue Pottery Workshop', 'Shops', 'Handicrafts & Souvenirs', 4.9, 'Naila Road, Sanganer, Jaipur, Rajasthan', '+91 98870 98765', '+91 98870 98765', 'Learn block printing and blue pottery from award-winning artisans. Buy directly from local craftspeople at workshop rates.', 'INR 100 - INR 5000', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=600&q=80', true);

-- Seed Reviews
INSERT INTO reviews (item_id, item_type, rating, comment, author) VALUES ('amber-fort', 'place', 5, 'Amber Fort is a masterclass in architecture. The Sheesh Mahal (Mirror Palace) was breathtaking. Protip: hire a guide at the ticket window to explain the vents and mirror placements!', 'Elena Rostova');
INSERT INTO reviews (item_id, item_type, rating, comment, author) VALUES ('dal-baati-churma', 'food', 5, 'Best food I have ever had! The ghee makes it extremely rich, but the taste of fire-baked baati and mixed dal is something you cannot find anywhere else in the world.', 'Rajesh Sharma');
