// routes/motivationRoute.js
import express from "express";
import Organizer from "../models/organizer.js";
import {deepseek} from "../config/deepSeek.js";

const router = express.Router();

/**
 * GET /organizers/motivation/rank
 * Batch-scores all organizers in ONE Gemini call
 */
router.get("/rank", async (req, res) => {
  try {
    const organizers = await Organizer.find();

    // Filter organizers that need scoring
    const toScore = organizers.filter(
      (o) => !o.motivationScore || o.motivationScore === 0
    );

    if (toScore.length > 0) {
      // Build batch prompt
      const promptLines = toScore.map(
        (o, i) => `${i + 1}. "${o.motivation}"`
      );

      const prompt = `Rate the motivation level of the following texts from 1 to 10. Return ONLY numbers, in the same order:\n\n${promptLines.join(
        "\n"
      )}`;

      const response = await deepseek.chat.completions.create({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: "Return ONLY numbers from 1 to 10." },
          { role: "user", content: prompt },
        ],
        temperature: 0,
        max_tokens: 50,
      });

      const raw = response.choices[0].message.content.trim();
      console.log("Batch scoring response:", raw);
      // Extract all numbers in order
      const scores = raw.match(/\d+/g)?.map((s) => Math.min(Math.max(parseInt(s, 10), 1), 10)) || [];

      // Assign scores to organizers
      for (let i = 0; i < toScore.length; i++) {
        toScore[i].motivationScore = scores[i] ?? 5; // fallback 5
        await toScore[i].save();
      }
    }

    // Return all organizers sorted by motivationScore descending
    const ranked = await Organizer.find().sort({ motivationScore: -1 });

    res.json(ranked);
  } catch (err) {
    console.error("Batch motivation scoring error:", err.message);
    res.status(500).json({ error: "Failed to score motivation" });
  }
});

export default router;
