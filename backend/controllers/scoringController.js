/*// controllers/scoringController.js
import Organizer from "../models/organizer.js";
import { computeOrganizerScore } from "../services/scoringService.js";
import { sortOrganizers } from "../services/scoringService.js";

export const getSortedOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();

    const scored = [];
    for (const org of organizers) {
      const score = await computeOrganizerScore(org);
      scored.push(score);
    }

    const sorted = sortOrganizers(scored);

    res.json(sorted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate organizer ranking" });
  }
};*/
