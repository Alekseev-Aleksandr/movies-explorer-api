const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');
const {
  MESSAGE_400,
  MESSAGE_404_BY_ID,
  MESSAGE_WAS_DELETE,
  MESSAGE_403,
} = require('../utils/errMessages');

const getMyFilms = ((req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
});

const createFilm = ((req, res, next) => {
  Movie.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(MESSAGE_400));
      }
      next(err);
    });
});

const deleteFilm = ((req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFound(MESSAGE_404_BY_ID);
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.deleteOne(movie)
          .then((res).send({ message: MESSAGE_WAS_DELETE }));
      }
      throw new Forbidden(MESSAGE_403);
    })
    .catch(next);
});

module.exports = {
  getMyFilms,
  createFilm,
  deleteFilm,
};
