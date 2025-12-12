import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: String,
  description: String,
  number_organizers: Number,
  number_participants: Number,
  date_debut: String,
  date_end: String,

  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

  announcementDate: String,   // YYYY-MM-DD
  announcementTime: String,   // HH:mm
  discordMessage: String      // what to post
});

export default mongoose.model("Event", eventSchema);
