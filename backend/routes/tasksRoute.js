import express from "express";
import { getTasks } from "../controllers/taskController.js";
const router = express.Router();

// GET all tasks
router.get("/", getTasks);

export default router;