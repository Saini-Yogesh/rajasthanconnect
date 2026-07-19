import { supabase } from "../config/db.js";

/**
 * Get all folk music styles and instruments (supports optional category filter)
 */
export const getFolkMusicInstruments = async (req, res) => {
  try {
    let query = supabase
      .from("folk_music_instruments")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

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
 * Get a specific folk music item by slug/ID
 */
export const getFolkMusicInstrumentById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("folk_music_instruments")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Folk music item not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
