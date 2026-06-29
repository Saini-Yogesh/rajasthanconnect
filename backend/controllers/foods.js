import { db } from "../db/db.js";

export const getFoods = async (req, res) => {
  try {
    const data = await db.getFoods();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const data = await db.getFood(req.params.id);
    if (!data) return res.status(404).json({ error: "Food not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
