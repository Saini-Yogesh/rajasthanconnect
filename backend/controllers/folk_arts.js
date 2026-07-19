import { supabase } from "../config/db.js";

/**
 * Get all folk arts (supports optional category and related city filters)
 */
export const getFolkArts = async (req, res) => {
  try {
    let query = supabase
      .from("folk_arts")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

    if (req.query.category) {
      query = query.eq("category", req.query.category);
    }
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
 * Get a specific folk art by slug/ID
 */
export const getFolkArtById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("folk_arts")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Folk art not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
