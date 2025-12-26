// Rate Limiting Middleware for Security

const rateLimit = require('express-rate-limit');

// General API rate limiting - 100 requests per 15 minutes
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for authentication endpoints - 5 attempts per 15 minutes
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again in 15 minutes.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
});

// Password reset rate limiting - 3 attempts per hour
const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again in 1 hour.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// File upload rate limiting - 10 uploads per hour per IP
const fileUploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 file uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again in 1 hour.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiting - 3 registrations per hour per IP
const registrationRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again in 1 hour.',
    statusCode: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalRateLimit,
  authRateLimit,
  passwordResetRateLimit,
  fileUploadRateLimit,
  registrationRateLimit
};