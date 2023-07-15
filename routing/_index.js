import OpenAiRoutes from './open-ai.js';

export default function (EXPRESS) {
  // IMPORTANT: The order of route registration matters! The first matchiing route is used, so any generic or catch all
  // routes should come last.
  OpenAiRoutes(EXPRESS);
}