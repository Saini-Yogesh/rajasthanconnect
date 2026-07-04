import { supabase } from "../config/db.js";

/**
 * Get all communities & tribes
 */
export const getCommunitiesTribes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("communities_tribes")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific community/tribe by slug/ID
 */
export const getCommunityTribeById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("communities_tribes")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Community or tribe not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
