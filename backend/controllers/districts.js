import { supabase } from "../config/db.js";

/**
 * Get all districts
 */
export const getDistricts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("districts")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific district by slug/ID
 */
export const getDistrictById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("districts")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "District not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
