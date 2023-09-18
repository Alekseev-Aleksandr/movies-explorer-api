const rateLimit = require('express-rate-limit');
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017',
} = process.env;

module.exports = {
  PORT,
  limiter,
  MONGO_URL,
};
