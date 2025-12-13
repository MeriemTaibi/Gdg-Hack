// config/deepseek.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const deepseek = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
