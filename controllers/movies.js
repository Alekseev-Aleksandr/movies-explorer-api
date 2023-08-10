const Movie = require('../models/movie');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

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
        next(new BadRequest('Incorect data'));
      }
      next(err);
    });
});

const deleteFilm = ((req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => {
      throw new NotFound('Not found movie by id');
    })
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.deleteOne(movie)
          .then((res).send({ message: 'movie was deleted' }));
      }
      throw new Forbidden('No rights to delete');
    })
    .catch(next);
});

module.exports = {
  getMyFilms,
  createFilm,
  deleteFilm,
};
