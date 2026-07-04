import { supabase } from "../config/db.js";

/**
 * Get all unique experiences (supports optional city_id filter)
 */
export const getUniqueExperiences = async (req, res) => {
  try {
    let query = supabase.from("unique_experiences").select("*").order("title", { ascending: true });

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
 * Get a specific unique experience by slug/ID
 */
export const getUniqueExperienceById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("unique_experiences")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Experience not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
