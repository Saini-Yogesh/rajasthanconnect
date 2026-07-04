import { supabase } from "../config/db.js";

/**
 * Get all reviews for a specific item
 */
export const getReviews = async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Create a new user review
 */
export const createReview = async (req, res) => {
  try {
    const { itemId, itemType, rating, comment, author } = req.body;
    if (!itemId || !itemType || !rating || !comment) {
      return res.status(400).json({ error: "Missing required review parameters" });
    }

    const ratingVal = Number(rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert([{
        item_id: itemId,
        item_type: itemType,
        rating: ratingVal,
        comment,
        author: author || "Anonymous Traveler"
      }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
