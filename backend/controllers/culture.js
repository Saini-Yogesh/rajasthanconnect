import { db } from "../db/db.js";

export const getCulture = async (req, res) => {
  try {
    const data = await db.getCultureTopics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCultureById = async (req, res) => {
  try {
    const data = await db.getCultureTopic(req.params.id);
    if (!data) return res.status(404).json({ error: "Culture topic not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
