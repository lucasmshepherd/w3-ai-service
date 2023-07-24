import Axios from '../services/axios.js';
import OpenAi from '../services/open-ai.js';

const { TG_BOT_API_URL, TG_BOT_API_TOKEN } = process.env;

export default async function (EXPRESS) {
  // Get featured items (categories and products)
  EXPRESS.post('/openai/ask', async (req, res) => {
    const chatId = req.body?.message?.chat?.id;
    const text = req.body?.message?.text;
    const entities = req.body?.message?.entities;

    try {
      if (text && typeof text === 'string') {
        const botCommandEntities = entities?.filter((entity) => entity['type'] === 'bot_command');

        if (botCommandEntities && botCommandEntities.length > 0) {
          const commands = botCommandEntities.map((entity) => text.substring(entity['offset'], entity['offset'] + entity['length']));

          if (commands.find((item) => item.includes('/ask'))) {
            try {
              const chatCompletion = await OpenAi.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: text}],
              });

              const CHAT_RESPONSE = chatCompletion?.data?.choices[0]?.message?.content;

              if (CHAT_RESPONSE) {
                await Axios.post(`${TG_BOT_API_URL}${TG_BOT_API_TOKEN}/sendMessage`, {
                  chat_id: chatId,
                  text: CHAT_RESPONSE,
                }).then((response) => {
                  res.status(200).send(response);
                }).catch((error) => {
                  res.send(error);
                });
              } else {
                throw new Error('An unkown error occurred.')
              }
            } catch (error) {
              if (error?.response?.status) {
                switch(error.response.status) {
                  case 401:
                    console.log(error.response.status, error.response.data);
                    // If this occurs, check the .env file for a valid API key.
                    res.status(500).send(`[Error Code 01]: We received your question, but were unable to complete your request unfortunately.`);
                    break;
                  case 429:
                    console.log(error.response.status, error.response.data);
                    // If this occurs, you've likely exceeded your limt/quota and need to the status of the API key
                    res.status(500).send(`[Error Code 02]: We received your question, but were unable to complete your request unfortunately.`);
                    break;
                }
              } else {
                console.log(error.response.status, error.response.data);
                // Some other issue happened with the Open AI service that hasn't been accounted for.
                res.status(500).send(`[Error Code 99]: We received your question, but were unable to complete your request unfortunately.`);
              }
            }
          }
        } else {
          res.status(200).send(`Not a command`)
        }

      } else {
        res.status(200).send(`Please ensure the request body has a text in the 'text' property and that it's a string.`)
      }
    } catch (error) {
      // This is likely coding/logic error that was unexpected
      res.status(500).send('An unknown error occurred.');
    }
  });
}
