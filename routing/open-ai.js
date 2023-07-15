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
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: "Hello world"}],
          });
  
          // TODO: Build the logic after Open AI responds
          console.log(chatCompletion);
        } catch (error) {
          if (error?.response?.status === 401) {
            // If this occurs, check the .env file for a valid API key.
            res.status(500).send(`[Error Code 1]: We received your question, but were unable to complete your request unfortunately.`);
          } else {
            // Some other issue happened with the Open AI service that hasn't been accounted for.
            res.status(500).send(`[Error Code 2]: We received your question, but were unable to complete your request unfortunately.`);
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