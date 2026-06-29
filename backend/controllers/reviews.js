import { db } from "../db/db.js";

export const getReviews = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const reviews = await db.getReviews(itemId, itemType);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { itemId, itemType, rating, comment, author } = req.body;
    if (!itemId || !itemType || !rating || !comment) {
      return res
        .status(400)
        .json({ error: "Missing required review parameters" });
    }
    const newReview = await db.addReview({
      itemId,
      itemType,
      rating,
      comment,
      author,
    });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
