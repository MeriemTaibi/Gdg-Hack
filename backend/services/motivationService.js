// services/motivationService.js
import{deepseek} from "../config/deepSeek.js";

export const getMotivationScore = async (motivationText) => {
  console.log("🔥 getMotivationScore EXECUTING");

  if (!motivationText) return 1;

  try {
    const response = await deepseek.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: [
        { role: "system", content: "Return ONLY a number from 1 to 10." },
        {
          role: "user",
          content: `Rate this motivation from 1 to 10:\n"${motivationText}"`
        }
      ],
      temperature: 0,
      max_tokens: 5
    });

    const raw = response.choices[0].message.content.trim();
    const score = parseInt(raw.match(/\d+/)?.[0] ?? "1", 10);

    return Math.max(1, Math.min(score, 10));
  } catch (err) {
    console.error("❌ Motivation scoring error:", err.message);
    return 5; // safe fallback
  }
};
