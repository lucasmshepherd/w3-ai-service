import Express from 'express';
import SetupMiddleware from './middleware/_index.js';
import SetupRouting from './routing/_index.js';
import { setupDiscordBot } from './utils/setup-discord.js';
import { setupTelegramBot } from './utils/setup-telegram.js';

const { PORT } = process.env;
const EXPRESS = Express();

// Setup Middleware
SetupMiddleware(EXPRESS);

// Setup Routes
SetupRouting(EXPRESS);

// Setup Discord Bot Handler
setupDiscordBot();

// Setup Telegram Bot Handler
setupTelegramBot();

// Listener
EXPRESS.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
