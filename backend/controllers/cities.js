import { supabase } from "../config/db.js";

/**
 * Get all cities (supports optional filter by district_id)
 */
export const getCities = async (req, res) => {
  try {
    let query = supabase
      .from("cities")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

    if (req.query.district_id) {
      query = query.eq("district_id", req.query.district_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific city by slug/ID
 */
export const getCityById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cities")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "City not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
