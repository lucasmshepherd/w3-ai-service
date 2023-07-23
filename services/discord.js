import { Client, GatewayIntentBits } from "discord.js";

const DiscorClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

export default DiscorClient;