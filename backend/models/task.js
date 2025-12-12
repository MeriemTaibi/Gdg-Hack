// src/models/Task.js
import mongoose from "mongoose";
import Organizer from "./organizer.js";

const TaskSchema = new mongoose.Schema({
  description: { type: String, required: true },
  numb_org: Number,
  date: String,
  time: String,
  valid: { type: Boolean, default: false },
  organizers: [Organizer.schema] 
});

export default mongoose.model("Task", TaskSchema);
