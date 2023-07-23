import OpenAi from "../services/open-ai.js";
import DiscorClient from "../services/discord.js";

const { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID } = process.env;

export const setupDiscordBot = () => {
	DiscorClient.on("messageCreate", async function (message) {
		if (message.author.bot || !message.mentions.users.get(DISCORD_CLIENT_ID)) return;
		
		try {
			const response = await OpenAi.createChatCompletion({
				model: "gpt-3.5-turbo",
				messages: [
						{role: "system", content: "You are a helpful assistant who responds succinctly"},
						{role: "user", content: message.content}
				],
			});
	
			const content = response.data.choices[0].message;
			return message.reply(content);
	
		} catch (err) {
			return message.reply(
				"As an AI robot, I errored out."
			);
		}
	});
	
	DiscorClient.login(DISCORD_BOT_TOKEN);
};