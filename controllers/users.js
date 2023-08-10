const jwt = require('jsonwebtoken');
const Conflict = require('../errors/Conflict');
const NotFound = require('../errors/NotFound');
const User = require('../models/user');
require('dotenv').config();

const {
  NODE_ENV = 'noProd',
  JWT_SECRET = 'unique-secret-key',
} = process.env;

const createNewUser = ((req, res, next) => {
  User.createHashForPass(req.body.password)
    .then((hash) => {
      req.body.password = hash;
      User.create(req.body)
        .then((user) => {
          res
            .send({
              email: user.email,
              name: user.name,
            });
        }).catch((err) => {
          if (err.code === 11000) {
            return next(new Conflict('a user with email this already exists'));
          }
          return next(err);
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('a user with email this already exists'));
      }
      return next(err);
    });
});

const getMyInfo = ((req, res, next) => {
  User.findById(req.body._id)
    .then((myInfo) => {
      if (myInfo) {
        res.send(
          {
            name: myInfo.name,
            email: myInfo.email,
          },
        );
      } else throw next(new NotFound('User with id not found'));
    }).catch(next);
});

const updateMyInfo = ((req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      next(new NotFound('User with id not found'));
    })
    .then((user) => res.send({ newUserInfo: user }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('a user with email this already exists'));
      }
      return next(err);
    });
});

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password, next)
    .then((user) => {
      const newToken = jwt.sign(
        { _id: user.id },
        NODE_ENV === 'production' ? JWT_SECRET : 'unique-secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', newToken, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send(({ message: 'All right', token: newToken }));
    })
    .catch(next);
};

const logOut = (req, res) => {
  res.status(202).clearCookie('jwt')
    .send({ message: 'пока пока' });
};

module.exports = {
  createNewUser,
  getMyInfo,
  updateMyInfo,
  login,
  logOut,
};
