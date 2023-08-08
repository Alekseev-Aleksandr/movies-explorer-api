const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const movieRouters = require('./movie');
const userRouters = require('./user');
const auth = require('../middlewares/auth');

const {
  createNewUser,
  login,
} = require('../controllers/users');

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
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

module.exports = router;
