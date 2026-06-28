import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { CITIES, PLACES, FOODS, FESTIVALS, CULTURE_TOPICS, HISTORY_RULERS, DIRECTORY_LISTINGS, REVIEWS } from './seedData.js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in your .env file to seed the database!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('🚀 Connecting to Supabase at: ' + supabaseUrl);
  console.log('🧹 Wiping existing database tables...');

  try {
    // Delete in correct order (child tables first to satisfy foreign keys)
    await supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('directory_listings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('places').delete().neq('id', '_none_');
    await supabase.from('cities').delete().neq('id', '_none_');
    await supabase.from('foods').delete().neq('id', '_none_');
    await supabase.from('festivals').delete().neq('id', '_none_');
    await supabase.from('culture_topics').delete().neq('id', '_none_');
    await supabase.from('history_rulers').delete().neq('id', '_none_');
    console.log('✅ Tables cleaned successfully.');

    // 1. Seed Cities
    console.log('📌 Seeding Cities...');
    const mappedCities = CITIES.map(c => ({
      id: c.id,
      name: c.name,
      tagline: c.tagline,
      description: c.description,
      image_url: c.imageUrl,
      best_time: c.bestTime,
      weather_info: c.weatherInfo,
      transport_info: c.transportInfo,
      emergency_contacts: c.emergencyContacts
    }));
    let { error: errCities } = await supabase.from('cities').insert(mappedCities);
    if (errCities) throw errCities;

    // 2. Seed Foods
    console.log('📌 Seeding Foods...');
    const mappedFoods = FOODS.map(f => ({
      id: f.id,
      title: f.title,
      origin: f.origin,
      history: f.history,
      ingredients: f.ingredients,
      recipe: f.recipe,
      price_range: f.priceRange,
      nutritional_value: f.nutritionalValue,
      festivals_served: f.festivalsServed,
      best_restaurants: f.bestRestaurants,
      image_url: f.imageUrl,
      related_city_ids: f.related_city_ids || [],
      related_festival_ids: f.related_festival_ids || []
    }));
    let { error: errFoods } = await supabase.from('foods').insert(mappedFoods);
    if (errFoods) throw errFoods;

    // 3. Seed Festivals
    console.log('📌 Seeding Festivals...');
    const mappedFestivals = FESTIVALS.map(f => ({
      id: f.id,
      title: f.title,
      importance: f.importance,
      history: f.history,
      date: f.date,
      location: f.location,
      dress_code: f.dressCode,
      special_foods: f.specialFoods,
      travel_tips: f.travelTips,
      image_urls: f.imageUrls,
      related_city_ids: f.related_city_ids || [],
      related_food_ids: f.related_food_ids || [],
      related_culture_ids: f.related_culture_ids || []
    }));
    let { error: errFestivals } = await supabase.from('festivals').insert(mappedFestivals);
    if (errFestivals) throw errFestivals;

    // 4. Seed Culture Topics
    console.log('📌 Seeding Culture Topics...');
    const mappedCulture = CULTURE_TOPICS.map(c => ({
      id: c.id,
      category: c.category,
      title: c.title,
      description: c.description,
      details: c.details,
      image_url: c.imageUrl,
      related_city_ids: c.related_city_ids || [],
      related_festival_ids: c.related_festival_ids || []
    }));
    let { error: errCulture } = await supabase.from('culture_topics').insert(mappedCulture);
    if (errCulture) throw errCulture;

    // 5. Seed History Rulers
    console.log('📌 Seeding Rulers...');
    const mappedRulers = HISTORY_RULERS.map(r => ({
      id: r.id,
      name: r.name,
      dynasty: r.dynasty,
      reign_period: r.reignPeriod,
      biography: r.biography,
      battles: r.battles,
      achievements: r.achievements,
      image_url: r.imageUrl,
      related_city_ids: r.related_city_ids || [],
      related_place_ids: r.related_place_ids || []
    }));
    let { error: errRulers } = await supabase.from('history_rulers').insert(mappedRulers);
    if (errRulers) throw errRulers;

    // 6. Seed Places
    console.log('📌 Seeding Places...');
    const mappedPlaces = PLACES.map(p => ({
      id: p.id,
      city_id: p.cityId,
      title: p.title,
      category: p.category,
      overview: p.overview,
      history: p.history,
      best_time: p.bestTime,
      timings: p.timings,
      entry_fee: p.entryFee,
      map_coords: p.mapCoords,
      parking: p.parking,
      photography_rules: p.photographyRules,
      things_to_avoid: p.thingsAvoid,
      travel_tips: p.travelTips,
      faq: p.faq,
      image_urls: p.imageUrls,
      rating: p.rating,
      related_ruler_ids: p.related_ruler_ids || [],
      related_food_ids: p.related_food_ids || [],
      related_festival_ids: p.related_festival_ids || [],
      related_culture_ids: p.related_culture_ids || []
    }));
    let { error: errPlaces } = await supabase.from('places').insert(mappedPlaces);
    if (errPlaces) throw errPlaces;

    // 7. Seed Directory Listings
    console.log('📌 Seeding Directory Listings...');
    const mappedListings = DIRECTORY_LISTINGS.map(d => ({
      city_id: d.cityId,
      title: d.title,
      category: d.category,
      subcategory: d.subcategory,
      rating: d.rating,
      location_address: d.locationAddress,
      contact_phone: d.contactPhone,
      whatsapp: d.whatsapp,
      description: d.description,
      pricing: d.pricing,
      image_url: d.imageUrl,
      is_verified: d.isVerified
    }));
    let { error: errListings } = await supabase.from('directory_listings').insert(mappedListings);
    if (errListings) throw errListings;

    // 8. Seed Reviews
    console.log('📌 Seeding Reviews...');
    const mappedReviews = REVIEWS.map(r => ({
      item_id: r.itemId,
      item_type: r.itemType,
      rating: r.rating,
      comment: r.comment,
      author: r.author,
      created_at: r.createdAt
    }));
    let { error: errReviews } = await supabase.from('reviews').insert(mappedReviews);
    if (errReviews) throw errReviews;

    console.log('🎉 Database seeding completed successfully!');
  } catch (err) {
    console.error('❌ Error during seeding database:', err.message || err);
    process.exit(1);
  }
}

run();
