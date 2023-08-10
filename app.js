const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const centerErrHandler = require('./middlewares/centerErrHandler');
const { limiter, MONGO_URL, PORT } = require('./utils/utils');

const app = express();
app.use(express.json());
mongoose.connect(`${MONGO_URL}/bitfilmsdb`);

app.use(limiter);
app.use(cookieParser());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(centerErrHandler);

app.listen(PORT, () => {
  console.log(`Listen ${PORT} port`);
});
