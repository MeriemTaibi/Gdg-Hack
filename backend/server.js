// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import eventRoutes from "./routes/eventsRoute.js"; // your router file
import { sendDiscordMessage } from "./discordBot/bot.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

mongoose.connect(mongoURI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err);
  process.exit(1);
});

// Routes
app.use("/events", eventRoutes); // Mount the events router

// Test route
app.get("/", (req, res) => res.send("Server is running"));
app.get("/test-discord", () => {
  sendDiscordMessage("Test message from server");
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
