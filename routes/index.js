const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieRouters = require('./movie');
const userRouters = require('./user');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const { MESSAGE_404_PAGE } = require('../utils/errMessages');

const {
  createNewUser,
  login,
} = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createNewUser,
);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login,
);

router.use(auth);

router.use(userRouters);
router.use(movieRouters);

router.use('*', (req, res, next) => {
  try {
    throw new NotFound(MESSAGE_404_PAGE);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
