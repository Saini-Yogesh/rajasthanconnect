import { db } from "../db/db.js";

export const getCities = async (req, res) => {
  try {
    const data = await db.getCities();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCityById = async (req, res) => {
  try {
    const data = await db.getCity(req.params.id);
    if (!data) return res.status(404).json({ error: "City not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
