import { supabase } from "../config/db.js";

/**
 * Get all festivals (supports optional filter by related city)
 */
export const getFestivals = async (req, res) => {
  try {
    let query = supabase
      .from("festivals")
      .select("*")
      .order("priority", { ascending: false })
      .order("title", { ascending: true });

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
 * Get a specific festival by slug/ID
 */
export const getFestivalById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("festivals")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Festival not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
