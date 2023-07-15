import Express from 'express';
import SetupMiddleware from './middleware/_index.js';
import SetupRouting from './routing/_index.js';

const { PORT } = process.env;
const EXPRESS = Express();

// Setup Middleware
SetupMiddleware(EXPRESS);

// Setup Routes
SetupRouting(EXPRESS);

// Listener
EXPRESS.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});