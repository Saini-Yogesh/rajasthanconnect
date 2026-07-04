import { supabase } from "../config/db.js";

/**
 * Get all history rulers (supports optional filter by dynasty_id)
 */
export const getHistoryRulers = async (req, res) => {
  try {
    let query = supabase.from("history_rulers").select("*").order("name", { ascending: true });

    if (req.query.dynasty_id) {
      query = query.eq("dynasty_id", req.query.dynasty_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get a specific ruler by slug/ID
 */
export const getHistoryRulerById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("history_rulers")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Ruler not found" });
      }
      throw error;
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
