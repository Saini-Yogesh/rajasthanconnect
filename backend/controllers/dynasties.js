import { supabase } from "../config/db.js";

/**
 * Get all dynasties
 */
export const getDynasties = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("dynasties")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific dynasty by slug/ID
 */
export const getDynastyById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("dynasties")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Dynasty not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
