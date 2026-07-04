import { supabase } from "../config/db.js";

/**
 * Get all historical events (supports optional category and location filters)
 */
export const getHistoricalEvents = async (req, res) => {
  try {
    let query = supabase.from("historical_events").select("*").order("title", { ascending: true });

    if (req.query.category) {
      query = query.eq("category", req.query.category);
    }
    if (req.query.location_place_id) {
      query = query.eq("location_place_id", req.query.location_place_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific historical event by slug/ID
 */
export const getHistoricalEventById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("historical_events")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Historical event not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
