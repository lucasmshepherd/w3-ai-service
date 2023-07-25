import TelegramBot from 'node-telegram-bot-api';

const { TG_BOT_API_TOKEN } = process.env;

// Created instance of TelegramBot
const TelegramBotClient = new TelegramBot(TG_BOT_API_TOKEN, {
	polling: true
});

export default TelegramBotClient;
