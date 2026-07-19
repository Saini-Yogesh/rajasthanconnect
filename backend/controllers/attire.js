import { supabase } from "../config/db.js";

/**
 * Get all traditional attire (supports optional worn_by filter)
 */
export const getAttire = async (req, res) => {
  try {
    let query = supabase
      .from("attire")
      .select("*")
      .order("priority", { ascending: false })
      .order("name", { ascending: true });

    if (req.query.worn_by) {
      query = query.eq("worn_by", req.query.worn_by);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific attire item by slug/ID
 */
export const getAttireById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("attire")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Attire item not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
