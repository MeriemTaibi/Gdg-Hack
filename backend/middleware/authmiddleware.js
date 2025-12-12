

export const authMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const ADMIN_KEY = "superadmin123";
  if (!apiKey || apiKey !== ADMIN_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key" });
  }
  next();
};
