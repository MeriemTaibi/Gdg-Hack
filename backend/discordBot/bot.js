import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

bot.on("ready", () => {
  console.log(`Discord bot logged in as ${bot.user.tag}`);
});

bot.login(process.env.DISCORD_BOT_TOKEN);

export const sendDiscordMessage = async (message) => {
  try {
    const channel = await bot.channels.fetch(process.env.DISCORD_CHANNEL_ID);
    await channel.send(message);
    console.log("Announcement sent to Discord");
  } catch (err) {
    console.error("Failed to send Discord message:", err);
  }
};
