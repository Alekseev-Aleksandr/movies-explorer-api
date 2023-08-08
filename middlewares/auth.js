const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');
const BadRequest = require('../errors/BadRequest');
require('dotenv').config();

module.exports = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies.jwt;
  console.log('token = ', token);
  if (!token) {
    return next(new Unauthorized('Please log in'));
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
    console.log('payload = ', payload);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') next(new BadRequest('Invalid token'));
    throw new Unauthorized('Please log in');
  }
  req.user = payload;
  return next();
};