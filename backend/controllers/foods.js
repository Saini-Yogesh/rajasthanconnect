import { supabase } from "../config/db.js";

/**
 * Get all foods/cuisines (supports optional filtering by related city)
 */
export const getFoods = async (req, res) => {
  try {
    let query = supabase.from("foods").select("*").order("title", { ascending: true });

    if (req.query.city_id) {
      query = query.contains("related_city_ids", [req.query.city_id]);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific food/cuisine by slug/ID
 */
export const getFoodById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("foods")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Food item not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
