import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

// Strict rate limiter for authentication endpoints (login) to prevent brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 1000 : 10, // Limit each IP to 10 login requests per windowMs in production
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
});

// Admin mutation limiter to protect against bulk resource exhaustion and Cloudinary quota abuse
export const adminMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 1000 : 60, // Limit each IP to 60 mutations per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many administrative modification requests from this IP. Please wait a few minutes before trying again.',
  },
});

// Standard API rate limiter for general requests
export const generalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: isTest ? 5000 : 200, // Limit each IP to 200 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

