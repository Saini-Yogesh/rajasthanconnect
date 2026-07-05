import express from "express";
import { generateItinerary } from "../services/groq/planner.js";
import { getChatResponse } from "../services/groq/chat.js";

const router = express.Router();

const RATE_LIMIT_REPLY = `⏳ **The AI guide is briefly resting** (API rate limit reached).\n\nPlease try again in a moment, or browse our **[Cities](/cities)** and **[History & Culture](/history-culture)** guides.\n\nKhamma Ghani! 🙏`;

router.post("/plan-trip", async (req, res) => {
  try {
    const { days, budget, startingCity, interests } = req.body;

    // Validate days
    if (days === undefined || days === null || days === "") {
      return res.status(400).json({ error: "Missing duration (days) parameter." });
    }
    const daysNum = Number(days);
    if (!Number.isInteger(daysNum) || daysNum < 1 || daysNum > 7) {
      return res.status(400).json({ error: "Trip duration must be a whole number between 1 and 7 days." });
    }

    // Validate budget
    if (budget === undefined || budget === null || budget === "") {
      return res.status(400).json({ error: "Missing budget parameter." });
    }
    const budgetNum = Number(budget);
    if (!Number.isInteger(budgetNum) || budgetNum < 1000) {
      return res.status(400).json({ error: "Budget must be a whole number of at least 1,000 INR." });
    }

    // Validate startingCity
    if (!startingCity || typeof startingCity !== "string" || startingCity.trim() === "") {
      return res.status(400).json({ error: "Missing or invalid startingCity parameter." });
    }

    const itinerary = await generateItinerary({
      days: daysNum,
      budget: budgetNum,
      startingCity,
      interests,
    });
    res.json(itinerary);
  } catch (err) {
    console.error("plan-trip error:", err.message);
    try {
      const fallback = await generateItinerary({
        days: req.body?.days || 3,
        budget: req.body?.budget || 15000,
        startingCity: req.body?.startingCity || "Jaipur",
        interests: req.body?.interests,
      });
      res.json(fallback);
    } catch {
      res.json({
        title: "Rajasthan Heritage Journey",
        days: [],
        totalEstimatedCost: 0,
        travelTips: ["Please try generating your itinerary again in a moment."],
      });
    }
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { messageHistory } = req.body;
    if (!messageHistory || !Array.isArray(messageHistory) || messageHistory.length === 0) {
      return res.status(400).json({ error: "Missing messageHistory array" });
    }

    const reply = await getChatResponse(messageHistory);
    res.json({ reply: reply || RATE_LIMIT_REPLY });
  } catch (err) {
    console.error("chat error:", err.message);
    try {
      const reply = await getChatResponse(req.body?.messageHistory || []);
      res.json({ reply: reply || RATE_LIMIT_REPLY });
    } catch {
      res.json({
        reply: "**Khamma Ghani! 🙏** I'm having a brief connection issue. Please try again in a moment.",
      });
    }
  }
});

export default router;
