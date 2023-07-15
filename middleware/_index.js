import Express from 'express';
import Morgan from 'morgan';
import { LocalCorsMiddleware, StandardCorsMiddleware } from './cors.js';

const IS_LOCAL = process.env.ENV === 'local';

export default function (EXPRESS) {
  // Parses `Content-Type: 'application/json'` (JSON bodies)
  EXPRESS.use(Express.json());

  // Parses `Content-Type: 'x-www-form-urlencoded'` (URL-encoded bodies)
  EXPRESS.use(Express.urlencoded({ extended: false }));

  if (IS_LOCAL) {
    // Cross-Origin Resource Sharing (CORS)
    EXPRESS.use(LocalCorsMiddleware);

    // Live console access log for development
    EXPRESS.use(Morgan('dev'));
  } else {
    // Cross-Origin Resource Sharing (CORS)
    EXPRESS.use(StandardCorsMiddleware);
  }
}