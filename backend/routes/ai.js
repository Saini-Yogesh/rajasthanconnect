import express from "express";
import { gemini } from "../services/gemini.js";
import { db } from "../db/db.js";

const router = express.Router();

router.post("/plan-trip", async (req, res) => {
  try {
    const { days, budget, startingCity, interests } = req.body;
    if (!days || !startingCity) {
      return res
        .status(400)
        .json({ error: "Missing days or startingCity parameters" });
    }

    console.log(
      `Generating itinerary: ${days} days, budget ${budget} INR, starting in ${startingCity}...`,
    );
    const itinerary = await gemini.generateItinerary({
      days,
      budget,
      startingCity,
      interests,
    });
    res.json(itinerary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/chat", async (req, res) => {
  try {
    const { messageHistory } = req.body;
    if (
      !messageHistory ||
      !Array.isArray(messageHistory) ||
      messageHistory.length === 0
    ) {
      return res.status(400).json({ error: "Missing messageHistory array" });
    }

    console.log(
      `Querying AI Chatbot: "${messageHistory[messageHistory.length - 1].content}"`,
    );
    const reply = await gemini.getChatResponse(messageHistory);
    res.json({ reply });
  } catch (err) {
    // Gemini quota exhausted — return a graceful fallback message to the user
    if (
      err.status === 429 ||
      (err.message && err.message.includes("RESOURCE_EXHAUSTED"))
    ) {
      return res.json({
        reply: `⏳ **The AI guide is currently resting** (free API quota reached for today).\n\nThe assistant will be fully available again tomorrow. In the meantime, you can:\n* Browse our **[Cities Portal](/cities)** for destination guides\n* Read **[History & Culture](/history-culture)** for dynasty chronicles\n* Use the **[Trip Planner](/planner)** which also works with this AI\n\nKhamma Ghani! 🙏`,
      });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
