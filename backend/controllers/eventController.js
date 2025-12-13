import Event from "../models/event.js";
import Task from "../models/task.js";
import Organizer from "../models/organizer.js";
import cron from "node-cron";
import { sendDiscordMessage } from "../discordBot/bot.js";
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: "tasks",
        populate: { path: "organizers" }
      });
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id)
      .populate({
        path: "tasks",
        populate: { path: "organizers" }
      });

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.status(200).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
export const createEvent = async (req, res) => {
  try {

    const {
      name, description,
      number_organizers, number_participants,
      date_debut, date_end,
      tasks = [],
      announcementDate, announcementTime,
      discordMessage
    } = req.body;

    const savedTasks = [];

    // 1. Save organizers + tasks
    for (const task of tasks) {
      const organizersList = task.organizers || [];

      // Insert only if organizers exist
      let savedOrganizers = [];
      if (organizersList.length > 0) {
        savedOrganizers = await Organizer.insertMany(organizersList);
      }

      const t = await Task.create({
        ...task,
        organizers: savedOrganizers.map(o => o._id)
      });

      savedTasks.push(t._id);
    }

    // 2. Save event
    const event = await Event.create({
      name,
      description,
      number_organizers,
      number_participants,
      date_debut,
      date_end,
      tasks: savedTasks,
      announcementDate,
      announcementTime,
      discordMessage
    });

    // 3. Build cron expression (correct format)
    const cronExpr = convertToCron(announcementDate, announcementTime);
    console.log("📌 Cron scheduled:", cronExpr);

    cron.schedule(cronExpr, () => {
      console.log("⏰ Cron triggered! Sending announcement...");
      sendDiscordMessage(discordMessage);
    });

    return res.status(201).json({
      message: "Event created & announcement scheduled",
      event
    });

  } catch (error) {
    console.error("❌ Error creating event:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Helper: convert date+time → cron
function convertToCron(dateStr, timeStr) {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");

  // node-cron format: second minute hour day month weekday
  return `0 ${minute} ${hour} ${day} ${month} *`;
}
