import Cors from 'cors';

export const LocalCorsMiddleware = Cors({
  credentials: true,
  origin: (origin, callback) => {
    // 'undefined' is same-origin.
    if (typeof origin === 'undefined' || origin.includes('http://localhost') || origin.includes('http://127.0.0.1')) {
      callback(null, true);
    } else {
      callback(new Error('Invalid origin'), false);
    }
  }
});

export const StandardCorsMiddleware = Cors();