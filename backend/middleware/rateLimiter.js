const rateLimit = require("express-rate-limit");
const env = require("../config/env");

const apiLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: "Too many requests, please try again later.",
      statusCode: 429,
    },
  },
});

module.exports = apiLimiter;
