import express from 'express';
import { db } from '../db/db.js';

const router = express.Router();

router.get('/cities', async (req, res) => {
  try {
    const data = await db.getCities();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/cities/:id', async (req, res) => {
  try {
    const data = await db.getCity(req.params.id);
    if (!data) return res.status(404).json({ error: 'City not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/places', async (req, res) => {
  try {
    const { cityId } = req.query;
    const data = await db.getPlaces(cityId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/places/:id', async (req, res) => {
  try {
    const data = await db.getPlace(req.params.id);
    if (!data) return res.status(404).json({ error: 'Place not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/foods', async (req, res) => {
  try {
    const data = await db.getFoods();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/foods/:id', async (req, res) => {
  try {
    const data = await db.getFood(req.params.id);
    if (!data) return res.status(404).json({ error: 'Food not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/festivals', async (req, res) => {
  try {
    const data = await db.getFestivals();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/festivals/:id', async (req, res) => {
  try {
    const data = await db.getFestival(req.params.id);
    if (!data) return res.status(404).json({ error: 'Festival not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/culture', async (req, res) => {
  try {
    const data = await db.getCultureTopics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const data = await db.getHistoryRulers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/history/:id', async (req, res) => {
  try {
    const data = await db.getHistoryRuler(req.params.id);
    if (!data) return res.status(404).json({ error: 'Ruler biography not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/listings', async (req, res) => {
  try {
    const { cityId, category } = req.query;
    const data = await db.getDirectoryListings(cityId, category);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/listings', async (req, res) => {
  try {
    const { businessName, category, city, phone, description } = req.body;
    if (!businessName || !category || !city || !phone || !description) {
      return res.status(400).json({ error: 'Missing required registration parameters' });
    }
    const newListing = await db.addDirectoryListing({ businessName, category, city, phone, description });
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reviews/:itemId/:itemType', async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const reviews = await db.getReviews(itemId, itemType);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reviews', async (req, res) => {
  try {
    const { itemId, itemType, rating, comment, author } = req.body;
    if (!itemId || !itemType || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required review parameters' });
    }
    const newReview = await db.addReview({ itemId, itemType, rating, comment, author });
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
