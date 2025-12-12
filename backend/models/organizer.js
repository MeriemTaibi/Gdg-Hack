
import mongoose from "mongoose";

const OrganizerSchema = new mongoose.Schema({
  name: { type: String, required: false},
  email: { type: String, required: false },
  department: String,
  discord: String,
  experience: String,
  motivation: String,
  availability: String
});

export default mongoose.model("Organizer", OrganizerSchema);
