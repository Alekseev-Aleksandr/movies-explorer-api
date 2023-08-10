const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMyFilms,
  createFilm,
  deleteFilm,
} = require('../controllers/movies');

const regExp = /^(https?):\/\/[^ "]+$/;

router.get('/movies', getMyFilms);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().min(2).max(30).required(),
    image: Joi.string().pattern(regExp).required(),
    trailerLink: Joi.string().pattern(regExp).required(),
    thumbnail: Joi.string().pattern(regExp).required(),
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
    movieId: Joi.number().required(),
  }),
}), createFilm);

router.delete(
  '/movies/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteFilm,
);
module.exports = router;
