import express from "express";
import { generateItinerary } from "../services/groq/planner.js";
import { getChatResponse } from "../services/groq/chat.js";

const router = express.Router();

const RATE_LIMIT_REPLY = `⏳ **The AI guide is briefly resting** (API rate limit reached).\n\nPlease try again in a moment, or browse our **[Cities](/cities)** and **[History & Culture](/history-culture)** guides.\n\nKhamma Ghani! 🙏`;

router.post("/plan-trip", async (req, res) => {
  try {
    const { days, budget, startingCity, interests } = req.body;
    if (!days || !startingCity) {
      return res.status(400).json({ error: "Missing days or startingCity parameters" });
    }

    const itinerary = await generateItinerary({
      days,
      budget,
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
