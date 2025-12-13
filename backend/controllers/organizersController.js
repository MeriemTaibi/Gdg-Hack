import Organizer from "../models/organizer.js";

// GET all organizers
export const getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find();
    res.status(200).json(organizers);
  } catch (err) {
    console.error("Error fetching organizers:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET single organizer by ID
export const getOrganizerById = async (req, res) => {
  try {
    const { id } = req.params;
    const organizer = await Organizer.findById(id);
    if (!organizer) return res.status(404).json({ error: "Organizer not found" });
    res.status(200).json(organizer);
  } catch (err) {
    console.error("Error fetching organizer:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST new organizer
export const createOrganizer = async (req, res) => {
  try {
    const organizersData = Array.isArray(req.body) ? req.body : [req.body];

    const organizers = organizersData.map((o) => ({
      name: o.name,
      email: o.email,
      discord: o.discord || "",
      motivation: o.motivation || "",
      availability: o.availability || 1,
      experience: o.experience || "low",
      motivationScore: 0,
    }));

    const saved = await Organizer.insertMany(organizers);
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating organizers:", err);
    res.status(500).json({ error: "Failed to create organizers" });
  }
};
