import { createClient } from "@supabase/supabase-js";
import {
  CITIES,
  PLACES,
  FOODS,
  FESTIVALS,
  CULTURE_TOPICS,
  HISTORY_RULERS,
  DIRECTORY_LISTINGS,
  REVIEWS,
} from "./seedData.js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

const isSupabaseConfigured =
  supabaseUrl.trim() !== "" && supabaseKey.trim() !== "";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (isSupabaseConfigured) {
  console.log("🔌 Connected to Supabase DB: " + supabaseUrl);
} else {
  console.log(
    "⚠️ Supabase credentials not found. Running in Local Fallback Mode with built-in seed dataset.",
  );
}

let localReviews = [...REVIEWS];

const mapCity = (c) => {
  if (!c) return null;
  return {
    ...c,
    // CamelCase fields
    imageUrl: c.image_url !== undefined ? c.image_url : c.imageUrl,
    bestTime: c.best_time !== undefined ? c.best_time : c.bestTime,
    weatherInfo: c.weather_info !== undefined ? c.weather_info : c.weatherInfo,
    transportInfo:
      c.transport_info !== undefined ? c.transport_info : c.transportInfo,
    emergencyContacts:
      c.emergency_contacts !== undefined
        ? c.emergency_contacts
        : c.emergencyContacts,
    // Snake_case fields
    image_url: c.image_url !== undefined ? c.image_url : c.imageUrl,
    best_time: c.best_time !== undefined ? c.best_time : c.bestTime,
    weather_info: c.weather_info !== undefined ? c.weather_info : c.weatherInfo,
    transport_info:
      c.transport_info !== undefined ? c.transport_info : c.transportInfo,
    emergency_contacts:
      c.emergency_contacts !== undefined
        ? c.emergency_contacts
        : c.emergencyContacts,
  };
};

const mapPlace = (p) => {
  if (!p) return null;
  return {
    ...p,
    // CamelCase fields
    cityId: p.city_id !== undefined ? p.city_id : p.cityId,
    entryFee: p.entry_fee !== undefined ? p.entry_fee : p.entryFee,
    mapCoords: p.map_coords !== undefined ? p.map_coords : p.mapCoords,
    photographyRules:
      p.photography_rules !== undefined
        ? p.photography_rules
        : p.photographyRules,
    thingsAvoid:
      p.things_to_avoid !== undefined ? p.things_to_avoid : p.thingsAvoid,
    travelTips: p.travel_tips !== undefined ? p.travel_tips : p.travelTips,
    imageUrls: p.image_urls !== undefined ? p.image_urls : p.imageUrls,
    // Snake_case fields
    city_id: p.city_id !== undefined ? p.city_id : p.cityId,
    entry_fee: p.entry_fee !== undefined ? p.entry_fee : p.entryFee,
    map_coords: p.map_coords !== undefined ? p.map_coords : p.mapCoords,
    photography_rules:
      p.photography_rules !== undefined
        ? p.photography_rules
        : p.photographyRules,
    things_to_avoid:
      p.things_to_avoid !== undefined ? p.things_to_avoid : p.thingsAvoid,
    travel_tips: p.travel_tips !== undefined ? p.travel_tips : p.travelTips,
    image_urls: p.image_urls !== undefined ? p.image_urls : p.imageUrls,
  };
};

const mapFood = (f) => {
  if (!f) return null;
  return {
    ...f,
    // CamelCase fields
    priceRange: f.price_range !== undefined ? f.price_range : f.priceRange,
    nutritionalValue:
      f.nutritional_value !== undefined
        ? f.nutritional_value
        : f.nutritionalValue,
    festivalsServed:
      f.festivals_served !== undefined ? f.festivals_served : f.festivalsServed,
    bestRestaurants:
      f.best_restaurants !== undefined ? f.best_restaurants : f.bestRestaurants,
    imageUrl: f.image_url !== undefined ? f.image_url : f.imageUrl,
    // Snake_case fields
    price_range: f.price_range !== undefined ? f.price_range : f.priceRange,
    nutritional_value:
      f.nutritional_value !== undefined
        ? f.nutritional_value
        : f.nutritionalValue,
    festivals_served:
      f.festivals_served !== undefined ? f.festivals_served : f.festivalsServed,
    best_restaurants:
      f.best_restaurants !== undefined ? f.best_restaurants : f.bestRestaurants,
    image_url: f.image_url !== undefined ? f.image_url : f.imageUrl,
  };
};

const mapFestival = (f) => {
  if (!f) return null;
  return {
    ...f,
    // CamelCase fields
    dressCode: f.dress_code !== undefined ? f.dress_code : f.dressCode,
    specialFoods:
      f.special_foods !== undefined ? f.special_foods : f.specialFoods,
    travelTips: f.travel_tips !== undefined ? f.travel_tips : f.travelTips,
    imageUrls: f.image_urls !== undefined ? f.image_urls : f.imageUrls,
    // Snake_case fields
    dress_code: f.dress_code !== undefined ? f.dress_code : f.dressCode,
    special_foods:
      f.special_foods !== undefined ? f.special_foods : f.specialFoods,
    travel_tips: f.travel_tips !== undefined ? f.travel_tips : f.travelTips,
    image_urls: f.image_urls !== undefined ? f.image_urls : f.imageUrls,
  };
};

const mapCulture = (c) => {
  if (!c) return null;
  return {
    ...c,
    // CamelCase fields
    imageUrl: c.image_url !== undefined ? c.image_url : c.imageUrl,
    // Snake_case fields
    image_url: c.image_url !== undefined ? c.image_url : c.imageUrl,
  };
};

const mapRuler = (r) => {
  if (!r) return null;
  return {
    ...r,
    // CamelCase fields
    reignPeriod: r.reign_period !== undefined ? r.reign_period : r.reignPeriod,
    imageUrl: r.image_url !== undefined ? r.image_url : r.imageUrl,
    // Snake_case fields
    reign_period: r.reign_period !== undefined ? r.reign_period : r.reignPeriod,
    image_url: r.image_url !== undefined ? r.image_url : r.imageUrl,
  };
};

const mapListing = (l) => {
  if (!l) return null;
  return {
    ...l,
    // CamelCase fields
    cityId: l.city_id !== undefined ? l.city_id : l.cityId,
    locationAddress:
      l.location_address !== undefined ? l.location_address : l.locationAddress,
    contactPhone:
      l.contact_phone !== undefined ? l.contact_phone : l.contactPhone,
    imageUrl: l.image_url !== undefined ? l.image_url : l.imageUrl,
    isVerified: l.is_verified !== undefined ? l.is_verified : l.isVerified,
    // Snake_case fields
    city_id: l.city_id !== undefined ? l.city_id : l.cityId,
    location_address:
      l.location_address !== undefined ? l.location_address : l.locationAddress,
    contact_phone:
      l.contact_phone !== undefined ? l.contact_phone : l.contactPhone,
    image_url: l.image_url !== undefined ? l.image_url : l.imageUrl,
    is_verified: l.is_verified !== undefined ? l.is_verified : l.isVerified,
  };
};

const mapReview = (r) => {
  if (!r) return null;
  return {
    ...r,
    // CamelCase fields
    itemId: r.item_id !== undefined ? r.item_id : r.itemId,
    itemType: r.item_type !== undefined ? r.item_type : r.itemType,
    createdAt: r.created_at !== undefined ? r.created_at : r.createdAt,
    // Snake_case fields
    item_id: r.item_id !== undefined ? r.item_id : r.itemId,
    item_type: r.item_type !== undefined ? r.item_type : r.itemType,
    created_at: r.created_at !== undefined ? r.created_at : r.createdAt,
  };
};

export const db = {
  async getCities() {
    let result;
    if (supabase) {
      const { data, error } = await supabase.from("cities").select("*");
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = CITIES;
    return result.map(mapCity);
  },

  async getCity(id) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("cities")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = CITIES.find((c) => c.id === id) || null;
    return mapCity(result);
  },

  async getPlaces(cityId = null) {
    let result;
    if (supabase) {
      let query = supabase.from("places").select("*");
      if (cityId) query = query.eq("city_id", cityId);
      const { data, error } = await query;
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) {
      result = cityId ? PLACES.filter((p) => p.cityId === cityId) : PLACES;
    }
    return result.map(mapPlace);
  },

  async getPlace(id) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = PLACES.find((p) => p.id === id) || null;
    return mapPlace(result);
  },

  async getFoods() {
    let result;
    if (supabase) {
      const { data, error } = await supabase.from("foods").select("*");
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = FOODS;
    return result.map(mapFood);
  },

  async getFood(id) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = FOODS.find((f) => f.id === id) || null;
    return mapFood(result);
  },

  async getFestivals() {
    let result;
    if (supabase) {
      const { data, error } = await supabase.from("festivals").select("*");
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = FESTIVALS;
    return result.map(mapFestival);
  },

  async getFestival(id) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("festivals")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = FESTIVALS.find((f) => f.id === id) || null;
    return mapFestival(result);
  },

  async getCultureTopics() {
    let result;
    if (supabase) {
      const { data, error } = await supabase.from("culture_topics").select("*");
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = CULTURE_TOPICS;
    return result.map(mapCulture);
  },

  async getCultureTopic(id) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("culture_topics")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = CULTURE_TOPICS.find((c) => c.id === id) || null;
    return mapCulture(result);
  },

  async getHistoryRulers() {
    let result;
    if (supabase) {
      const { data, error } = await supabase.from("history_rulers").select("*");
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = HISTORY_RULERS;
    return result.map(mapRuler);
  },

  async getHistoryRuler(id) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("history_rulers")
        .select("*")
        .eq("id", id)
        .single();
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }
    if (!result) result = HISTORY_RULERS.find((r) => r.id === id) || null;
    return mapRuler(result);
  },

  async getDirectoryListings(cityId = null, category = null) {
    let result;
    if (supabase) {
      let query = supabase.from("directory_listings").select("*");
      if (cityId) query = query.eq("city_id", cityId);
      if (category && category !== "All")
        query = query.eq("category", category);
      const { data, error } = await query;
      if (!error) result = data;
      else console.error("Supabase query error, falling back:", error);
    }

    if (!result) {
      let listings = DIRECTORY_LISTINGS;
      if (cityId) {
        listings = listings.filter(
          (l) => l.cityId.toLowerCase() === cityId.toLowerCase(),
        );
      }
      if (category && category !== "All") {
        listings = listings.filter(
          (l) => l.category.toLowerCase() === category.toLowerCase(),
        );
      }
      result = listings;
    }
    return result.map(mapListing);
  },

  async addDirectoryListing(listingData) {
    const newListing = {
      id: `listing-${Date.now()}`,
      cityId: listingData.city.toLowerCase(),
      title: listingData.businessName,
      category: listingData.category,
      subcategory:
        listingData.category === "Guides" ? "Tour Guide" : "Services",
      rating: 5.0,
      locationAddress: `${listingData.city}, Rajasthan`,
      contactPhone: listingData.phone,
      whatsapp: listingData.phone,
      description: listingData.description,
      pricing: "Contact for pricing",
      imageUrl:
        "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
      isVerified: false,
      ...listingData,
    };

    if (supabase) {
      const dbInsert = {
        city_id: listingData.city.toLowerCase(),
        title: listingData.businessName,
        category: listingData.category,
        subcategory:
          listingData.category === "Guides" ? "Tour Guide" : "Services",
        rating: 5.0,
        location_address: `${listingData.city}, Rajasthan`,
        contact_phone: listingData.phone,
        whatsapp: listingData.phone,
        description: listingData.description,
        pricing: "Contact for pricing",
        image_url:
          "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80",
        is_verified: false,
      };
      const { data, error } = await supabase
        .from("directory_listings")
        .insert([dbInsert])
        .select();
      if (!error) return mapListing(data[0]);
      console.error(
        "Supabase insert error, falling back to local save:",
        error,
      );
    }

    DIRECTORY_LISTINGS.push(newListing);
    return mapListing(newListing);
  },

  async getReviews(itemId, itemType) {
    let result;
    if (supabase) {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("item_id", itemId)
        .eq("item_type", itemType)
        .order("created_at", { ascending: false });
      if (!error) {
        result = data;
      } else {
        console.error("Supabase query error, falling back:", error);
      }
    }
    if (!result) {
      result = localReviews.filter(
        (r) => r.itemId === itemId && r.itemType === itemType,
      );
    }
    return result.map(mapReview);
  },

  async addReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      itemId: reviewData.itemId,
      itemType: reviewData.itemType,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      author: reviewData.author || "Anonymous Traveler",
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      const dbInsert = {
        item_id: reviewData.itemId,
        item_type: reviewData.itemType,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        author: reviewData.author || "Anonymous Traveler",
      };
      const { data, error } = await supabase
        .from("reviews")
        .insert([dbInsert])
        .select();
      if (!error) {
        return mapReview(data[0]);
      }
      console.error(
        "Supabase insert error, falling back to local save:",
        error,
      );
    }

    localReviews.unshift(newReview);
    return mapReview(newReview);
  },

};
