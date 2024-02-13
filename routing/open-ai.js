import OpenAi from '../services/open-ai.js';

export default async function (EXPRESS) {
  // Get featured items (categories and products)
  EXPRESS.post('/openai/ask', async (req, res) => {
    const Question = req.body?.question;
    try {
      if (Question && typeof Question === 'string') {
        // Usage Example
        try {
          const chatCompletion = await OpenAi.createChatCompletion({
            model: "gpt-4",
            messages: [{role: "user", content: Question}],
          });

          const CHAT_RESPONSE = chatCompletion?.data?.choices[0]?.message?.content;

          if (CHAT_RESPONSE) {
            res.send(CHAT_RESPONSE);
          } else {
            throw new Error('An unkown error occurred.')
          }
        } catch (error) {
          if (error?.response?.status) {
            switch(error.response.status) {
              case 401:
                console.log(error.response.status, error.response.data);
                // If this occurs, check the .env file for a valid API key.
                res.status(500).send(`[Error Code 01]: We received your question, but were unable to complete your request.`);
                break;
              case 429:
                console.log(error.response.status, error.response.data);
                // If this occurs, you've likely exceeded your limt/quota and need to the status of the API key
                res.status(500).send(`[Error Code 02]: We received your question, but were unable to complete your request.`);
                break;
            }
          } else {
            console.log(error.response.status, error.response.data);
            // Some other issue happened with the Open AI service that hasn't been accounted for.
            res.status(500).send(`[Error Code 99]: We received your question, but were unable to complete your request.`);
          }
        }
      } else {
        res.status(400).send(`Please ensure the request body has a question in the 'question' property and that it's a string.`)
      }
    } catch (error) {
      // This is likely coding/logic error that was unexpected
      res.status(500).send('An unknown error occurred.');
    }
  });
}