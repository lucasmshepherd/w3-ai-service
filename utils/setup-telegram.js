import OpenAi from "../services/open-ai.js";
import TelegramBotClient from "../services/telegram.js";

export const setupTelegramBot = () => {
	TelegramBotClient.onText(/\/ask/, async (msg, match) => {
		// 'msg' is the received Message from Telegram
		// 'match' is the result of executing the regexp above on the text content
		// of the message
		const chatId = msg.chat.id;
		const text = match.input.split(' ').slice(1).join(' ') || 'hi';

		let response = '';

		try {
			const chatCompletion = await OpenAi.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [{role: "user", content: text}],
			});

			response = chatCompletion?.data?.choices[0]?.message?.content;
		} catch (error) {
			if (error?.response?.status) {
				switch(error.response.status) {
					case 401:
						console.log(error.response.status, error.response.data);
						// If this occurs, check the .env file for a valid API key.
						response = `[Error Code 01]: We received your question, but were unable to complete your request unfortunately.`;
						break;
					case 429:
						console.log(error.response.status, error.response.data);
						// If this occurs, you've likely exceeded your limt/quota and need to the status of the API key
						response = `[Error Code 02]: We received your question, but were unable to complete your request unfortunately.`;
						break;
				}
			} else {
				console.log(error.response.status, error.response.data);
				// Some other issue happened with the Open AI service that hasn't been accounted for.
				response = `[Error Code 99]: We received your question, but were unable to complete your request unfortunately.`;
			}
		}

		TelegramBotClient.sendMessage(
			chatId,
			response,
			{
				reply_markup: {
					inline_keyboard: [[
						{
							text: 'Open App',
							url: `https://rewardz.network?username=${msg.from.username}`,
						}
					]]
				}
			}
		);
	});

	// Listener (handler) for callback data from /label command
	TelegramBotClient.on('callback_query', (callbackQuery) => {
		const message = callbackQuery.message;
		const category = callbackQuery.data;

		TelegramBotClient.sendMessage(message.chat.id, `${category} clicked!`);
	});
}

