import { supabase } from "../config/db.js";

/**
 * Get all royal wedding venues (supports optional city_id filter)
 */
export const getRoyalWeddingVenues = async (req, res) => {
  try {
    let query = supabase.from("royal_wedding_venues").select("*").order("name", { ascending: true });

    if (req.query.city_id) {
      query = query.eq("city_id", req.query.city_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific wedding venue by slug/ID
 */
export const getRoyalWeddingVenueById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("royal_wedding_venues")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Wedding venue not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
