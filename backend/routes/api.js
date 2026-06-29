import express from "express";
import { db } from "../db/db.js";

const router = express.Router();

// Input Validation Helper for Business Listings
const validateListingData = (data) => {
  const errors = [];
  const { businessName, category, city, phone, description } = data;

  // Validate Business Name
  if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 3 || businessName.trim().length > 100) {
    errors.push('Business Name must be between 3 and 100 characters.');
  }

  // Validate Category
  const allowedCategories = ['Guides', 'Hotels', 'Restaurants', 'Shops', 'Transport'];
  if (!category || !allowedCategories.includes(category)) {
    errors.push(`Category must be one of: ${allowedCategories.join(', ')}.`);
  }

  // Validate City
  const allowedCities = ['Jaipur', 'Jodhpur', 'Udaipur', 'Jaisalmer'];
  if (!city || !allowedCities.includes(city)) {
    errors.push(`City must be one of: ${allowedCities.join(', ')}.`);
  }

  // Validate Phone number (standard local/intl formats with digits, space, -, (, ))
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  if (!phone || typeof phone !== 'string' || !phoneRegex.test(phone.trim())) {
    errors.push('Phone number is invalid. Please use a valid format (e.g. +91 98765 43210).');
  }

  // Validate Description
  if (!description || typeof description !== 'string' || description.trim().length < 20 || description.trim().length > 1000) {
    errors.push('Description must be between 20 and 1000 characters to verify services.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

router.get("/cities", async (req, res) => {
  try {
    const data = await db.getCities();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/cities/:id", async (req, res) => {
  try {
    const data = await db.getCity(req.params.id);
    if (!data) return res.status(404).json({ error: "City not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/places", async (req, res) => {
  try {
    const { cityId } = req.query;
    const data = await db.getPlaces(cityId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/places/:id", async (req, res) => {
  try {
    const data = await db.getPlace(req.params.id);
    if (!data) return res.status(404).json({ error: "Place not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/foods", async (req, res) => {
  try {
    const data = await db.getFoods();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/foods/:id", async (req, res) => {
  try {
    const data = await db.getFood(req.params.id);
    if (!data) return res.status(404).json({ error: "Food not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/festivals", async (req, res) => {
  try {
    const data = await db.getFestivals();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/festivals/:id", async (req, res) => {
  try {
    const data = await db.getFestival(req.params.id);
    if (!data) return res.status(404).json({ error: "Festival not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/culture", async (req, res) => {
  try {
    const data = await db.getCultureTopics();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history", async (req, res) => {
  try {
    const data = await db.getHistoryRulers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/history/:id", async (req, res) => {
  try {
    const data = await db.getHistoryRuler(req.params.id);
    if (!data)
      return res.status(404).json({ error: "Ruler biography not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/listings", async (req, res) => {
  try {
    const { cityId, category } = req.query;
    const data = await db.getDirectoryListings(cityId, category);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/listings", async (req, res) => {
  try {
    const { businessName, category, city, phone, description } = req.body;

    // Run input validation schema checks
    const validation = validateListingData(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: "Validation failed",
        details: validation.errors
      });
    }

    // Retrieve EmailJS credentials from environment variables
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;

    console.log("EmailJS configuration load status:", {
      serviceId: serviceId ? "LOADED" : "NOT_FOUND",
      templateId: templateId ? "LOADED" : "NOT_FOUND",
      publicKey: publicKey ? "LOADED" : "NOT_FOUND",
    });

    // Send the data via EmailJS REST API
    const requestBody = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        businessName,
        category,
        city,
        phone,
        description,
      },
    };

    // If private key (Access Token) is configured, pass it to authenticate the server-side request
    if (process.env.EMAILJS_PRIVATE_KEY) {
      requestBody.accessToken = process.env.EMAILJS_PRIVATE_KEY;
    }

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`EmailJS API responded with error: ${errorText}`);
    }

    // Return a success confirmation object
    res.status(201).json({
      success: true,
      message: "Listing registered successfully via EmailJS",
    });
  } catch (err) {
    console.error("Error sending registration email via EmailJS:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/reviews/:itemId/:itemType", async (req, res) => {
  try {
    const { itemId, itemType } = req.params;
    const reviews = await db.getReviews(itemId, itemType);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/reviews", async (req, res) => {
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
});

export default router;
