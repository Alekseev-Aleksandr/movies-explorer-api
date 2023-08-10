const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const BadRequest = require('../errors/BadRequest');
const { MESSAGE_400, MESSAGE_409 } = require('../utils/errMessages');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new Unauthorized(MESSAGE_409));
  }

  let payload;
  const {
    NODE_ENV = 'noProd',
    JWT_SECRET = 'unique-secret-key',
  } = process.env;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'unique-secret-key',
    );
  } catch (err) {
    if (err.name === 'JsonWebTokenError') next(new BadRequest(MESSAGE_400));
    throw new Unauthorized(MESSAGE_409);
  }
  req.user = payload;
  return next();
};
