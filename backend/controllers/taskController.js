import task from "../models/task.js";
export const getTasks = async (req, res) => {
  try {
    const tasks = await task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Server error" });
  }
};
