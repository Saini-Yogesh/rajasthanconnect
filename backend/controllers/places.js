import { supabase } from "../config/db.js";

/**
 * Get all places (supports optional filters for city_id, district_id, and category)
 */
export const getPlaces = async (req, res) => {
  try {
    let query = supabase
      .from("places")
      .select("*")
      .order("priority", { ascending: false })
      .order("title", { ascending: true });

    if (req.query.city_id) {
      query = query.eq("city_id", req.query.city_id);
    }
    if (req.query.district_id) {
      query = query.eq("district_id", req.query.district_id);
    }
    if (req.query.category) {
      query = query.eq("category", req.query.category);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific place by slug/ID
 */
export const getPlaceById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Place not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
