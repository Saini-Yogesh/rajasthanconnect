import { createClient } from '@supabase/supabase-js';
import { CITIES, PLACES, FOODS, FESTIVALS, CULTURE_TOPICS, HISTORY_RULERS, DIRECTORY_LISTINGS, REVIEWS } from './seedData.js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl.trim() !== '' && supabaseKey.trim() !== '';

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : null;

if (isSupabaseConfigured) {
  console.log('🔌 Connected to Supabase DB: ' + supabaseUrl);
} else {
  console.log('⚠️ Supabase credentials not found. Running in Local Fallback Mode with built-in seed dataset.');
}

let localReviews = [...REVIEWS];
let localSavedItineraries = [];

export const db = {
  async getCities() {
    if (supabase) {
      const { data, error } = await supabase.from('cities').select('*');
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return CITIES;
  },

  async getCity(id) {
    if (supabase) {
      const { data, error } = await supabase.from('cities').select('*').eq('id', id).single();
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return CITIES.find(c => c.id === id) || null;
  },

  async getPlaces(cityId = null) {
    if (supabase) {
      let query = supabase.from('places').select('*');
      if (cityId) query = query.eq('city_id', cityId);
      const { data, error } = await query;
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return cityId ? PLACES.filter(p => p.cityId === cityId) : PLACES;
  },

  async getPlace(id) {
    if (supabase) {
      const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return PLACES.find(p => p.id === id) || null;
  },

  async getFoods() {
    if (supabase) {
      const { data, error } = await supabase.from('foods').select('*');
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return FOODS;
  },

  async getFood(id) {
    if (supabase) {
      const { data, error } = await supabase.from('foods').select('*').eq('id', id).single();
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return FOODS.find(f => f.id === id) || null;
  },

  async getFestivals() {
    if (supabase) {
      const { data, error } = await supabase.from('festivals').select('*');
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return FESTIVALS;
  },

  async getFestival(id) {
    if (supabase) {
      const { data, error } = await supabase.from('festivals').select('*').eq('id', id).single();
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return FESTIVALS.find(f => f.id === id) || null;
  },

  async getCultureTopics() {
    if (supabase) {
      const { data, error } = await supabase.from('culture_topics').select('*');
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return CULTURE_TOPICS;
  },

  async getHistoryRulers() {
    if (supabase) {
      const { data, error } = await supabase.from('history_rulers').select('*');
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return HISTORY_RULERS;
  },

  async getHistoryRuler(id) {
    if (supabase) {
      const { data, error } = await supabase.from('history_rulers').select('*').eq('id', id).single();
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    return HISTORY_RULERS.find(r => r.id === id) || null;
  },

  async getDirectoryListings(cityId = null, category = null) {
    if (supabase) {
      let query = supabase.from('directory_listings').select('*');
      if (cityId) query = query.eq('city_id', cityId);
      if (category && category !== 'All') query = query.eq('category', category);
      const { data, error } = await query;
      if (!error) return data;
      console.error('Supabase query error, falling back:', error);
    }
    
    let listings = DIRECTORY_LISTINGS;
    if (cityId) {
      listings = listings.filter(l => l.cityId.toLowerCase() === cityId.toLowerCase());
    }
    if (category && category !== 'All') {
      listings = listings.filter(l => l.category.toLowerCase() === category.toLowerCase());
    }
    return listings;
  },

  async addDirectoryListing(listingData) {
    const newListing = {
      id: `listing-${Date.now()}`,
      cityId: listingData.city.toLowerCase(),
      title: listingData.businessName,
      category: listingData.category,
      subcategory: listingData.category === 'Guides' ? 'Tour Guide' : 'Services',
      rating: 5.0,
      locationAddress: `${listingData.city}, Rajasthan`,
      contactPhone: listingData.phone,
      whatsapp: listingData.phone,
      description: listingData.description,
      pricing: 'Contact for pricing',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
      isVerified: false,
      ...listingData
    };

    if (supabase) {
      const dbInsert = {
        city_id: listingData.city.toLowerCase(),
        title: listingData.businessName,
        category: listingData.category,
        subcategory: listingData.category === 'Guides' ? 'Tour Guide' : 'Services',
        rating: 5.0,
        location_address: `${listingData.city}, Rajasthan`,
        contact_phone: listingData.phone,
        whatsapp: listingData.phone,
        description: listingData.description,
        pricing: 'Contact for pricing',
        image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
        is_verified: false
      };
      const { data, error } = await supabase.from('directory_listings').insert([dbInsert]).select();
      if (!error) return data[0];
      console.error('Supabase insert error, falling back to local save:', error);
    }

    DIRECTORY_LISTINGS.push(newListing);
    return newListing;
  },

  async getReviews(itemId, itemType) {
    if (supabase) {
      const { data, error } = await supabase.from('reviews')
        .select('*')
        .eq('item_id', itemId)
        .eq('item_type', itemType)
        .order('created_at', { ascending: false });
      if (!error) {
        return data.map(r => ({
          id: r.id,
          itemId: r.item_id,
          itemType: r.item_type,
          rating: r.rating,
          comment: r.comment,
          author: r.author,
          createdAt: r.created_at
        }));
      }
      console.error('Supabase query error, falling back:', error);
    }
    return localReviews.filter(r => r.itemId === itemId && r.itemType === itemType);
  },

  async addReview(reviewData) {
    const newReview = {
      id: `rev-${Date.now()}`,
      itemId: reviewData.itemId,
      itemType: reviewData.itemType,
      rating: Number(reviewData.rating),
      comment: reviewData.comment,
      author: reviewData.author || 'Anonymous Traveler',
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      const dbInsert = {
        item_id: reviewData.itemId,
        item_type: reviewData.itemType,
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        author: reviewData.author || 'Anonymous Traveler'
      };
      const { data, error } = await supabase.from('reviews').insert([dbInsert]).select();
      if (!error) {
        const r = data[0];
        return {
          id: r.id,
          itemId: r.item_id,
          itemType: r.item_type,
          rating: r.rating,
          comment: r.comment,
          author: r.author,
          createdAt: r.created_at
        };
      }
      console.error('Supabase insert error, falling back to local save:', error);
    }

    localReviews.unshift(newReview);
    return newReview;
  },

  async getSavedItineraries() {
    if (supabase) {
      const { data, error } = await supabase.from('saved_itineraries').select('*').order('created_at', { ascending: false });
      if (!error) {
        return data.map(i => ({
          id: i.id,
          title: i.title,
          days: i.days,
          budget: i.budget,
          startingCity: i.starting_city,
          interests: i.interests,
          itineraryData: i.itinerary_data,
          createdAt: i.created_at
        }));
      }
      console.error('Supabase query error, falling back:', error);
    }
    return localSavedItineraries;
  },

  async saveItinerary(itineraryData) {
    const newItinerary = {
      id: `itinerary-${Date.now()}`,
      title: itineraryData.title || `${itineraryData.days} Days from ${itineraryData.startingCity}`,
      days: Number(itineraryData.days),
      budget: Number(itineraryData.budget),
      startingCity: itineraryData.startingCity,
      interests: itineraryData.interests || [],
      itineraryData: itineraryData.itineraryData,
      createdAt: new Date().toISOString()
    };

    if (supabase) {
      const dbInsert = {
        title: newItinerary.title,
        days: newItinerary.days,
        budget: newItinerary.budget,
        starting_city: newItinerary.startingCity,
        interests: newItinerary.interests,
        itinerary_data: newItinerary.itineraryData
      };
      const { data, error } = await supabase.from('saved_itineraries').insert([dbInsert]).select();
      if (!error) {
        const i = data[0];
        return {
          id: i.id,
          title: i.title,
          days: i.days,
          budget: i.budget,
          startingCity: i.starting_city,
          interests: i.interests,
          itineraryData: i.itinerary_data,
          createdAt: i.created_at
        };
      }
      console.error('Supabase insert error, falling back to local save:', error);
    }

    localSavedItineraries.unshift(newItinerary);
    return newItinerary;
  }
};
