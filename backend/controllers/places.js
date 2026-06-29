import { db } from "../db/db.js";

export const getPlaces = async (req, res) => {
  try {
    const { cityId } = req.query;
    const data = await db.getPlaces(cityId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const data = await db.getPlace(req.params.id);
    if (!data) return res.status(404).json({ error: "Place not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
