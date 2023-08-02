import OpenAi from "../services/open-ai.js";
import TelegramBotClient from "../services/telegram.js";
import { makeResponse } from "./text-util.js";

export const setupTelegramBot = () => {
	TelegramBotClient.onText(/\/ask/, async (msg, match) => {
		// 'msg' is the received Message from Telegram
		// 'match' is the result of executing the regexp above on the text content
		// of the message
		const chatId = msg.chat.id;
		const text = match.input.split(' ').slice(1).join(' ') || 'hi';

		const messages = [
			{role: "user", content: text},
		];

		let response = 'We received your question, but were unable to complete your request unfortunately.';

		for (let finish_reason = 'length'; finish_reason === 'length';) {
			try {
				const chatCompletion = await OpenAi.createChatCompletion({
					model: "gpt-3.5-turbo",
					messages,
				});

				const choice = chatCompletion?.data?.choices[0];
				response = choice?.message?.content || '';
				finish_reason = choice?.finish_reason;
			} catch (error) {
				if (error?.response?.status) {
					console.log(error.response.status, error.response.data);
					switch(error.response.status) {
						case 401:
							// If this occurs, check the .env file for a valid API key.
							response = `[Error Code 01]: We received your question, but were unable to complete your request unfortunately.`;
							break;
						case 429:
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

			const chunks = makeResponse(response);

			for (const chunk of chunks) {
				await TelegramBotClient.sendMessage(
					chatId,
					chunk,
				);
			}

			if (finish_reason === 'length') {
				messages.push({ role: 'assistant', content: response.slice(-200) });
				messages.push({ role: 'user', content: 'Please continue' });
			}
		}

		// TelegramBotClient.sendMessage(
		// 	chatId,
		// 	' ',
		// 	{
		// 		reply_markup: {
		// 			inline_keyboard: [[
		// 				{
		// 					text: 'Open App',
		// 					url: `https://rewardz.network?username=${msg.from.username}`,
		// 				}
		// 			]]
		// 		}
		// 	}
		// );
	});

	// Listener (handler) for callback data from /label command
	TelegramBotClient.on('callback_query', (callbackQuery) => {
		const message = callbackQuery.message;
		const category = callbackQuery.data;

		TelegramBotClient.sendMessage(message.chat.id, `${category} clicked!`);
	});
}

