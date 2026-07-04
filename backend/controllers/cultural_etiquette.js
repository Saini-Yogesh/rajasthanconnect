import { supabase } from "../config/db.js";

/**
 * Get all cultural etiquette topics (supports optional category filter)
 */
export const getCulturalEtiquette = async (req, res) => {
  try {
    let query = supabase.from("cultural_etiquette").select("*").order("title", { ascending: true });

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
 * Get a specific etiquette topic by slug/ID
 */
export const getCulturalEtiquetteById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cultural_etiquette")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Etiquette topic not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
