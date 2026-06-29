import { db } from "../db/db.js";

export const getFestivals = async (req, res) => {
  try {
    const data = await db.getFestivals();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFestivalById = async (req, res) => {
  try {
    const data = await db.getFestival(req.params.id);
    if (!data) return res.status(404).json({ error: "Festival not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
