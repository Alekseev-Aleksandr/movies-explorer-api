const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const NotFound = require('./errors/NotFound');
const { errorLogger, requestLogger } = require('./middlewares/logger');
require('dotenv').config();

const {
  PORT = 4000,
  MONGO_URL = 'mongodb://localhost:27017',
} = process.env;

const app = express();
mongoose.connect(`${MONGO_URL}/bitfilmsdb`);
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);

app.use('*', (req, res, next) => {
  try {
    throw new NotFound('404 page not found');
  } catch (err) {
    next(err);
  }
});
app.use(errors());

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message || 'Server error' });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Listen ${PORT} port`);
});
