import { Configuration, OpenAIApi } from 'openai';

// Configure
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create Instance
const OpenAi = new OpenAIApi(config);

export default OpenAi;
