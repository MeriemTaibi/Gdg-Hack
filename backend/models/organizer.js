// models/organizer.js
import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  discord: { type: String },
  motivation: { type: String },
  availability: { type: Number }, // 1,2,3
  experience: { type: String }, // low, middle, high
  motivationScore: { type: Number, default: 0 }, // cached score
});

const Organizer = mongoose.model("Organizer", organizerSchema);

export default Organizer;
