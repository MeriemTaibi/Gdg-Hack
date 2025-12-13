import express from "express";
import { getOrganizers, getOrganizerById, createOrganizer } from "../controllers/organizersController.js";
//import { getSortedOrganizers } from "../controllers/scoringController.js";
import motivationRouter from "./motivationRoute.js";
const router = express.Router();

// GET all organizers
//router.get("/sorted", getSortedOrganizers);
router.get("/", getOrganizers);

// GET single organizer by ID
router.get("/:id", getOrganizerById);

// POST new organizer
router.post("/", createOrganizer);
router.use("/motivation", motivationRouter);

export default router;
