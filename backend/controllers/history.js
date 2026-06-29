import { db } from "../db/db.js";

export const getHistory = async (req, res) => {
  try {
    const data = await db.getHistoryRulers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRulerById = async (req, res) => {
  try {
    const data = await db.getHistoryRuler(req.params.id);
    if (!data)
      return res.status(404).json({ error: "Ruler biography not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
