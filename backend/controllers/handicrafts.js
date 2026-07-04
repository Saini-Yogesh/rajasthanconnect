import { supabase } from "../config/db.js";

/**
 * Get all handicrafts (supports optional filter by origin_city_id)
 */
export const getHandicrafts = async (req, res) => {
  try {
    let query = supabase.from("handicrafts").select("*").order("name", { ascending: true });

    if (req.query.origin_city_id) {
      query = query.eq("origin_city_id", req.query.origin_city_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific handicraft by slug/ID
 */
export const getHandicraftById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("handicrafts")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Handicraft not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
