import { supabase } from "../config/db.js";

/**
 * Get all languages
 */
export const getLanguages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific language by slug/ID
 */
export const getLanguageById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("languages")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Language not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
