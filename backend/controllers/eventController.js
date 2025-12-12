import Event from "../models/event.js";
import Task from "../models/task.js";
import Organizer from "../models/organizer.js";
import cron from "node-cron";
import { sendDiscordMessage } from "../discordBot/bot.js";

export const createEvent = async (req, res) => {
  try {
    const {
      name, description,
      number_organizers, number_participants,
      date_debut, date_end,
      tasks,
      announcementDate, announcementTime,
      discordMessage
    } = req.body;

    // 1. Save organizers and tasks
    const savedTasks = [];

    for (const task of tasks) {
      const savedOrganizers = await Organizer.insertMany(task.organizers);

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

    // 3. Schedule Discord announcement
    const cronExpr = convertToCron(announcementDate, announcementTime);

    cron.schedule(cronExpr, () => {
      sendDiscordMessage(discordMessage);
    });

    return res.status(201).json({ message: "Event created & announcement scheduled", event });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Helper: convert date/time to cron
function convertToCron(dateStr, timeStr) {
  const [year, month, day] = dateStr.split("-");
  const [hour, minute] = timeStr.split(":");

  // minute hour day month any-year
  return `${minute} ${hour} ${day} ${month} *`;
}
