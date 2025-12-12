
import mongoose from "mongoose";

const OrganizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  department: String,
  discord: String,
  experience: String,
  motivation: String,
  availability: String
});

export default mongoose.model("Organizer", OrganizerSchema);
