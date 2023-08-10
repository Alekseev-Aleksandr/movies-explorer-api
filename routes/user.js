const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMyInfo,
  updateMyInfo,
  logOut,
} = require('../controllers/users');

router.get('/users/me', getMyInfo);

router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
    }),
  }),
  updateMyInfo,
);

router.get('/signout', logOut);

module.exports = router;
