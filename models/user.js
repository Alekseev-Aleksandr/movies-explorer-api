const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validator: (v) => validator.isEmail(v),
    message: 'Invalid email',
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password, next) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new Unauthorized('Invalid password or login111');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Invalid password or login');
          }
          return (user);
        })
        .catch(next);
    })
    .catch(next);
};

userSchema.statics.createHashForPass = function (id) {
  return bcrypt.hash(id, 10);
};

module.exports = mongoose.model('user', userSchema);
